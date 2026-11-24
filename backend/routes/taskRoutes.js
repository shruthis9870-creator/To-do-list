import express from 'express';
import {
  getTasks,
  getTaskStats,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
} from '../controllers/taskController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

// Task statistics
router.get('/stats', getTaskStats);

// Tasks CRUD
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;
