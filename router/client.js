import express from 'express';
import { fetchAllFaq, fetchSpecific } from '../controller/clientFaqController.js';

const router = express.Router();

router.get('/fetchall', fetchAllFaq);
router.get('/:id', fetchSpecific);

export default router;
