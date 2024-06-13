// src/routes/taskSectionRoutes.js
import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import {
  createTaskSectionController,
  getTaskSectionsController,
  updateTaskSectionController,
  getTaskSectionByIdController,
  deleteTaskSectionController,
} from '../controllers/taskSectionController.js';
import {
  createTaskSectionSchema,
  updateTaskSectionSchema,
} from '../validations/taskSectionValidation.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  validateBody(createTaskSectionSchema),
  createTaskSectionController
);
router.get('/section/:id', authMiddleware, getTaskSectionByIdController);
router.get('/project/:project_id', authMiddleware, getTaskSectionsController);

router.put(
  '/:id',
  authMiddleware,
  validateBody(updateTaskSectionSchema),
  updateTaskSectionController
);

router.delete('/:id', authMiddleware, deleteTaskSectionController);

export default router;
