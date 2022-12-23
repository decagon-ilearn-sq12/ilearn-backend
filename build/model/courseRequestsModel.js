"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseRequestInstance = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("../Config/index");
class courseRequestInstance extends sequelize_1.Model {
}
exports.courseRequestInstance = courseRequestInstance;
courseRequestInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
    },
    tutorId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    courseId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "pending",
        validate: {
            customValidator: (value) => {
                const enums = ["pending", "accepted", "declined"];
                if (!enums.includes(value)) {
                    throw new Error("not a valid option");
                }
            },
        },
    },
    studentId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
}, {
    sequelize: index_1.db,
    tableName: "course_requests",
});
