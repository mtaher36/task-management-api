import express from 'express';
import {
  createTaskProjectController,
  getAllTaskProjectsController,
  updateTaskProjectController,
  deleteTaskProjectController,
  getTaskProjectByIdController,
} from '../controllers/taskProjectController.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import {
  createTaskProjectSchema,
  updateTaskProjectSchema,
} from '../validations/taskProjectValidation.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  validateBody(createTaskProjectSchema),
  createTaskProjectController
);
router.get('/', authMiddleware, getAllTaskProjectsController);
router.get('/:id', authMiddleware, getTaskProjectByIdController);
router.put(
  '/:id',
  authMiddleware,
  validateBody(updateTaskProjectSchema),
  updateTaskProjectController
);
router.delete('/:id', authMiddleware, deleteTaskProjectController);

export default router;
