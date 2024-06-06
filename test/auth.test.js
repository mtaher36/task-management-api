// tests/auth.test.js
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/config/database.js';

describe('Auth API', () => {
  let token;

  afterAll(async () => {
    await prisma.user.deleteMany(); // Menghapus data tes
    await prisma.$disconnect();
  });

  it('should be can register users', async () => {
    const res = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message');
  });

  it('should be users can login', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'testuser2',
      email: 'testuser2@example.com',
      password: 'password123',
    });

    
    const user = await prisma.user.findUnique({
      where: { email: 'testuser2@example.com' },
    });
    await prisma.user.update({
      where: { email: 'testuser2@example.com' },
      data: { otp: null, isActive: true },
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'testuser2@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should be user can logout', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Logout successfull');
  });

  it('should can request password reset', async () => {
    const res = await request(app)
      .post('/api/auth/request-password-reset')
      .send({ email: 'testuser@example.com' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe(
      'Password reset link sent to your email'
    );
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should can reset password', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token, newPassword: 'newpassword123' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Password reset successful');
  });

  it('Should return status code 400 for token invalid', async () => {
    const res = await request(app)
      .post('/api/auth/reset-password')
      .send({ token: 'tokeninvalid', newPassword: 'newpassword123' });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toBe('Invalid or expired token');
  });
});
