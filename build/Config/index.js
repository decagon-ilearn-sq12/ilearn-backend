"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.db = exports.GMAIL_USER = exports.GMAIL_PASS = exports.userSubject = exports.FromAdminMail = exports.APP_SECRET = exports.fromAdminPhone = exports.authToken = exports.accountSid = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.accountSid = process.env.AccountSID;
exports.authToken = process.env.AuthToken;
exports.fromAdminPhone = process.env.fromAdminPhone;
exports.APP_SECRET = process.env.APP_SECRET;
exports.FromAdminMail = process.env.FromAdminMail;
exports.userSubject = process.env.usersubject;
exports.GMAIL_PASS = process.env.GMAIL_USER;
exports.GMAIL_USER = process.env.GMAIL_PASS;
exports.db = new sequelize_1.Sequelize(process.env.DB_CONNECTION_STRING, {
    logging: false,
});
const connectDB = async () => {
    try {
        await exports.db.authenticate();
        await exports.db.sync();
        console.log("Connection has been established successfully.");
    }
    catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
exports.connectDB = connectDB;
