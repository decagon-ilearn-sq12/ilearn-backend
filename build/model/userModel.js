"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInstance = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("../Config/index");
const courseModel_1 = require("./courseModel");
const reminderModel_1 = require("./reminderModel");
class UserInstance extends sequelize_1.Model {
}
exports.UserInstance = UserInstance;
UserInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        //defaultValue: DataTypes.UUIDV4,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: { msg: "Email address required" },
            isEmail: { msg: "Please provide a valid email" },
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Password is required" },
            notEmpty: { msg: "Provide a password" },
        },
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    verified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        validate: {
            notNull: { msg: "User must be verified" },
            notEmpty: { msg: "User not verified" },
        },
        defaultValue: false,
    },
    salt: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: "Salt is required" },
            notEmpty: { msg: "Provide a salt" },
        },
    },
    areaOfInterest: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    userType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            customValidator: (value) => {
                const enums = ["Tutor", "Student"]; // to be changed to small letter
                if (!enums.includes(value)) {
                    throw new Error("value should be a Student or a Tutor");
                }
            },
        },
    },
    image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    rating: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    sequelize: index_1.db,
    tableName: "user",
});
UserInstance.hasMany(courseModel_1.courseInstance, {
    foreignKey: "tutorId",
    as: "course",
});
UserInstance.hasMany(reminderModel_1.ReminderInstance, {
    foreignKey: "userId",
    as: "reminder",
});
courseModel_1.courseInstance.hasOne(UserInstance, {
    foreignKey: "tutorId",
    as: "user",
});
