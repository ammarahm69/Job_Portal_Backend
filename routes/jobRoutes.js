import express from 'express';
import { createJob, getAllJobs } from '../controllers/jobController.js';
import { protect } from '../middlewares/authMiddleware.js';
// import { recruiterOnly } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Recruiter: Post Job
router.post('/create', protect,  createJob);

// Public: View All Jobs
router.get('/', getAllJobs);

export default router;
