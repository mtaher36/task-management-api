import express from 'express';
import authController from '../controllers/authController.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import {
  registerSchema,
  loginSchema,
  requestPasswordResetSchema,
  otpSchema,
} from '../validations/authValidation.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.get('/verify-email', authController.verifyEmail);
router.post('/logout', authMiddleware, authController.logout);
router.post(
  '/request-password-reset',
  validateBody(requestPasswordResetSchema),
  authController.requestPasswordReset
);
router.post(
  '/verify-otp',
  validateBody(otpSchema),
  authController.verifyOtpAndSendRandomPassword
);

export default router;
