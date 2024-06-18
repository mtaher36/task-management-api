import request from 'supertest';
import app from '../src/app';
import prisma from '../src/config/database';

// Clean database before and after each test
beforeEach(async () => {
  await prisma.user.deleteMany();
});

afterEach(async () => {
  await prisma.user.deleteMany();
});

describe('User Controller', () => {
  let token;
  let user;

  beforeEach(async () => {
    user = await prisma.user.create({
      data: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'hashedpassword',
        profile_image: 'http://example.com/image.jpg',
        role_id: 1,
        isActive: true,
        otp: null,
        otpExpiresAt: null,
      },
    });

    // Generate token for user (Assuming you have a function to generate tokens)
    token = 'tokensecret123'; // Replace this with the actual token generation logic
  });

  describe('GET /profile', () => {
    it('should return user profile', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user).toEqual({
        id: user.id,
        username: user.username,
        email: user.email,
        profile_image: user.profile_image,
        role_id: user.role_id,
        isActive: user.isActive,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should return 404 if user not found', async () => {
      await prisma.user.deleteMany(); // Delete all users

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('User not found');
    });
  });

  describe('PUT /profile', () => {
    it('should update user profile without email change', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'newusername' });

      expect(res.status).toBe(200);
      expect(res.body.user.username).toBe('newusername');

      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(updatedUser.username).toBe('newusername');
    });

    it('should send OTP if email is changed', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'newemail@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe(
        'OTP sent to your new email address for verification'
      );

      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(updatedUser.email).toBe(user.email); // Email should not be changed yet
    });
  });

  describe('POST /profile/verify-otp', () => {
    it('should verify OTP and update profile', async () => {
      // Manually set OTP for user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          otp: '123456',
          otpExpiresAt: new Date(Date.now() + 300000),
        },
      });

      const res = await request(app)
        .post('/api/users/profile/verify-otp')
        .set('Authorization', `Bearer ${token}`)
        .send({ otp: '123456' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Profile updated successfully');

      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(updatedUser.email).toBe('newemail@example.com');
    });

    it('should return 400 for invalid or expired OTP', async () => {
      // Manually set expired OTP for user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          otp: '123456',
          otpExpiresAt: new Date(Date.now() - 300000),
        },
      });

      const res = await request(app)
        .post('/api/users/profile/verify-otp')
        .set('Authorization', `Bearer ${token}`)
        .send({ otp: '123456' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid or expired OTP');
    });
  });

  describe('PUT /profile/password', () => {
    it('should send OTP for password change', async () => {
      const res = await request(app)
        .put('/api/users/profile/password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          current_password: 'passwordlama',
          new_password: 'passwordbaru',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe(
        'OTP sent to your email address for verification'
      );
    });

    it('should return 400 for incorrect current password', async () => {
      const res = await request(app)
        .put('/api/users/profile/password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          current_password: 'wrongpassword',
          new_password: 'passwordbaru',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Current password is incorrect');
    });
  });

  describe('POST /profile/password/verify-otp', () => {
    it('should verify OTP and update password', async () => {
      // Manually set OTP and new password for user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          otp: '123456',
          otpExpiresAt: new Date(Date.now() + 300000),
        },
      });

      const res = await request(app)
        .post('/api/users/profile/password/verify-otp')
        .set('Authorization', `Bearer ${token}`)
        .send({ otp: '123456' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Password updated successfully');

      const updatedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(updatedUser.password).toBe('hashednewpassword'); // Assuming password is hashed
    });

    it('should return 400 for invalid or expired OTP', async () => {
      // Manually set expired OTP for user
      await prisma.user.update({
        where: { id: user.id },
        data: {
          otp: '123456',
          otpExpiresAt: new Date(Date.now() - 300000),
        },
      });

      const res = await request(app)
        .post('/api/users/profile/password/verify-otp')
        .set('Authorization', `Bearer ${token}`)
        .send({ otp: '123456' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid or expired OTP');
    });
  });
});
