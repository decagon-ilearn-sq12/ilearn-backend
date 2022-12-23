"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const coursesRoutes_1 = __importDefault(require("./routes/coursesRoutes"));
const index_1 = require("./Config/index");
const dotenv_1 = __importDefault(require("dotenv"));
const errorMiddleware_1 = require("./Middlewares/errorMiddleware");
dotenv_1.default.config();
// this calls the database connection
(0, index_1.connectDB)();
const app = (0, express_1.default)();
// for cors
const allowedOrigins = [
    "http://localhost:5173",
    "https://ilearn-sq12.netlify.app",
];
app.use((0, cors_1.default)({ origin: "https://ilearn-sq12.netlify.app" }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use((0, cookie_parser_1.default)());
//routes
app.use("/users", usersRoutes_1.default);
app.use("/courses", coursesRoutes_1.default);
app.get("/", (req, res) => {
    res.status(200).send("api is running");
});
// not found error handler
app.use(errorMiddleware_1.notFound);
// error handler
app.use(errorMiddleware_1.errorHandler);
// app.use(appError);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
exports.default = app;
