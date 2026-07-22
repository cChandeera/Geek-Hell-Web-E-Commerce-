import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('API Health Check Endpoint', () => {
  it('GET /api/v1/health should return 200 OK and healthy status', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('healthy');
    expect(response.body.data.service).toContain('Geek Hell Express API Gateway');
  });
});
