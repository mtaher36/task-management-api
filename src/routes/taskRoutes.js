import express from 'express';
import {
  createTaskController,
  getTasksController,
  updateTaskController,
  deleteTaskController,
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
router.put(
  '/:id',
  authMiddleware,
  validateBody(updateTaskSchema),
  validateTaskOwnership,
  updateTaskController
);
router.delete(
  '/:id',
  authMiddleware,
  validateTaskOwnership,
  deleteTaskController
);

export default router;
