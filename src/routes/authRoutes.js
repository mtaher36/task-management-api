// src/routes/authRoutes.js
import express from 'express';
import authController from '../controllers/authController.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import {
  registerSchema,
  loginSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.post('/verify-otp', authController.verifyOtp);
router.post('/logout', authMiddleware, authController.logout);
router.post(
  '/request-password-reset',
  validateBody(requestPasswordResetSchema),
  authController.requestPasswordReset
);
router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  authController.resetPassword
);

export default router;
