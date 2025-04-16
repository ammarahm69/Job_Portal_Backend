import Job from "../models/Job.js";

// Create Job
export const createJob = async (req, res) => {
  const { title, company, location, description, salary, jobType } = req.body;

  try {
    const job = await Job.create({
      title,
      company,
      location,
      description,
      salary,
      jobType,
      createdBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Error creating job", error: err.message });
  }
};

// Get All Jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email");
    res.status(200).json(jobs);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching jobs", error: err.message });
  }
};

// Update Job (Recruiter Only)
export const updateJob = async (req, res) => {
  const jobId = req.params.id;
  const { title, company, location, description, salary, jobType } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: Not your job" });
    }

    job.title = title || job.title;
    job.company = company || job.company;
    job.location = location || job.location;
    job.description = description || job.description;
    job.salary = salary || job.salary;
    job.jobType = jobType || job.jobType;

    const updatedJob = await job.save();
    res.status(200).json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: "Error updating job", error: err.message });
  }
};

// Delete Job (Recruiter Only)
export const deleteJob = async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: Not your job" });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting job", error: err.message });
  }
};

// Apply to Job
export const applyToJob = async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prevent duplicate applications
    const alreadyApplied = job.applicants.find(
      (app) => app.user.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res
        .status(400)
        .json({ message: "You have already applied to this job." });
    }

    job.applicants.push({ user: req.user._id });
    await job.save();

    res.status(200).json({ message: "Application submitted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error applying to job", error: err.message });
  }
};

// Get Applicants for a Job
export const getJobApplicants = async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await Job.findById(jobId).populate(
      "applicants.user",
      "name email role"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if the current user is the creator of the job
    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Not your job posting" });
    }

    res.status(200).json(job.applicants);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching applicants", error: err.message });
  }
};
