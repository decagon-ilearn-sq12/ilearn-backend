"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = require("../model/userModel");
//interface loguser extends Request, user {}
const protect = async (req, res, next) => {
    let token = "";
    if (req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        res.status(401).send({
            status: 401,
            message: "Not authorized, you have no access token",
        });
        return;
        //throw new Error('Not authorized, you have no access token')
    }
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            const { id } = jsonwebtoken_1.default.verify(token, process.env.APP_SECRET || "");
            // console.log(id)
            const user = await userModel_1.UserInstance.findByPk(id, {
                attributes: { exclude: ["password"] },
            });
            if (!user) {
                throw new Error(`not Authorized`);
            }
            //console.log()
            //req.user = user
            req.user = user;
            next();
        }
        catch (error) {
            //   console.log(error)
            res.status(401).send({ error, message: "you are not a valid user" });
            return;
            //   throw new Error(`${error}`)
        }
    }
};
exports.protect = protect;
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        res.status(401);
        res.send({ message: "Not authorized; you are not an admin" });
    }
    console.log(req.user);
};
exports.admin = admin;
