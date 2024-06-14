import request from 'supertest';
import app from '../src/app.js'; // Pastikan path ini sesuai dengan struktur folder Anda
import prisma from '../src/config/database.js';

describe('Authentication API', () => {
  let token;

  beforeAll(async () => {
    // Hapus semua data pengguna sebelum memulai pengujian
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    // Hapus semua data pengguna setelah pengujian selesai
    await prisma.user.deleteMany();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/auth/register').send({
        username: 'test',
        email: 'test@example.com',
        password: 'test123',
        confirmPassword: 'test123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'User registered, please check your email for OTP'
      );
    });

    it('should return error for already registered email or username', async () => {
      await request(app).post('/api/auth/register').send({
        username: 'test',
        email: 'test@example.com',
        password: 'test123',
        confirmPassword: 'test123',
      });

      const response = await request(app).post('/api/auth/register').send({
        username: 'test',
        email: 'test@example.com',
        password: 'test123',
        confirmPassword: 'test123',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'error',
        'Username or Email already registered'
      );
    });
  });

  describe('GET /api/auth/verify-email/:token', () => {
    it('should verify email with valid token', async () => {
      const user = await prisma.user.create({
        data: {
          username: 'verifyUser',
          email: 'verify@example.com',
          password: 'password',
          emailVerificationToken: 'valid-token',
          emailVerified: false,
        },
      });

      const response = await request(app).get(
        `/api/auth/verify-email/valid-token`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Email verified successfully'
      );

      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(updatedUser.emailVerified).toBe(true);
    });

    it('should return error for invalid or expired token', async () => {
      const response = await request(app).get(
        `/api/auth/verify-email/invalid-token`
      );

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid or expired token');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login a user with valid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password: 'test123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');

      token = response.body.token;
    });

    it('should return error for invalid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'wrong@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty(
        'error',
        'Invalid email or password'
      );
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout a user', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Logout successful');
    });

    it('should return error for unauthorized access', async () => {
      const response = await request(app).post('/api/auth/logout');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Unauthorized');
    });
  });

  describe('POST /api/auth/request-password-reset', () => {
    it('should send password reset link to email', async () => {
      const response = await request(app)
        .post('/api/auth/request-password-reset')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'Password reset link sent to your email'
      );
    });

    it('should return error if email does not exist', async () => {
      const response = await request(app)
        .post('/api/auth/request-password-reset')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'error',
        'User with this email does not exist'
      );
    });
  });

  describe('POST /api/auth/verify-otp', () => {
    it('should reset password with valid OTP', async () => {
      const user = await prisma.user.create({
        data: {
          username: 'otpUser',
          email: 'otp@example.com',
          password: 'password',
          passwordResetToken: 'valid-otp',
        },
      });

      const response = await request(app).post('/api/auth/verify-otp').send({
        email: 'otp@example.com',
        otp: 'valid-otp',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        'message',
        'New password sent to your email'
      );
    });

    it('should return error for invalid or expired token', async () => {
      const response = await request(app).post('/api/auth/verify-otp').send({
        email: 'otp@example.com',
        otp: 'invalid-otp',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Invalid or expired token');
    });
  });
});
