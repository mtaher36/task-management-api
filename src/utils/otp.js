import crypto from 'crypto';

export const generateOtp = (length = 6) => {
  const otp = crypto.randomBytes(length).toString('hex').slice(0, length);
  return otp;
};

export const otpExpiresIn = (minutes = 10) => {
  return new Date(Date.now() + minutes * 60000);
};
