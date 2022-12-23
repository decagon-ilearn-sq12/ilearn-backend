"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReminderInstance = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("../Config/index");
class ReminderInstance extends sequelize_1.Model {
}
exports.ReminderInstance = ReminderInstance;
ReminderInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
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
    startTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    // duration: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    endTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: index_1.db,
    tableName: "reminder",
});
