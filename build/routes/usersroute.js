"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const authMiddleware_1 = require("../Middlewares/authMiddleware");
const router = express_1.default.Router();
// router.get("/", (req: Request, res: Response) => {
//   return res.status(200).json({
//     message: "my landing page",
//   });
// });
router.post("/signup", userController_1.Register);
router.post("/login", userController_1.Login);
router.get("/", authMiddleware_1.protect, userController_1.getAllUsers);
exports.default = router;
