import express from 'express';
import {
  createTaskProjectController,
  getAllTaskProjectsController,
  updateTaskProjectController,
  deleteTaskProjectController,
} from '../controllers/taskProjectController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createTaskProjectController);
router.get('/', authMiddleware, getAllTaskProjectsController);
router.put('/:id', authMiddleware, updateTaskProjectController);
router.delete('/:id', authMiddleware, deleteTaskProjectController);

export default router;
