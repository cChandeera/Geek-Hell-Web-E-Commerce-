import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { generateAccessToken } from '../utils/token.util';

describe('Category CRUD Module Suite', () => {
  let adminToken = '';
  let customerToken = '';
  const categoryId = new mongoose.Types.ObjectId().toString();
  const categorySlug = 'testcategory-marvel';

  const mockCategory = {
    _id: new mongoose.Types.ObjectId(categoryId),
    name: 'TestCategory Marvel',
    slug: categorySlug,
    description: 'Marvel universe category',
    sortOrder: 5,
    isActive: true,
    save: vi.fn(),
  };

  beforeAll(() => {
    const adminUser = new User({
      name: 'Admin Master',
      email: 'admin.category@geekhell.com',
      password: 'Password123!',
      role: 'admin',
    });
    adminToken = generateAccessToken({ id: adminUser._id.toString(), email: adminUser.email, role: 'admin' });

    const customerUser = new User({
      name: 'Customer User',
      email: 'customer.category@geekhell.com',
      password: 'Password123!',
      role: 'customer',
    });
    customerToken = generateAccessToken({ id: customerUser._id.toString(), email: customerUser.email, role: 'customer' });
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  // 1. Create Category
  describe('POST /api/v1/categories', () => {
    it('should reject category creation without authorization token', async () => {
      const res = await request(app).post('/api/v1/categories').send({
        name: 'TestCategory Marvel',
        description: 'Marvel universe category',
      });

      expect(res.status).toBe(401);
    });

    it('should reject category creation for customer user role (403 Forbidden)', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          name: 'TestCategory Marvel',
          description: 'Marvel universe category',
        });

      expect(res.status).toBe(403);
    });

    it('should fail creation if validation rules fail (e.g. short name)', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'A',
          description: 'Short name test',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should successfully create category for admin user', async () => {
      vi.spyOn(Category, 'findOne')
        .mockResolvedValueOnce(null) // slug check
        .mockResolvedValueOnce(null); // name check
      vi.spyOn(Category, 'create').mockResolvedValue(mockCategory as any);

      const res = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'TestCategory Marvel',
          description: 'Marvel universe category',
          sortOrder: 5,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('TestCategory Marvel');
      expect(res.body.data.slug).toBe(categorySlug);
    });

    it('should reject category creation if name is a duplicate', async () => {
      vi.spyOn(Category, 'findOne')
        .mockResolvedValueOnce(null) // slug check
        .mockResolvedValueOnce(mockCategory as any); // name check (duplicate)

      const res = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'TestCategory Marvel',
          description: 'Duplicate name',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already exists');
    });
  });

  // 2. Read Categories
  describe('GET /api/v1/categories', () => {
    it('should retrieve list of categories (public)', async () => {
      const mockQuery = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([mockCategory]),
      };
      vi.spyOn(Category, 'find').mockReturnValue(mockQuery as any);
      vi.spyOn(Category, 'countDocuments').mockResolvedValue(1);

      const res = await request(app).get('/api/v1/categories');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.docs)).toBe(true);
      expect(res.body.data.docs[0].name).toBe('TestCategory Marvel');
    });

    it('should filter categories by search term', async () => {
      const mockQuery = {
        sort: vi.fn().mockReturnThis(),
        skip: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        exec: vi.fn().mockResolvedValue([mockCategory]),
      };
      vi.spyOn(Category, 'find').mockReturnValue(mockQuery as any);
      vi.spyOn(Category, 'countDocuments').mockResolvedValue(1);

      const res = await request(app).get('/api/v1/categories?search=Marvel');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.docs.length).toBe(1);
    });

    it('should retrieve category by ID', async () => {
      vi.spyOn(Category, 'findById').mockResolvedValue(mockCategory as any);

      const res = await request(app).get(`/api/v1/categories/${categoryId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('TestCategory Marvel');
    });

    it('should retrieve category by slug', async () => {
      vi.spyOn(Category, 'findOne').mockResolvedValue(mockCategory as any);

      const res = await request(app).get(`/api/v1/categories/slug/${categorySlug}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('TestCategory Marvel');
    });
  });

  // 3. Update Category
  describe('PUT /api/v1/categories/:id', () => {
    it('should reject category update without token', async () => {
      const res = await request(app).put(`/api/v1/categories/${categoryId}`).send({
        description: 'Updated Marvel description',
      });

      expect(res.status).toBe(401);
    });

    it('should reject category update for customer role (403)', async () => {
      const res = await request(app)
        .put(`/api/v1/categories/${categoryId}`)
        .set('Authorization', `Bearer ${customerToken}`)
        .send({
          description: 'Updated Marvel description',
        });

      expect(res.status).toBe(403);
    });

    it('should successfully update category for admin user', async () => {
      const saveMock = vi.fn().mockImplementation(function (this: any) {
        this.description = 'Updated Marvel description';
        this.sortOrder = 10;
        return Promise.resolve(this);
      });
      const updatableCategory = {
        ...mockCategory,
        save: saveMock,
      };

      vi.spyOn(Category, 'findById').mockResolvedValue(updatableCategory as any);
      vi.spyOn(Category, 'findOne').mockResolvedValue(null); // only 1 call is made (name check) because slug is not provided

      const res = await request(app)
        .put(`/api/v1/categories/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'TestCategory Marvel Updated',
          description: 'Updated Marvel description',
          sortOrder: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.description).toBe('Updated Marvel description');
      expect(res.body.data.sortOrder).toBe(10);
    });
  });

  // 4. Delete Category & Dependencies
  describe('DELETE /api/v1/categories/:id', () => {
    it('should reject deletion of parent category if subcategories exist', async () => {
      vi.spyOn(Category, 'findById').mockResolvedValue(mockCategory as any);
      vi.spyOn(Category, 'findOne').mockResolvedValueOnce({ name: 'Subcategory' } as any);

      const res = await request(app)
        .delete(`/api/v1/categories/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('parent');
    });

    it('should reject deletion of category if products are associated', async () => {
      vi.spyOn(Category, 'findById').mockResolvedValue(mockCategory as any);
      vi.spyOn(Category, 'findOne').mockResolvedValueOnce(null); // no subcategory
      vi.spyOn(Product, 'findOne').mockResolvedValueOnce({ name: 'Associated Product' } as any);

      const res = await request(app)
        .delete(`/api/v1/categories/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('associated product');
    });

    it('should delete category successfully if no dependencies remain', async () => {
      vi.spyOn(Category, 'findById').mockResolvedValue(mockCategory as any);
      vi.spyOn(Category, 'findOne').mockResolvedValueOnce(null); // no subcategory
      vi.spyOn(Product, 'findOne').mockResolvedValueOnce(null); // no product
      vi.spyOn(Category, 'findByIdAndDelete').mockResolvedValue(mockCategory as any);

      const res = await request(app)
        .delete(`/api/v1/categories/${categoryId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
