"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourseSchema = exports.validateReminder = exports.updateTutorSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.validatePassword = exports.verifySignature = exports.GenerateSignature = exports.GeneratePassword = exports.GenerateSalt = exports.option = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Config_1 = require("../Config");
exports.registerSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    userType: joi_1.default.string().required(),
    areaOfInterest: joi_1.default.string().required(),
    // confirm_password: Joi.any()
    //   .equal(Joi.ref("password"))
    //   .required()
    //   .label("Confirm password")
    //   .messages({ "any.only": "{{#label}} does not match" }),
});
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
});
exports.option = {
    abortEarly: false /* means if there's an error in the first keys, it'll takecare of the error
                              first before moving on to the next error  */,
    errors: {
        wrap: { label: "" },
    },
};
const GenerateSalt = async () => {
    return await bcrypt_1.default.genSalt();
};
exports.GenerateSalt = GenerateSalt;
const GeneratePassword = async (password, salt) => {
    return await bcrypt_1.default.hash(password, salt);
};
exports.GeneratePassword = GeneratePassword;
const GenerateSignature = async (payload) => {
    try {
        return jsonwebtoken_1.default.sign(payload, Config_1.APP_SECRET, { expiresIn: "1d" });
    }
    catch (error) {
        throw "could not create a token";
    } /*1d means 1 day */
};
exports.GenerateSignature = GenerateSignature;
const verifySignature = async (signature) => {
    return jsonwebtoken_1.default.verify(signature, Config_1.APP_SECRET);
};
exports.verifySignature = verifySignature;
const validatePassword = async (enteredPassword, savedPassword, salt) => {
    return (await (0, exports.GeneratePassword)(enteredPassword, salt)) === savedPassword;
};
exports.validatePassword = validatePassword;
//schema for reset Password
exports.forgotPasswordSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
});
exports.resetPasswordSchema = joi_1.default.object().keys({
    password: joi_1.default.string().regex(/[a-zA-Z0-9]{3,30}/),
    //.pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirm_password: joi_1.default.any()
        .equal(joi_1.default.ref("password"))
        .required()
        .label("Confirm password")
        .messages({
        "any.only": "passwords does not match",
        "any.required": "You need to add a confirm password",
    }),
});
exports.updateTutorSchema = joi_1.default.object().keys({
    name: joi_1.default.string(),
    image: joi_1.default.string(),
    areaOfInterest: joi_1.default.string(),
    rating: joi_1.default.number()
});
// validate schema for creating of reminders
const validateReminder = (input) => {
    const schema = joi_1.default.object({
        title: joi_1.default.string()
            .min(3)
            .required()
            .messages({ "any.required": "A title is required" }),
        description: joi_1.default.string().min(30).required().messages({
            "any.only": "Description should not be more than 30 characters",
            "any.required": "You need to add a description",
        }),
        startTime: joi_1.default.string().isoDate().required().messages({
            "any.required": "You need to add a start time",
            "any.isoDate": "Start time should be an ISO Date",
        }),
        endTime: joi_1.default.string().isoDate().required().messages({
            "any.required": "You need to add an End time",
            "any.isoDate": "End time should be an ISO Date",
        }),
    });
    return schema.validate(input);
};
exports.validateReminder = validateReminder;
//schema for create_course
exports.createCourseSchema = joi_1.default.object().keys({
    title: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    price: joi_1.default.number().required(),
    category: joi_1.default.string().required(),
    image: joi_1.default.string().required(),
    video: joi_1.default.string().required(),
    file: joi_1.default.string().required(),
});
