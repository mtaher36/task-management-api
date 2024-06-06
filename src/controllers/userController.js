import { sendOtpEmail } from '../utils/email.js';
import { generateOtp, otpExpiresIn } from '../utils/otp.js';
import {
  getUserById,
  updateUserById,
  updatePasswordById,
  getUserByIdWithPassword,
} from '../services/userService.js';
import { comparePassword, hashPassword } from '../utils/bcrypt.js';

// Temporary storage for OTP and profile updates
const otpStore = {};

const getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { username, email, profile_image } = req.body;
    const userId = req.user.id;

    const user = await getUserById(userId);

    const updatedData = {
      username: username || user.username,
      email: email || user.email,
      profile_image: profile_image || user.profile_image,
    };

    // Check if email is being updated
    if (email && email !== user.email) {
      // Generate OTP and save to temporary store
      const otp = generateOtp();
      const otpExpiresAt = otpExpiresIn();

      otpStore[userId] = { otp, otpExpiresAt, updatedData };

      await sendOtpEmail(email, otp);

      return res.json({
        message: 'OTP sent to your new email address for verification',
      });
    }

    const updatedUser = await updateUserById(userId, updatedData);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    if (error.code === 'P2002') {
      res.status(400).json({ error: 'Username or Email already registered' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.user.id;

    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const storedData = otpStore[userId];

    if (
      !storedData ||
      storedData.otp !== otp ||
      new Date(storedData.otpExpiresAt) < new Date()
    ) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const updatedData = storedData.updatedData;

    const updatedUser = await updateUserById(userId, updatedData);

    delete otpStore[userId];

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserPassword = async (req, res) => {
  const userId = req.user.id;

  const { current_password, new_password } = req.body;

  try {
    const user = await getUserByIdWithPassword(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.password) {
      return res.status(400).json({ error: 'Current password is required' });
    }

    const isPasswordValid = await comparePassword(
      current_password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Generate OTP and save to temporary store
    const otp = generateOtp();
    const otpExpiresAt = otpExpiresIn();

    otpStore[userId] = { otp, otpExpiresAt, new_password };

    await sendOtpEmail(user.email, otp);

    res.json({ message: 'OTP sent to your email address for verification' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updatePasswordWithOtp = async (req, res) => {
  const userId = req.user.id;
  const { otp } = req.body;

  try {
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const storedData = otpStore[userId];

    if (
      !storedData ||
      storedData.otp !== otp ||
      new Date(storedData.otpExpiresAt) < new Date()
    ) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const hashedNewPassword = await hashPassword(storedData.new_password);
    await updatePasswordById(userId, hashedNewPassword);

    // Clear OTP from temporary store after successful verification
    delete otpStore[userId];

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  verifyOtp,
  updatePasswordWithOtp,
};
