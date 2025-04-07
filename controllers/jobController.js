import Job from '../models/Job.js';

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
            createdBy: req.user._id
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
        res.status(500).json({ message: "Error fetching jobs", error: err.message });
    }
};
