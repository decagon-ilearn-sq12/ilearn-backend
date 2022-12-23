"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseInstance = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("../Config/index");
class courseInstance extends sequelize_1.Model {
}
exports.courseInstance = courseInstance;
courseInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    course_image: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    // tutor_Name: {
    //   type: DataTypes.UUID,
    //   allowNull: false,
    // },
    tutorId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    pricing: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    course_material: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    rating: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    sequelize: index_1.db,
    tableName: "courses",
});
