"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const authMiddleware_1 = require("../Middlewares/authMiddleware");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
// router.get("/", (req: Request, res: Response) => {
//   return res.status(200).json({
//     message: "my landing page",
//   });
// });
router.post("/signup", userController_1.Register);
router.post("/login", userController_1.Login);
router.get("/verify/:signature", userController_1.verifyUser);
router.get("/", authMiddleware_1.protect, userController_1.getAllUsers);
router.get("/atutordetail/:tutorid", authMiddleware_1.protect, userController_1.getTutorDetails);
router.put("/updatetutorprofile", authMiddleware_1.protect, multer_1.upload.single("image"), userController_1.updateTutorProfile);
router.post("/forgot-password", userController_1.forgotPassword);
router.get("/resetpassword/:id/:token", userController_1.resetPasswordGet);
router.post("/resetpassword/:id/:token", userController_1.resetPasswordPost);
router.post("/reminders", authMiddleware_1.protect, userController_1.createReminder);
router.get('/all-tutors', userController_1.getAllTutors);
router.get('/feature-tutors', userController_1.tutorRating);
//router.post("/request", protect, requestTutor);
router.get('/recommended/:category', authMiddleware_1.protect, userController_1.getRecommendedCourses);
exports.default = router;
