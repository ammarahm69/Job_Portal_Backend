import express from 'express';
import { createJob, getAllJobs,deleteJob,updateJob } from '../controllers/jobController.js';
import { protect } from '../middlewares/authMiddleware.js';
// import { recruiterOnly } from '../middlewares/roleMiddleware.js';
const router = express.Router();
// Recruiter: Post Job
router.post('/create', protect,  createJob);
// Recruiter: Delete Job
router.delete('/delete/:id', protect, deleteJob);
// Recruiter: Update Job
router.put('/update/:id', protect, updateJob);
// Public: View All Jobs
router.get('/', getAllJobs);

export default router;
