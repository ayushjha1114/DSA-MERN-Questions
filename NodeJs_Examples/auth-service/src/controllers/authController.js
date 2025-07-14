// src/controllers/auth.controller.js
import {
  createUser,
  findUserByEmail,
  comparePasswords,
} from '../services/authService.js';

import {
  generateTOTPSecret,
  verifyTOTPCode
} from '../services/totpService.js';

import { generateToken } from '../utils/jwt.js';

// =================== Register ===================
export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    await createUser(email, password);
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// =================== Login ===================
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await comparePasswords(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Password OK, now require TOTP
    res.status(200).json({ message: 'Password verified, proceed to TOTP', userId: user.id });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

// =================== TOTP Setup ===================
export const setupTOTP = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const result = await generateTOTPSecret(userId);
    res.json({
      message: 'TOTP secret generated',
      ...result
    });
  } catch (err) {
    console.error('TOTP setup error:', err);
    res.status(500).json({ error: 'TOTP setup failed' });
  }
};

// =================== TOTP Verify ===================
export const verifyTOTP = async (req, res) => {
  const { userId, token } = req.body;
  if (!userId || !token) return res.status(400).json({ error: 'Missing userId or token' });

  try {
    const verified = await verifyTOTPCode(userId, token);
    if (!verified) {
      return res.status(401).json({ error: 'Invalid TOTP code' });
    }

    const jwtToken = generateToken({ userId });
    res.json({ message: 'TOTP verified', token: jwtToken });
  } catch (err) {
    console.error('TOTP verify error:', err);
    res.status(500).json({ error: 'TOTP verification failed' });
  }
};
