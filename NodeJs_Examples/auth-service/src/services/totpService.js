// src/services/totp.service.js
import speakeasy from 'speakeasy';
import { redisClient } from '../db/redis.js';
import qrcode from 'qrcode';

export const generateTOTPSecret = async (userId) => {
  const secret = speakeasy.generateSecret({
    name: `auth-service (${userId})`,
  });

  // Store secret in Redis
  await redisClient.set(`totp:${userId}`, secret.base32);

  // Generate QR Code as Data URL
  const qrCode = await qrcode.toDataURL(secret.otpauth_url);

  return {
    base32: secret.base32,
    otpauth_url: secret.otpauth_url,
    qr: qrCode,
  };
};

export const verifyTOTPCode = async (userId, token) => {
  const secret = await redisClient.get(`totp:${userId}`);
  if (!secret) return false;

  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1,
  });
};
