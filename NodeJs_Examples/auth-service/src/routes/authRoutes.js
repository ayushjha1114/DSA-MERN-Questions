// src/routes/auth.routes.js
import { Router } from 'express';
import {
  register,
  login,
  setupTOTP,
  verifyTOTP
} from '../controllers/authController.js';

const router = Router();

// Registration (email + password)
router.post('/register', register);

// Login (email + password)
router.post('/login', login);

// Setup TOTP (generates QR code or secret)
router.post('/totp/setup', setupTOTP);

// Verify TOTP and return JWT
router.post('/totp/verify', verifyTOTP);

export default router;
