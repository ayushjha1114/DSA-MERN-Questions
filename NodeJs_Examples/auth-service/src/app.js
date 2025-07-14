// src/app.js
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { pgPool, initUserTable } from './db/pg.js';
import { redisClient } from './db/redis.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

// Healthcheck
app.get('/', (req, res) => res.send('🔐 auth-service is running'));

// Start server
app.listen(PORT, async () => {
  try {
    await initUserTable();        // PostgreSQL setup
    await redisClient.connect();  // Redis connection already triggered
    console.log(`🚀 auth-service listening on port ${PORT}`);
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
});
