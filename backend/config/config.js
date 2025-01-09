import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("webdevproj2", "root", "94243746", {
  host: "127.0.0.1",
  dialect: "mysql",
});
