import express from 'express';
import {
  createTaskController,
  getTasksController,
  updateTaskController,
  deleteTaskController,
  completeTaskController,
  getTaskByIdTask,
} from '../controllers/taskController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { validateTaskOwnership } from '../middlewares/taskMiddleware.js';

import {
  createTaskSchema,
  updateTaskSchema,
} from '../validations/taskValidation.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  validateBody(createTaskSchema),
  createTaskController
);
router.get('/', authMiddleware, getTasksController);
router.get('/:id', authMiddleware, getTaskByIdTask);
router.put(
  '/:taskId',
  authMiddleware,
  validateBody(updateTaskSchema),
  validateTaskOwnership,
  updateTaskController
);
router.delete(
  '/:taskId',
  authMiddleware,
  validateTaskOwnership,
  deleteTaskController
);
router.post(
  '/:taskId/complete',
  authMiddleware,
  validateTaskOwnership,
  completeTaskController
);

export default router;
