import {
  register,
  verifyOtp,
  login,
  requestPasswordReset,
  resetPassword,
} from '../services/authService.js';
import logger from '../config/logger.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';

const authController = {
  register: async (req, res) => {
    try {
      const { error } = registerSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const { username, email, password } = req.body;
      await register(username, email, password);

      res
        .status(201)
        .json({ message: 'User registered, please check your email for OTP' });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;
      await verifyOtp(email, otp);

      res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { error } = loginSchema.validate(req.body);
      if (error)
        return res.status(400).json({ error: error.details[0].message });

      const { email, password } = req.body;
      const token = await login(email, password);

      res.status(200).json({ token });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  logout: (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
  },

  requestPasswordReset: async (req, res) => {
    try {
      const { email } = req.body;
      const response = await requestPasswordReset(email);
      res.status(200).json(response);
    } catch (error) {
      logger.error(error);
      res.status(400).json({ error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      const response = await resetPassword(token, newPassword);
      res.status(200).json(response);
    } catch (error) {
      logger.error(error);
      res.status(400).json({ error: error.message });
    }
  },
};

export default authController;
