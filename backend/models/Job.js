import { DataTypes } from "sequelize";
import { sequelize } from "../config/config.js";

export const Job = sequelize.define(
  "Job",
  {
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    salary: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    picture: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users", // Reference the table name instead of the model
        key: "id",
      },
    },
  },
  {
    tableName: "jobs",
  },
);
