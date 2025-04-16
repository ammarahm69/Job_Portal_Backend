import express from 'express';
import { createJob, getAllJobs,deleteJob,updateJob,getJobApplicants, applyToJob } from '../controllers/jobController.js';
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

router.get('/:id/applicants', protect,  getJobApplicants);

router.post('/:id/apply', protect, applyToJob); // Anyone logged in can apply



export default router;
