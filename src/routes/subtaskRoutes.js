import express from 'express';

import {
  createSubtaskController,
  getSubtasksController,
  updateSubtaskController,
  deleteSubtaskController,
  completeSubtaskController,
} from '../controllers/subTaskController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import { validateTaskOwnership } from '../middlewares/taskMiddleware.js';
import {
  createSubtaskSchema,
  updateSubtaskSchema,
} from '../validations/subtaskValidation.js';

const router = express.Router();

router.post(
  '/:taskId/subtasks',
  authMiddleware,
  validateTaskOwnership,
  validateBody(createSubtaskSchema),
  createSubtaskController
);
router.get(
  '/:taskId/subtasks',
  authMiddleware,
  validateTaskOwnership,
  getSubtasksController
);
router.put(
  '/:taskId/subtasks/:id',
  authMiddleware,
  validateTaskOwnership,
  validateBody(updateSubtaskSchema),
  updateSubtaskController
);
router.delete(
  '/:taskId/subtasks/:id',
  authMiddleware,
  validateTaskOwnership,
  deleteSubtaskController
);
router.post(
  '/:taskId/subtasks/:id',
  authMiddleware,
  validateTaskOwnership,
  completeSubtaskController
);
export default router;
