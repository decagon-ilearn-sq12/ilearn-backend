"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingInstance = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("../Config/index");
class RatingInstance extends sequelize_1.Model {
}
exports.RatingInstance = RatingInstance;
RatingInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    courseId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    studentId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    value: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    sequelize: index_1.db,
    tableName: "rating",
});
