import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import { validateBody } from '../middlewares/validationMiddleware.js';
import {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  verifyOtp,
  updatePasswordWithOtp,
} from '../controllers/userController.js';
import {
  updateProfileSchema,
  updatePasswordSchema,
  verifyOtpSchema,
} from '../validations/userValidation.js';

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.put(
  '/profile',
  authMiddleware,
  validateBody(updateProfileSchema),
  updateUserProfile
);
router.post(
  '/profile/verify-otp',
  authMiddleware,
  validateBody(verifyOtpSchema),
  verifyOtp
);
router.put(
  '/profile/password',
  authMiddleware,
  validateBody(updatePasswordSchema),
  updateUserPassword
);
router.post(
  '/profile/password/verify-otp',
  authMiddleware,
  validateBody(verifyOtpSchema),
  updatePasswordWithOtp
);

export default router;
