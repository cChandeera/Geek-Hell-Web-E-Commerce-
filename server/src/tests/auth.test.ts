import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('User Authentication Validation & Security', () => {
  it('POST /api/v1/auth/register should fail validation on invalid email or short password', async () => {
    const response = await request(app).post('/api/v1/auth/register').send({
      name: 'A',
      email: 'invalid-email',
      password: '123',
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Validation Error');
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  it('POST /api/v1/auth/login should fail validation when missing credentials', async () => {
    const response = await request(app).post('/api/v1/auth/login').send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('GET /api/v1/auth/me should return 401 Unauthorized without Bearer token', async () => {
    const response = await request(app).get('/api/v1/auth/me');

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('No authentication token provided');
  });
});
