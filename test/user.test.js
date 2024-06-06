import request from 'supertest';
import app from '../app';
import * as userService from '../services/userService';
import * as bcrypt from '../utils/bcrypt';
import * as email from '../utils/email';
import * as otp from '../utils/otp';

// Mock dependencies
jest.mock('../services/userService');
jest.mock('../utils/bcrypt');
jest.mock('../utils/email');
jest.mock('../utils/otp');

describe('User Controller', () => {
  let user;

  beforeEach(() => {
    user = {
      id: 'userId',
      username: 'testuser',
      email: 'testuser@example.com',
      profile_image: 'http://example.com/image.jpg',
      password: 'hashedpassword',
      otp: null,
      otpExpiresAt: null,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /profile', () => {
    it('should return user profile', async () => {
      userService.getUserById.mockResolvedValue(user);

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(200);
      expect(res.body.user).toEqual({
        id: user.id,
        username: user.username,
        email: user.email,
        profile_image: user.profile_image,
        role_id: undefined,
        isActive: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      });
    });

    it('should return 404 if user not found', async () => {
      userService.getUserById.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer validtoken');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('User not found');
    });
  });

  describe('PUT /profile', () => {
    it('should update user profile without email change', async () => {
      userService.getUserById.mockResolvedValue(user);
      userService.updateUserById.mockResolvedValue({
        ...user,
        username: 'newusername',
      });

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', 'Bearer validtoken')
        .send({ username: 'newusername' });

      expect(res.status).toBe(200);
      expect(res.body.user.username).toBe('newusername');
      expect(userService.updateUserById).toHaveBeenCalledWith(user.id, {
        username: 'newusername',
        email: user.email,
        profile_image: user.profile_image,
      });
    });

    it('should send OTP if email is changed', async () => {
      userService.getUserById.mockResolvedValue(user);
      otp.generateOtp.mockReturnValue('123456');
      otp.otpExpiresIn.mockReturnValue(new Date(Date.now() + 300000));

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', 'Bearer validtoken')
        .send({ email: 'newemail@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe(
        'OTP sent to your new email address for verification'
      );
      expect(email.sendOtpEmail).toHaveBeenCalledWith(
        'newemail@example.com',
        '123456'
      );
    });
  });

  describe('POST /profile/verify-otp', () => {
    it('should verify OTP and update profile', async () => {
      userService.getUserById.mockResolvedValue(user);
      otpStore[user.id] = {
        otp: '123456',
        otpExpiresAt: new Date(Date.now() + 300000),
        updatedData: { email: 'newemail@example.com' },
      };

      const res = await request(app)
        .post('/api/users/profile/verify-otp')
        .set('Authorization', 'Bearer validtoken')
        .send({ otp: '123456' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Profile updated successfully');
      expect(userService.updateUserById).toHaveBeenCalledWith(user.id, {
        email: 'newemail@example.com',
        username: user.username,
        profile_image: user.profile_image,
      });
    });

    it('should return 400 for invalid or expired OTP', async () => {
      userService.getUserById.mockResolvedValue(user);
      otpStore[user.id] = {
        otp: '123456',
        otpExpiresAt: new Date(Date.now() - 300000),
      };

      const res = await request(app)
        .post('/api/users/profile/verify-otp')
        .set('Authorization', 'Bearer validtoken')
        .send({ otp: '123456' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid or expired OTP');
    });
  });

  describe('PUT /profile/password', () => {
    it('should send OTP for password change', async () => {
      userService.getUserByIdWithPassword.mockResolvedValue(user);
      bcrypt.comparePassword.mockResolvedValue(true);
      otp.generateOtp.mockReturnValue('123456');
      otp.otpExpiresIn.mockReturnValue(new Date(Date.now() + 300000));

      const res = await request(app)
        .put('/api/users/profile/password')
        .set('Authorization', 'Bearer validtoken')
        .send({
          current_password: 'passwordlama',
          new_password: 'passwordbaru',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe(
        'OTP sent to your email address for verification'
      );
      expect(email.sendOtpEmail).toHaveBeenCalledWith(user.email, '123456');
    });

    it('should return 400 for incorrect current password', async () => {
      userService.getUserByIdWithPassword.mockResolvedValue(user);
      bcrypt.comparePassword.mockResolvedValue(false);

      const res = await request(app)
        .put('/api/users/profile/password')
        .set('Authorization', 'Bearer validtoken')
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
      otpStore[user.id] = {
        otp: '123456',
        otpExpiresAt: new Date(Date.now() + 300000),
        new_password: 'passwordbaru',
      };
      bcrypt.hashPassword.mockResolvedValue('hashednewpassword');

      const res = await request(app)
        .post('/api/users/profile/password/verify-otp')
        .set('Authorization', 'Bearer validtoken')
        .send({ otp: '123456' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Password updated successfully');
      expect(userService.updatePasswordById).toHaveBeenCalledWith(
        user.id,
        'hashednewpassword'
      );
    });

    it('should return 400 for invalid or expired OTP', async () => {
      otpStore[user.id] = {
        otp: '123456',
        otpExpiresAt: new Date(Date.now() - 300000),
      };

      const res = await request(app)
        .post('/api/users/profile/password/verify-otp')
        .set('Authorization', 'Bearer validtoken')
        .send({ otp: '123456' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid or expired OTP');
    });
  });
});
