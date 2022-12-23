"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: process.env.CLOUDINARY_DIRECTORY,
        };
    },
});
// const fileFilter = (req: any, file: any, cb: any) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'pdf/pdf') {
//         cb(null, true);
//     } else {
//         cb({message: 'File type not supported'}, false);
//     }
// }
exports.upload = (0, multer_1.default)({
    storage: storage,
    //    fileFilter: fileFilter,
    //     limits: {fieldSize: 1024 * 1024 * 5}
});
