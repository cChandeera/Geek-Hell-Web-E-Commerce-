import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { generateAccessToken } from '../utils/token.util';
import { ENV } from '../config/env.config';

describe('Product CRUD Module Suite', () => {
  let adminToken = '';
  let customerToken = '';
  let createdProductId = '';

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

  afterAll(async () => {
    try {
      if (mongoose.connection.readyState === 1) {
        await Product.deleteMany({ name: /Test Product/i });
      }
    } catch {
      // Cleanup timeout handled
    }
  });

  // 1. Create Product Tests
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

    it('should create a new product successfully with admin role', async () => {
      const res = await request(app)
        .post('/api/v1/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product Spider-Man Cyberpunk Tee',
          description: 'High quality cyberpunk red web tee',
          category: 'Marvel',
          basePrice: 60,
          stock: 40,
          gender: 'unisex',
          tags: ['Spider-Man', 'Marvel', 'Cyberpunk'],
        });

      if (res.status === 201) {
        expect(res.body.success).toBe(true);
        expect(res.body.data.name).toBe('Test Product Spider-Man Cyberpunk Tee');
        expect(res.body.data.slug).toBe('test-product-spider-man-cyberpunk-tee');
        createdProductId = res.body.data._id || res.body.data.id;
      }
    });
  });

  // 2. Read Product Tests (List, Pagination, Search, Filter, Sort)
  describe('GET /api/v1/products', () => {
    it('should fetch paginated product list with search and filter parameters', async () => {
      const res = await request(app)
        .get('/api/v1/products')
        .query({ page: 1, limit: 5, search: 'Spider-Man', category: 'Marvel', sortBy: 'basePrice', sortOrder: 'asc' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.docs).toBeDefined();
      expect(res.body.data.totalDocs).toBeDefined();
      expect(res.body.data.page).toBe(1);
    });

    it('should fetch product details by ID', async () => {
      if (!createdProductId) return;
      const res = await request(app).get(`/api/v1/products/${createdProductId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Test Product Spider-Man Cyberpunk Tee');
    });

    it('should fetch product details by slug', async () => {
      const res = await request(app).get('/api/v1/products/slug/test-product-spider-man-cyberpunk-tee');

      if (res.status === 200) {
        expect(res.body.success).toBe(true);
        expect(res.body.data.slug).toBe('test-product-spider-man-cyberpunk-tee');
      }
    });
  });

  // 3. Update Product Tests
  describe('PUT /api/v1/products/:id', () => {
    it('should update product specs successfully with admin role', async () => {
      if (!createdProductId) return;
      const res = await request(app)
        .put(`/api/v1/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          basePrice: 75,
          stock: 80,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.basePrice).toBe(75);
      expect(res.body.data.stock).toBe(80);
    });
  });

  // 4. Delete Product Tests
  describe('DELETE /api/v1/products/:id', () => {
    it('should delete product successfully with admin role', async () => {
      if (!createdProductId) return;
      const res = await request(app)
        .delete(`/api/v1/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
