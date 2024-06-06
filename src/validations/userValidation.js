import Joi from 'joi';

// Skema untuk memperbarui profil pengguna
export const updateProfileSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  email: Joi.string().email(),
  profile_image: Joi.string().uri(),
}).or('username', 'email', 'profile_image');

// Skema untuk memperbarui kata sandi pengguna
export const updatePasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string().min(6).required(),
});

// Skema untuk verifikasi OTP (hanya memerlukan OTP)
export const verifyOtpSchema = Joi.object({
  otp: Joi.string().required(),
});
