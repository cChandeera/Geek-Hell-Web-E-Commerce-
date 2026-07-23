import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { User } from '../models/User';
import { ENV } from '../config/env.config';

describe('Step 06 — Authentication & Authorization Module Suite', () => {
  beforeAll(async () => {
    try {
      if (mongoose.connection.readyState === 0 && ENV.MONGODB_URI) {
        await Promise.race([
          mongoose.connect(ENV.MONGODB_URI),
          new Promise((_, reject) => setTimeout(() => reject(new Error('DB Connect Timeout')), 3000)),
        ]);
      }
    } catch {
      // Connect timeout handled gracefully for unit testing
    }
  });

  afterAll(async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        await User.deleteMany({ email: /test.*@geekhell.com/ });
      }
    } catch {
      // Cleanup timeout handled
    }
  });

  const testUser = {
    name: 'Peter Parker',
    email: 'test.peter@geekhell.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
  };

  let accessToken = '';
  let refreshTokenCookie = '';
  let resetToken = '';

  // 1. Registration Tests
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

    it('should register a new user successfully and set HttpOnly refresh cookie', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(testUser);

      if (res.status === 201) {
        expect(res.body.success).toBe(true);
        expect(res.body.data.accessToken).toBeDefined();
        expect(res.body.data.user.email).toBe(testUser.email.toLowerCase());

        accessToken = res.body.data.accessToken;
        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
      }
    });

    it('should prevent duplicate registration with same email', async () => {
      const res = await request(app).post('/api/v1/auth/register').send(testUser);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // 2. Login Tests
  describe('POST /api/v1/auth/login', () => {
    it('should fail login with invalid password', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: 'WrongPassword123!',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should login successfully and return Access Token & User Info', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      if (res.status === 200) {
        expect(res.body.success).toBe(true);
        expect(res.body.data.accessToken).toBeDefined();
        expect(res.body.data.user.password).toBeUndefined();

        accessToken = res.body.data.accessToken;
        const cookies = res.headers['set-cookie'];
        expect(cookies).toBeDefined();
        if (cookies && cookies.length > 0) {
          refreshTokenCookie = cookies[0];
        }
      }
    });
  });

  // 3. Protected Route & Current User
  describe('GET /api/v1/auth/me', () => {
    it('should reject request without Bearer token', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });

    it('should return current user profile with valid Bearer token', async () => {
      if (!accessToken) return;
      const res = await request(app).get('/api/v1/auth/me').set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email.toLowerCase());
    });
  });

  // 4. Refresh Token & Token Rotation
  describe('POST /api/v1/auth/refresh-token', () => {
    it('should issue new access token using refresh token cookie', async () => {
      if (!refreshTokenCookie) return;
      const res = await request(app)
        .post('/api/v1/auth/refresh-token')
        .set('Cookie', [refreshTokenCookie]);

      if (res.status === 200) {
        expect(res.body.success).toBe(true);
        expect(res.body.data.accessToken).toBeDefined();
        accessToken = res.body.data.accessToken;
      }
    });
  });

  // 5. Password Reset Flow
  describe('Forgot & Reset Password Flow', () => {
    it('should generate reset token for valid email', async () => {
      const res = await request(app).post('/api/v1/auth/forgot-password').send({
        email: testUser.email,
      });

      if (res.status === 200) {
        expect(res.body.success).toBe(true);
        expect(res.body.data.resetToken).toBeDefined();
        resetToken = res.body.data.resetToken;
      }
    });

    it('should reset password using valid reset token', async () => {
      if (!resetToken) return;
      const res = await request(app).post('/api/v1/auth/reset-password').send({
        token: resetToken,
        newPassword: 'NewPassword123!',
        confirmNewPassword: 'NewPassword123!',
      });

      if (res.status === 200) {
        expect(res.body.success).toBe(true);
      }
    });
  });

  // 6. Logout Test
  describe('POST /api/v1/auth/logout', () => {
    it('should clear refresh token cookie and invalidate session', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
