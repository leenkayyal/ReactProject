import { DataTypes } from "sequelize";
import { sequelize } from "../config/config.js";

export const Session = sequelize.define(
  "Session",
  {
    token: {
      type: DataTypes.STRING(64),
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    indexes: [{ fields: ["expiresAt"] }, { fields: ["userId"] }],
    tableName: "sessions",
  },
);
