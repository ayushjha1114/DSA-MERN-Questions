// src/services/auth.service.js
import bcrypt from 'bcrypt';
import { pgPool } from '../db/pg.js';

export const createUser = async (email, password) => {
  const hashed = await bcrypt.hash(password, 10);
  const client = await pgPool.connect();
  try {
    await client.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2)',
      [email, hashed]
    );
  } finally {
    client.release();
  }
};

export const findUserByEmail = async (email) => {
  const client = await pgPool.connect();
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  } finally {
    client.release();
  }
};

export const comparePasswords = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
