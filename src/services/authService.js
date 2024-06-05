// src/services/authService.js
import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';

const register = async (username, email, password) => {
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) throw new Error('Email already registered');

  const hashedPassword = await hashPassword(password);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const userRole = await prisma.role.findUnique({ where: { name: 'user' } });
  if (!userRole) throw new Error('Role not found');

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      otp,
      isActive: false,
      role_id: userRole.id,
    },
  });

  await sendEmail(email, 'Verify your email', `Your OTP is ${otp}`);

  return user;
};

const verifyOtp = async (email, otp) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid email or OTP');

  if (user.otp !== otp) throw new Error('Invalid OTP');

  await prisma.user.update({
    where: { email },
    data: { isActive: true, otp: null },
  });

  return user;
};

const login = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Invalid email or password');

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid email or password');

  if (!user.isActive) throw new Error('Please verify your email first');

  const token = generateToken({ userId: user.id });

  return token;
};

const requestPasswordReset = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('User with this email does not exist');

  const token = crypto.randomBytes(32).toString('hex');
  const tokenExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken: token, resetTokenExpires: tokenExpires },
  });

  const resetLink = `http://localhost:3000/api/auth/reset-password?token=${token}`;
  await sendEmail(
    user.email,
    'Password Reset',
    `Click this link to reset your password: ${resetLink}`
  );

  return { message: 'Password reset link sent to your email' };
};

const resetPassword = async (token, newPassword) => {
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpires: {
        gt: new Date(),
      },
    },
  });

  if (!user) throw new Error('Invalid or expired token');

  const hashedPassword = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null,
    },
  });

  return { message: 'Password reset successful' };
};

export { register, verifyOtp, login, requestPasswordReset, resetPassword };
