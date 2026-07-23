import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Step 06 — Authentication & Authorization Module Suite', () => {
  const testUser = {
    name: 'Peter Parker',
    email: 'test.peter@geekhell.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
  };

  // 1. Validation Tests
  describe('POST /api/v1/auth/register', () => {
    it('should fail registration if password does not meet complexity rules', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Peter Parker',
        email: 'test.weak@geekhell.com',
        password: 'weak',
        confirmPassword: 'weak',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Validation Error');
    });

    it('should fail registration if passwords do not match', async () => {
      const res = await request(app).post('/api/v1/auth/register').send({
        name: 'Peter Parker',
        email: 'test.mismatch@geekhell.com',
        password: 'Password123!',
        confirmPassword: 'DifferentPassword123!',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // 2. Protected Route & Current User
  describe('GET /api/v1/auth/me', () => {
    it('should reject request without Bearer token', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });
  });
});
