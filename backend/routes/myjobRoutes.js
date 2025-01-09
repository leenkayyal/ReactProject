import express from "express";
import { getCompanyJobs, removeMyJob } from "../controllers/jobController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, getCompanyJobs);
router.delete("/", authenticateUser, removeMyJob);

export { router as myjobRoutes };
