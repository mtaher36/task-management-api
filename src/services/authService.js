// src/services/authService.js
import prisma from '../config/database.js';
import {
  hashPassword,
  comparePassword,
  generateRandomPassword,
} from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';

const register = async (username, email, password) => {
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) throw new Error('Email already registered');

  const hashedPassword = await hashPassword(password);
  const token = crypto.randomBytes(20).toString('hex');
  const tokenExpires = new Date(Date.now() + 3600000);

  const userRole = await prisma.role.findUnique({ where: { name: 'user' } });
  if (!userRole) throw new Error('Role not found');

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      verificationToken: token,
      verificationTokenExpires: tokenExpires,
      isActive: false,
      role_id: userRole.id,
    },
  });

  const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${token}`;

  await sendEmail(
    email,
    'Verify your email',
    `Click the following link to verify your email: ${verificationLink}`
  );

  return user;
};

const verifyEmail = async (token) => {
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      verificationTokenExpires: {
        gt: new Date(),
      },
    },
  });
  if (!user) throw new Error('Invalid or expired token');

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isActive: true,
      verificationToken: null,
      verificationTokenExpires: null,
    },
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

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 menit
    },
  });

  await sendEmail(email, 'Password Reset OTP', `Your OTP is ${otp}`);
};

const verifyOtpAndSendRandomPassword = async (email, otp) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      otp,
      otpExpiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!user) throw new Error('Invalid or expired OTP');

  const randomPassword = generateRandomPassword();
  const hashedPassword = await hashPassword(randomPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      otp: null,
      otpExpiresAt: null,
    },
  });

  await sendEmail(
    email,
    'Your New Password',
    `Your new password is ${randomPassword}`
  );
};

export {
  register,
  verifyEmail,
  login,
  requestPasswordReset,
  verifyOtpAndSendRandomPassword,
};
