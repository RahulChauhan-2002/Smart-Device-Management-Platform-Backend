import express from 'express';
import auth from '../middleware/auth.js';
import {
  createLog,
  getLogs,
  getUsage
} from '../controllers/analyticsController.js';

const router = express.Router();

router.use(auth); // All analytics routes require authentication

router.post('/:id/logs', createLog);
router.get('/:id/logs', getLogs);
router.get('/:id/usage', getUsage);

export default router;
