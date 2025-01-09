import { DataTypes } from "sequelize";
import { sequelize } from "../config/config.js";
import { Job } from "./Job.js";

export const Application = sequelize.define(
  "Application",
  {
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING(255),
      allowNull: true, // Adjust as needed
    },
    cv: {
      type: DataTypes.TEXT,
      allowNull: true, // Adjust as needed
    },
    job_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Job,
        key: "id",
      },
    },
  },
  {
    tableName: "applications",
  },
);
