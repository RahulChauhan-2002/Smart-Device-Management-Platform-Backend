import express from 'express';
import auth from '../middleware/auth.js';
import {
  createDevice,
  getDevices,
  updateDevice,
  deleteDevice,
  heartbeat
} from '../controllers/deviceController.js';

const router = express.Router();

router.use(auth); // All device routes require authentication

router.post('/', createDevice);
router.get('/', getDevices);
router.patch('/:id', updateDevice);
router.delete('/:id', deleteDevice);
router.post('/:id/heartbeat', heartbeat);

export default router;
