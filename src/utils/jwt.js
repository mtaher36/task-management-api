// src/utils/jwt.js
import jwt from 'jsonwebtoken';
const { JWT_SECRET } = process.env;

export const generateToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

export const verifyToken = (token) => jwt.verify(token, JWT_SECRET);
