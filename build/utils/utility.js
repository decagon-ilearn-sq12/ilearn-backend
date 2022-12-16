"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.verifySignature = exports.GenerateSignature = exports.GeneratePassword = exports.GenerateSalt = exports.option = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Config_1 = require("../Config");
exports.registerSchema = joi_1.default.object().keys({
    email: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    userType: joi_1.default.string().required(),
    confirm_password: joi_1.default.any()
        .equal(joi_1.default.ref("password"))
        .required()
        .label("Confirm password")
        .messages({ "any.only": "{{#label}} does not match" }),
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
