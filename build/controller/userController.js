"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.Register = exports.Login = void 0;
const userModel_1 = require("../model/userModel");
const uuid_1 = require("uuid");
const utility_1 = require("../utils/utility");
const notification_1 = require("../utils/notification");
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel_1.UserInstance.findAll({
            attributes: { exclude: ["password", "salt"] },
        });
        // console.log(req.user && req.user.toJSON());
        res.status(200).send(users);
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
        //Generate OTP
        const { otp, expiry } = (0, notification_1.GenerateOTP)();
        //check if the user exists
        const User = await userModel_1.UserInstance.findOne({ where: { email: email } });
        //Create User
        if (!User) {
            const createUser = await userModel_1.UserInstance.create({
                id: uuiduser,
                email,
                password: userPassword,
                name: "",
                areaOfInterest,
                userType,
                verified: false,
                salt,
            });
            //console.log("create user is ", createUser)
            // send Email to user
            const html = (0, notification_1.emailHtml)(otp);
            // await mailSent(FromAdminMail, email, userSubject, html);
            //check if user exist
            const User = await userModel_1.UserInstance.findOne({
                where: { email: email },
            });
            if (!User) {
                return res.status(400).json("no user was created");
            }
            // Generate a signature for user
            let signature = await (0, utility_1.GenerateSignature)({
                id: User.id,
                email: User.email,
                verified: User.verified,
            });
            return res.status(201).json({
                message: "User created successfully Check your email for OTP verification",
                signature,
                verified: User.verified,
            });
        }
        return res.status(400).json({
            message: "User already exist!",
        });
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
/**===================================== Login Users ===================================== **/
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validateResult = utility_1.loginSchema.validate(req.body, utility_1.option);
        if (validateResult.error) {
            return res.status(400).json({
                Error: validateResult.error.details[0].message,
            });
        }
        //check if the user exist
        const User = (await userModel_1.UserInstance.findOne({
            where: { email: email },
        }));
        console.log(User.toJSON());
        if (User.verified === false) {
            const validation = await (0, utility_1.validatePassword)(password, User.password, User.salt); /*can equally use bcrypt.compare() */
            if (validation) {
                //Generate signature for the user
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
                    name: User.name,
                });
            }
        }
        res.status(400).json({
            Error: "Wrong Username or password",
        });
    }
    catch (err) {
        res.status(500).json({
            Error: "Internal server Error",
            route: "/users/login",
            err,
        });
    }
};
exports.Login = Login;
