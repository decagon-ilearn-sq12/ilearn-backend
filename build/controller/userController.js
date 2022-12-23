"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTutors = exports.tutorRating = exports.getAllReminders = exports.getRecommendedCourses = exports.createReminder = exports.resetPasswordPost = exports.resetPasswordGet = exports.forgotPassword = exports.getAllUsers = exports.Register = exports.Login = exports.getTutorDetails = exports.updateTutorProfile = exports.verifyUser = void 0;
const userModel_1 = require("../model/userModel");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const utility_1 = require("../utils/utility");
const notification_1 = require("../utils/notification");
const Config_1 = require("../Config");
const reminderModel_1 = require("../model/reminderModel");
const courseModel_1 = require("../model/courseModel");
const sequelize_1 = require("sequelize");
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel_1.UserInstance.findAll({
            attributes: { exclude: ["password", "salt"] },
        });
        // console.log(req.user && req.user.toJSON());
        res.status(200).json(users);
    }
    catch (error) {
        res.status(401).send("An error occurred");
    }
};
exports.getAllUsers = getAllUsers;
/**===================================== Register User ===================================== **/
const Register = async (req, res, next) => {
    try {
        const { email, password, confirm_password, areaOfInterest, userType } = req.body;
        const uuiduser = (0, uuid_1.v4)();
        //console.log(req.body)
        const validateResult = utility_1.registerSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //Generate salt
        const salt = await (0, utility_1.GenerateSalt)();
        const userPassword = await (0, utility_1.GeneratePassword)(password, salt);
        //check if the user exists
        const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
        if (User) {
            return res.status(400).json({
                message: "User already exist!",
            });
        }
        //Create User
        let createdUser;
        if (!User) {
            createdUser = await userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                password: userPassword,
                name: "",
                areaOfInterest,
                userType,
                verified: false,
                salt,
                image: "",
            });
            if (!createdUser) {
                return res.status(500).send({ message: "unable to create user" });
            }
            let signature = await (0, utility_1.GenerateSignature)({
                id: createdUser.id,
                email: createdUser.email,
                verified: createdUser.verified,
            });
            console.log(process.env.fromAdminMail, email, Config_1.userSubject);
            // send Email to user
            const link = `Press <a href=${process.env.BASE_URL}/users/verify/${signature}> here </a> to verify your account. Thanks.`;
            const html = (0, notification_1.emailHtml3)(link);
            await (0, notification_1.mailSent)(process.env.fromAdminMail, email, "Ilearn User Verification", html);
            //check if user exist
            return res.status(201).json({
                message: "You have registered successfully, Check your email for verification",
            });
        }
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/signup",
            err,
        });
    }
};
exports.Register = Register;
/**==================== Verify Users ========================**/
const verifyUser = async (req, res) => {
    try {
        const token = req.params.signature;
        // Verify the signature
        const { id, email, verified } = await (0, utility_1.verifySignature)(token);
        // Find the user with the matching verification token
        const user = await userModel_1.UserInstance.findOne({ where: { id } });
        if (!user) {
            throw new Error("Invalid verification token");
        }
        // Set the user's verified status to true
        const User = await userModel_1.UserInstance.update({
            verified: true,
        }, { where: { id } });
        await user.save();
        // Redirect the user to the login page
        return res.redirect(301, `${process.env.CLIENT_URL}/login`);
        // res
        //   .status(200)
        //   .send({
        //     message: "user has been verified successfully",
        //     success: true,
        //   })
        //   .redirect(`${process.env.CLIENT_URL}/login`);
        // Send a success response to the client
        // return res.status(201).json({ message: 'Your email has been verified.' });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/verify",
        });
    }
};
exports.verifyUser = verifyUser;
/**==================== Login User ========================**/
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateResult = utility_1.loginSchema.validate(req.body, utility_1.option);
        console.log("bug");
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //check if the user exist
        const User = await userModel_1.UserInstance.findOne({
            where: { email: email },
        });
        console.log(User);
        if (!User) {
            return res.status(400).json({
                Error: "Wrong Username or password",
            });
        }
        if (User.verified) {
            const validation = await (0, utility_1.validatePassword)(password, User.password, User.salt);
            if (validation) {
                //Regenerate a signature
                let signature = await (0, utility_1.GenerateSignature)({
                    id: User.id,
                    email: User.email,
                    verified: User.verified,
                });
                return res.status(200).json({
                    message: "You have successfully logged in",
                    signature,
                    email: User.email,
                    verified: User.verified,
                });
            }
            return res.status(400).json({
                Error: "Wrong Username or password",
            });
        }
        return res.status(400).json({
            Error: "you have not been verified",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/login",
        });
    }
};
exports.Login = Login;
/**=========================== Resend Password ============================== **/
// febic69835@bitvoo.com
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const validateResult = utility_1.forgotPasswordSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //check if the User exist
        const oldUser = await userModel_1.UserInstance.findOne({
            where: { email: email },
        });
        //console.log(oldUser);
        if (!oldUser) {
            return res.status(400).json({
                message: "user not found",
            });
        }
        const secret = Config_1.APP_SECRET + oldUser.password;
        const token = jsonwebtoken_1.default.sign({ email: oldUser.email, id: oldUser.id }, secret, {
            expiresIn: "1d",
        });
        const link = `${process.env.CLIENT_URL}/users/resetpassword/?userId=${oldUser.id}&token=${token}`;
        if (oldUser) {
            const html = (0, notification_1.emailHtml2)(link);
            await (0, notification_1.mailSent2)(Config_1.FromAdminMail, oldUser.email, Config_1.userSubject, html);
            return res.status(200).json({
                message: "password reset link sent to email",
                link,
            });
        }
        //console.log(link);
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/forgot-password",
        });
    }
};
exports.forgotPassword = forgotPassword;
//On clicking the email link ,
const resetPasswordGet = async (req, res) => {
    const { id, token } = req.params;
    const oldUser = await userModel_1.UserInstance.findOne({
        where: { id: id },
    });
    if (!oldUser) {
        return res.status(400).json({
            message: "User Does Not Exist",
        });
    }
    const secret = Config_1.APP_SECRET + oldUser.password;
    console.log(secret);
    try {
        const verify = jsonwebtoken_1.default.verify(token, secret);
        return res.status(200).json({
            email: oldUser.email,
            verify,
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/resetpassword/:id/:token",
        });
    }
};
exports.resetPasswordGet = resetPasswordGet;
// Page for filling the new password and confirm password
const resetPasswordPost = async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
    console.log(req.body);
    const validateResult = utility_1.resetPasswordSchema.validate(req.body, utility_1.option);
    if (validateResult.error) {
        return res.status(400).json({
            Error: validateResult.error.details[0].message,
        });
    }
    const oldUser = await userModel_1.UserInstance.findOne({
        where: { id: id },
    });
    if (!oldUser) {
        return res.status(400).json({
            message: "user does not exist",
        });
    }
    const secret = Config_1.APP_SECRET + oldUser.password;
    try {
        const verify = jsonwebtoken_1.default.verify(token, secret);
        const encryptedPassword = await bcrypt_1.default.hash(password, oldUser.salt);
        const updatedPassword = (await userModel_1.UserInstance.update({
            password: encryptedPassword,
        }, { where: { id: id } }));
        return res.status(200).json({
            message: "you have succesfully changed your password",
            updatedPassword,
        });
    }
    catch (error) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/resetpassword/:id/:token",
        });
    }
};
exports.resetPasswordPost = resetPasswordPost;
/**=========================== Create a new Reminders============================== **/
const createReminder = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { title, description, startTime, endTime } = req.body;
        const { error } = (0, utility_1.validateReminder)(req.body);
        if (error)
            return res.status(400).send({ Error: error.details[0].message });
        const startDate = new Date(startTime);
        // calculate current date time that is one hour behind
        const currentDate = new Date().getTime() - new Date().getTimezoneOffset() * 60 * 1000;
        // check if the time is not in the past
        if (startDate.getTime() < currentDate) {
            res.status(405).send({
                Error: "Please choose a more current time",
            });
            return;
        }
        // create the reminder
        await reminderModel_1.ReminderInstance.create({
            title,
            description,
            startTime,
            endTime,
            userId,
        });
        res.status(200).send({
            message: "Reminder created sucessfully",
        });
    }
    catch (error) {
        res.status(500).json({
            Error: error,
        });
    }
};
exports.createReminder = createReminder;
/**=========================== Get all Reminders============================== **/
const getAllReminders = async (req, res) => {
    try {
        const userId = req.user?.id;
        const reminders = await reminderModel_1.ReminderInstance.findAll({ where: { id: userId } });
        return res.status(200).json({
            message: "You have successfully retrieved all reminders",
            reminders: reminders,
        });
    }
    catch (err) {
        return res.status(500).json({
            Error: "Internal server Error",
            route: "/users/get-all-reminders",
        });
    }
};
exports.getAllReminders = getAllReminders;
/**==================== Get all recmmended courses================**/
const getRecommendedCourses = async (req, res) => {
    try {
        const category = req.params.category;
        // const id = req.user?.id
        const recommendedCourse = await courseModel_1.courseInstance.findAll({
            where: { category, rating: { [sequelize_1.Op.gt]: 0 } },
            attributes: [
                "id",
                "title",
                "course_image",
                "rating",
                "pricing",
                "description",
                "category",
            ],
            order: [["rating", "DESC"]],
            limit: 10,
        });
        if (!recommendedCourse) {
            return res.status(400).json({ message: "No recommended courses found" });
        }
        res.status(200).json({
            message: "Recommended courses found",
            recommendedCourse,
        });
    }
    catch (error) {
        res.status(500).json({ Error: error.message });
    }
};
exports.getRecommendedCourses = getRecommendedCourses;
/**=========================== updateTutorProfile ============================== **/
const updateTutorProfile = async (req, res) => {
    try {
        const id = req.user?.id;
        const { name, areaOfInterest } = req.body;
        const joiValidateTutor = utility_1.updateTutorSchema.validate(req.body, utility_1.option);
        if (joiValidateTutor.error) {
            return res.status(400).json({
                Error: joiValidateTutor.error.details[0].message,
            });
        }
        const courses = await courseModel_1.courseInstance.findAndCountAll({
            where: { tutorId: id },
        });
        const totalCourses = courses.count.toString();
        const tutor = await userModel_1.UserInstance.findOne({ where: { id } });
        if (tutor === null) {
            return res.status(400).json({
                Error: "You are not authorized to update your profile",
            });
        }
        // console.log(Tutor);
        await tutor.update({
            image: req.file?.path,
            name,
            totalCourses,
            areaOfInterest,
        });
        const updateTutor = await tutor.save();
        // await updateTutor.save({fields: ['name', 'totalCourses', 'areaOfInterest', 'image']})
        // this is for saving some fields
        if (updateTutor) {
            const tutor = await userModel_1.UserInstance.findOne({ where: { id } });
            return res.status(200).json({
                message: "You have successfully updated your account",
                tutor,
            });
        }
        return res.status(400).json({
            Error: "There's an error",
        });
    }
    catch (error) {
        return res.status(500).json({
            Error: "Internal server error",
            route: "/vendor/update-profile",
            error,
        });
    }
};
exports.updateTutorProfile = updateTutorProfile;
/**=========================== get Tutor Details ============================== **/
const getTutorDetails = async (req, res) => {
    try {
        const tutorId = req.params.tutorid;
        const tutorDetails = await userModel_1.UserInstance.findOne({ where: { id: tutorId } });
        if (tutorDetails !== null) {
            return res.status(200).json({
                message: tutorDetails,
            });
        }
        return res.status(400).json({
            Error: "Tutor does not exist",
        });
    }
    catch (error) {
        return res.status(500).json({
            Error: "Internal server error",
            route: "/vendor/update-profile",
        });
    }
};
exports.getTutorDetails = getTutorDetails;
const getAllTutors = async (req, res, next) => {
    try {
        const findTutor = await userModel_1.UserInstance.findAll({
            where: { userType: "Tutor" },
            attributes: ["id", "email", "name", "rating"],
        });
        return res.status(200).json({
            TutorNumber: findTutor.length,
            findTutor,
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.getAllTutors = getAllTutors;
const tutorRating = async (req, res, next) => {
    try {
        let page = req.query.page;
        let limit = req.query.limit;
        const offset = page ? page * limit : 0;
        const tutorSorted = await userModel_1.UserInstance.findAll({
            where: { userType: "Tutor", rating: { [sequelize_1.Op.gt]: 0 } },
            attributes: ["id", "email", "name", "image", "rating"],
            order: [["rating", "DESC"]],
            limit: limit,
            offset: offset,
        });
        return res.status(200).json({
            TutorNumber: tutorSorted.length,
            tutorSorted,
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.tutorRating = tutorRating;
