import {
  register,
  verifyEmail,
  login,
  requestPasswordReset,
  verifyOtpAndSendRandomPassword,
} from '../services/authService.js';
import logger from '../config/logger.js';

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      await register(username, email, password);

      res.status(200).json({
        message:
          'User registered, please check your email for verification link',
      });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  verifyEmail: async (req, res) => {
    try {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json({ error: 'Invalid or missing token' });
      }

      await verifyEmail(token);

      res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
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
      await requestPasswordReset(email);

      res
        .status(200)
        .json({ message: 'Password reset OTP sent to your email' });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  verifyOtpAndSendRandomPassword: async (req, res) => {
    try {
      const { email, otp } = req.body;
      await verifyOtpAndSendRandomPassword(email, otp);

      res.status(200).json({ message: 'New password sent to your email' });
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: error.message });
    }
  },
};

export default authController;
