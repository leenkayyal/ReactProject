import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";

export async function getAllApplications(req, res) {
  try {
    // Find all applications for jobs owned by the current user
    const applications = await Application.findAll({
      include: [
        {
          model: Job,
          where: { userId: req.user.id },
          as: "job",
        },
      ],
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createApplication(req, res) {
  try {
    const { job_id, name, email, photo, cv } = req.body;

    if (!job_id || !name || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify that the job exists and is active
    const job = await Job.findOne({
      where: {
        id: job_id,
      },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found or not available" });
    }

    const application = await Application.create({
      job_id,
      name,
      email,
      photo,
      cv,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ error: "Could not create application" });
  }
}
