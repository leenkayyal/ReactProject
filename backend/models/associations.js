import { Application } from "./Application.js";
import { User } from "./User.js";
import { Job } from "./Job.js";
import { Session } from "./Session.js";

export const setupAssociations = () => {
  User.hasMany(Job, {
    foreignKey: "userId",
    as: "jobs",
  });

  Job.belongsTo(User, {
    foreignKey: "userId",
    as: "owner",
  });

  Job.hasMany(Application, {
    foreignKey: "job_id",
    as: "applications",
    onDelete: "CASCADE",
  });

  Application.belongsTo(Job, {
    foreignKey: "job_id",
    as: "job",
  });

  Session.belongsTo(User, {
    foreignKey: "userId",
  });
};
