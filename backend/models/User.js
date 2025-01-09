import { DataTypes } from "sequelize";
import { sequelize } from "../config/config.js";

export const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255), // 255 is plenty and a common max length
      allowNull: false,
    },
  },
  {
    tableName: "users",
  },
);
