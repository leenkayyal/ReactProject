import express from "express";
import {
  getAllApplications,
  createApplication,
} from "../controllers/applicationController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect the GET endpoint with authentication
router.get("/", authenticateUser, getAllApplications);
router.post("/", createApplication);

export { router as applicationRoutes };
