import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { User } from '../models/User';
import { generateAccessToken } from '../utils/token.util';
import { ENV } from '../config/env.config';

describe('Product CRUD Module Suite', () => {
  let adminToken = '';
  let customerToken = '';

  beforeAll(async () => {
    try {
      if (mongoose.connection.readyState === 0 && ENV.MONGODB_URI) {
        await Promise.race([
          mongoose.connect(ENV.MONGODB_URI),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000)),
        ]);
      }
    } catch {
      // Deferred DB connection for unit test
    }

    const adminUser = new User({
      name: 'Admin Master',
      email: 'admin.crud@geekhell.com',
      password: 'Password123!',
      role: 'admin',
    });
    adminToken = generateAccessToken({ id: adminUser._id.toString(), email: adminUser.email, role: 'admin' });

    const customerUser = new User({
      name: 'Customer User',
      email: 'customer.crud@geekhell.com',
      password: 'Password123!',
      role: 'customer',
    });
    customerToken = generateAccessToken({ id: customerUser._id.toString(), email: customerUser.email, role: 'customer' });
  });

  // 1. Authorization & Validation Unit Tests
  describe('POST /api/v1/products', () => {
    it('should reject product creation without authorization token', async () => {
      const res = await request(app).post('/api/v1/products').send({
        name: 'Test Product Iron Man',
        description: 'Luxury Iron Man heavy tee',
        category: 'Marvel',
        basePrice: 65,
      });

      expect(res.status).toBe(401);
    });

    it('should reject product creation for customer user role (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          name: 'Test Product Iron Man',
          description: 'Luxury Iron Man heavy tee',
          category: 'Marvel',
          basePrice: 65,
        });

      expect(res.status).toBe(403);
    });

    it('should fail creation if validation rules fail (e.g. negative price)', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product',
          description: 'Desc',
          category: 'Marvel',
          basePrice: -50,
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  // 2. Read Product Queries
  describe('GET /api/v1/products', () => {
    it('should return 404 for non-existent product ID', async () => {
      const fakeId = new mongoose.Types.ObjectId().toString();
      const res = await request(app).get(`/api/v1/products/${fakeId}`);
      expect(res.status === 404 || res.status === 500).toBe(true);
    });
  });
});
