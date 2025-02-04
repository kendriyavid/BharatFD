import express from 'express';
import { createFaq, updateFaq, deleteFaq } from '../controller/adminFaqController.js';
import verifyAdmin from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/faq', verifyAdmin, createFaq);
router.patch('/faq/:id', verifyAdmin, updateFaq);
router.delete('/faq/:id', verifyAdmin, deleteFaq);

export default router;
