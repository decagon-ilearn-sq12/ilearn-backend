"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailHtml = exports.mailSent = exports.onRequestOTP = exports.GenerateOTP = void 0;
const Config_1 = require("../Config");
const nodemailer_1 = __importDefault(require("nodemailer"));
const GenerateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const expiry = new Date();
    expiry.setTime(new Date().getTime() + (30 * 60 * 1000));
    return { otp, expiry };
};
exports.GenerateOTP = GenerateOTP;
//using Twilio as sms.......how to send otp to user
const onRequestOTP = async (otp, toPhoneNumber) => {
    const client = require('twilio')(Config_1.accountSid, Config_1.authToken);
    const response = await client.messages
        .create({
        body: `Your OTP is ${otp}`,
        to: toPhoneNumber,
        from: Config_1.fromAdminPhone
    });
    return response;
};
exports.onRequestOTP = onRequestOTP;
const transport = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: Config_1.GMAIL_USER,
        pass: Config_1.GMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});
const mailSent = async (from, to, subject, html) => {
    try {
        const response = await transport.sendMail({ from: Config_1.FromAdminMail, to, subject: Config_1.userSubject, html });
        return response;
    }
    catch (err) {
        console.log(err);
    }
};
exports.mailSent = mailSent;
const emailHtml = (otp) => {
    let response = `
    <div style = "max-width:700px; 
        margin:auto; 
        border:10px solid #ddd;
        padding:50px 20px; 
        font-size:110%;">
    <h2 style="text-align:center;
        text-transform:uppercase;
        color:teal;">
            Welcome to ILearn
    </h2>
    <p> Hi there, your otp is ${otp} </p>
    </div>
    `;
    return response;
};
exports.emailHtml = emailHtml;
