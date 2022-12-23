"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseController_1 = require("../controller/courseController");
const authMiddleware_1 = require("../Middlewares/authMiddleware");
const courseController_2 = require("../controller/courseController");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
//router.post("/addCourse", protect, addCourse);
router.get("/", courseController_1.getAllCourse);
router.get("/getStudentHistory", authMiddleware_1.protect, courseController_2.getStudentHistory);
router.post("/createCourse", authMiddleware_1.protect, multer_1.upload.fields([{ name: 'course_image', maxCount: 1 }, { name: 'course_material', maxCount: 2 }]), courseController_1.createCourse);
router.patch("/updateCourse/:id", authMiddleware_1.protect, courseController_1.updateCourse);
router.delete("/deleteCourse/:id", authMiddleware_1.protect, courseController_1.deleteCourse);
router.post("/addCourse", courseController_1.addCourse);
exports.default = router;
