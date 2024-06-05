// tests/auth.test.js
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/database.js';

describe('Auth API', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message');
  });

  it('should login the user', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'testuser2',
      email: 'testuser2@example.com',
      password: 'password123',
    });

    const verifyRes = await request(app).post('/api/auth/verify-otp').send({
      email: 'testuser2@example.com',
      otp: 'your_otp_here', // You need to replace this with the actual OTP received in email
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'testuser2@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
