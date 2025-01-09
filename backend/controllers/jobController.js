import { Job } from "../models/Job.js";

export async function getAllJobs(req, res) {
  try {
    const jobs = await Job.findAll({
      attributes: [
        "id",
        "title",
        "type",
        "salary",
        "description",
        "date",
        "skills",
        "picture",
      ],
      order: [["date", "DESC"]],
    });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createJob(req, res) {
  try {
    const { title, type, salary, description, skills, picture, date } =
      req.body;

    // Validate required fields
    if (!title || !type || !salary || !date) {
      return res.status(400).json({
        message:
          "Missing required fields: title, type, salary, and date are required",
      });
    }

    const job = await Job.create({
      ...req.body,
      userId: req.user.id,
      date: new Date(date),
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// Add a method to get company's own jobs
export async function getCompanyJobs(req, res) {
  try {
    console.log("here")
    const jobs = await Job.findAll({
      where: { userId: req.user.id },
      order: [["date", "DESC"]],
    });
    console.log("DONE")
    console.log("jobs")
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function removeMyJob(req, res) {
  try {
    const job = await Job.findOne({
      where: {
        id: req.body.job_id,
        userId: req.user.id,
      },
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found or unauthorized" });
    }
    await job.destroy();
    res.status(200).json({ message: "Job successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


export async function deleteAllJobs(req, res) {
  try {
    await Job.destroy({ where: {} });
    res.status(200).json({ message: "Jobs are successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
