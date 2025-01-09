import express from "express";
import { getAllJobs, createJob, deleteAllJobs } from "../controllers/jobController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllJobs);
router.post("/", authenticateUser, createJob);
router.delete("/all", deleteAllJobs);

export { router as jobRoutes };
