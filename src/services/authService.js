// src/services/authService.js
import prisma from '../config/database.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';
import { sendEmail } from '../utils/email.js';

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

export { register, verifyOtp, login };
