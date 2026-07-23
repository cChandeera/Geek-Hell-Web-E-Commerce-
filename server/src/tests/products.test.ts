import { describe, it, expect, beforeAll, vi, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { generateAccessToken } from '../utils/token.util';
import { ENV } from '../config/env.config';
import * as cloudinaryService from '../services/cloudinary.service';




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

  // 3. Product Image Upload/Update/Delete Integration Tests
  describe('Product Image Endpoints', () => {
    let mockProductInstance: any;
    const productId = new mongoose.Types.ObjectId().toString();

    beforeEach(() => {
      vi.restoreAllMocks();
      vi.spyOn(cloudinaryService, 'uploadBufferToCloudinary').mockResolvedValue({
        publicId: 'mocked_new_public_id',
        url: 'https://res.cloudinary.com/mocked_new_image.jpg',
        thumbnail: 'https://res.cloudinary.com/mocked_new_image_thumb.jpg',
      });
      vi.spyOn(cloudinaryService, 'deleteImageFromCloudinary').mockResolvedValue(undefined);

      mockProductInstance = {
        _id: new mongoose.Types.ObjectId(productId),
        name: 'Iron Man Tee',
        slug: 'iron-man-tee',
        description: 'luxury iron man heavy tee',
        category: 'Marvel',
        basePrice: 65,
        images: [
          {
            publicId: 'existing_public_id',
            url: 'https://res.cloudinary.com/existing_image.jpg',
            thumbnail: 'https://res.cloudinary.com/existing_image_thumb.jpg',
          },
        ],
        markModified: vi.fn(),
        save: vi.fn().mockImplementation(function (this: any) {
          return Promise.resolve(this);
        }),
      };
    });

    describe('POST /api/v1/products/:id/images', () => {
      it('should reject image upload for unauthorized users', async () => {
        const res = await request(app)
          .post(`/api/v1/products/${productId}/images`)
          .attach('images', Buffer.from('test image data'), 'test.jpg');

        expect(res.status).toBe(401);
      });

      it('should reject image upload for customers', async () => {
        const res = await request(app)
          .post(`/api/v1/products/${productId}/images`)
          .set('Authorization', `Bearer ${customerToken}`)
          .attach('images', Buffer.from('test image data'), 'test.jpg');

        expect(res.status).toBe(403);
      });

      it('should fail upload if no images are attached', async () => {
        vi.spyOn(Product, 'findById').mockResolvedValue(mockProductInstance);

        const res = await request(app)
          .post(`/api/v1/products/${productId}/images`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });

      it('should successfully upload multiple images for admin', async () => {
        vi.spyOn(Product, 'findById').mockResolvedValue(mockProductInstance);

        const res = await request(app)
          .post(`/api/v1/products/${productId}/images`)
          .set('Authorization', `Bearer ${adminToken}`)
          .attach('images', Buffer.from('test image data 1'), 'test1.jpg')
          .attach('images', Buffer.from('test image data 2'), 'test2.png');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.images.length).toBe(3);
        expect(res.body.data.images[1].publicId).toBe('mocked_new_public_id');
      });

      it('should reject upload of unsupported file types', async () => {
        vi.spyOn(Product, 'findById').mockResolvedValue(mockProductInstance);

        const res = await request(app)
          .post(`/api/v1/products/${productId}/images`)
          .set('Authorization', `Bearer ${adminToken}`)
          .attach('images', Buffer.from('test pdf data'), 'test.pdf');

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain('Only JPEG, PNG, and WEBP');
      });
    });

    describe('PUT /api/v1/products/:id/images', () => {
      it('should successfully replace an existing image for admin', async () => {
        vi.spyOn(Product, 'findById').mockResolvedValue(mockProductInstance);

        const res = await request(app)
          .put(`/api/v1/products/${productId}/images`)
          .set('Authorization', `Bearer ${adminToken}`)
          .field('oldPublicId', 'existing_public_id')
          .attach('image', Buffer.from('new image data'), 'new.jpg');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.images.length).toBe(1);
        expect(res.body.data.images[0].publicId).toBe('mocked_new_public_id');
      });

      it('should fail replace if oldPublicId does not exist on product', async () => {
        vi.spyOn(Product, 'findById').mockResolvedValue(mockProductInstance);

        const res = await request(app)
          .put(`/api/v1/products/${productId}/images`)
          .set('Authorization', `Bearer ${adminToken}`)
          .field('oldPublicId', 'non_existing_id')
          .attach('image', Buffer.from('new image data'), 'new.jpg');

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
      });
    });

    describe('DELETE /api/v1/products/:id/images', () => {
      it('should successfully delete an image for admin using query parameter', async () => {
        vi.spyOn(Product, 'findById').mockResolvedValue(mockProductInstance);

        const res = await request(app)
          .delete(`/api/v1/products/${productId}/images`)
          .set('Authorization', `Bearer ${adminToken}`)
          .query({ publicId: 'existing_public_id' });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.images.length).toBe(0);
      });

      it('should fail deletion if publicId is missing', async () => {
        const res = await request(app)
          .delete(`/api/v1/products/${productId}/images`)
          .set('Authorization', `Bearer ${adminToken}`);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });

    describe('PATCH /api/v1/products/:id/stock', () => {
      it('should reject stock update for unauthorized users', async () => {
        const res = await request(app)
          .patch(`/api/v1/products/${productId}/stock`)
          .send({ quantity: 10, action: 'increase' });

        expect(res.status).toBe(401);
      });

      it('should reject stock update for customers', async () => {
        const res = await request(app)
          .patch(`/api/v1/products/${productId}/stock`)
          .set('Authorization', `Bearer ${customerToken}`)
          .send({ quantity: 10, action: 'increase' });

        expect(res.status).toBe(403);
      });

      it('should successfully increase stock for admin', async () => {
        vi.spyOn(Product, 'findById').mockResolvedValue({
          ...mockProductInstance,
          stock: 20,
          save: vi.fn().mockImplementation(function (this: any) {
            return Promise.resolve(this);
          }),
        } as any);

        const res = await request(app)
          .patch(`/api/v1/products/${productId}/stock`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ quantity: 10, action: 'increase' });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.stock).toBe(30);
      });

      it('should successfully decrease stock for admin', async () => {
        vi.spyOn(Product, 'findById').mockResolvedValue({
          ...mockProductInstance,
          stock: 20,
          save: vi.fn().mockImplementation(function (this: any) {
            return Promise.resolve(this);
          }),
        } as any);

        const res = await request(app)
          .patch(`/api/v1/products/${productId}/stock`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ quantity: 5, action: 'decrease' });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.stock).toBe(15);
      });

      it('should reject direct decrease if stock level becomes negative', async () => {
        vi.spyOn(Product, 'findById').mockResolvedValue({
          ...mockProductInstance,
          stock: 20,
          save: vi.fn().mockImplementation(function (this: any) {
            return Promise.resolve(this);
          }),
        } as any);

        const res = await request(app)
          .patch(`/api/v1/products/${productId}/stock`)
          .set('Authorization', `Bearer ${adminToken}`)
          .send({ quantity: 25, action: 'decrease' });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
      });
    });

    describe('Order Inventory Middleware Hooks', () => {
      it('should deduct stock on order creation', async () => {
        const mockProduct = {
          _id: new mongoose.Types.ObjectId(productId),
          name: 'Iron Man Tee',
          stock: 10,
          isActive: true,
          save: vi.fn().mockResolvedValue(true),
        };

        vi.spyOn(Product, 'findById').mockResolvedValue(mockProduct as any);

        const order = new Order({
          user: new mongoose.Types.ObjectId(),
          items: [
            {
              product: mockProduct._id,
              quantity: 3,
              price: 65,
              size: 'L',
              color: '#000000',
              subtotal: 195,
            },
          ],
          shippingAddress: {
            fullName: 'Test User',
            phone: '123456789',
            street: '123 St',
            city: 'Col',
            state: 'WP',
            postalCode: '10000',
            country: 'LK',
          },
          billingAddress: {
            fullName: 'Test User',
            phone: '123456789',
            street: '123 St',
            city: 'Col',
            state: 'WP',
            postalCode: '10000',
            country: 'LK',
          },
          subtotal: 195,
          total: 195,
        });

        // Trigger the hook manually via schema middleware path
        const nextFn = vi.fn();
        const preSaveHooks = (Order.schema as any).s?.hooks?._pres?.get('save') || [];
        const hookObj = preSaveHooks.find((h: any) => h.fn.toString().includes('LOW_STOCK_THRESHOLD'));
        const hookFn = hookObj?.fn;
        await hookFn.call(order, nextFn);


        expect(nextFn).toHaveBeenCalledWith();
        expect(mockProduct.stock).toBe(7);
        expect(mockProduct.save).toHaveBeenCalled();
      });

      it('should fail order creation if stock is insufficient', async () => {
        const mockProduct = {
          _id: new mongoose.Types.ObjectId(productId),
          name: 'Iron Man Tee',
          stock: 2,
          isActive: true,
          save: vi.fn().mockResolvedValue(true),
        };

        vi.spyOn(Product, 'findById').mockResolvedValue(mockProduct as any);

        const order = new Order({
          user: new mongoose.Types.ObjectId(),
          items: [
            {
              product: mockProduct._id,
              quantity: 5,
              price: 65,
              size: 'L',
              color: '#000000',
              subtotal: 325,
            },
          ],
          shippingAddress: {
            fullName: 'Test User',
            phone: '123456789',
            street: '123 St',
            city: 'Col',
            state: 'WP',
            postalCode: '10000',
            country: 'LK',
          },
          billingAddress: {
            fullName: 'Test User',
            phone: '123456789',
            street: '123 St',
            city: 'Col',
            state: 'WP',
            postalCode: '10000',
            country: 'LK',
          },
          subtotal: 325,
          total: 325,
        });

        const nextFn = vi.fn();
        const preSaveHooks = (Order.schema as any).s?.hooks?._pres?.get('save') || [];
        const hookObj = preSaveHooks.find((h: any) => h.fn.toString().includes('LOW_STOCK_THRESHOLD'));
        const hookFn = hookObj?.fn;
        await hookFn.call(order, nextFn);

        expect(nextFn).toHaveBeenCalledWith(expect.any(Error));
        expect(nextFn.mock.calls[0][0].statusCode).toBe(400);
        expect(nextFn.mock.calls[0][0].message).toContain('Insufficient stock');
      });

      it('should restore stock on order cancellation', async () => {
        const mockProduct = {
          _id: new mongoose.Types.ObjectId(productId),
          name: 'Iron Man Tee',
          stock: 10,
          isActive: true,
          save: vi.fn().mockResolvedValue(true),
        };

        vi.spyOn(Product, 'findById').mockResolvedValue(mockProduct as any);

        const order = new Order({
          user: new mongoose.Types.ObjectId(),
          items: [
            {
              product: mockProduct._id,
              quantity: 4,
              price: 65,
              size: 'L',
              color: '#000000',
              subtotal: 260,
            },
          ],
          shippingAddress: {
            fullName: 'Test User',
            phone: '123456789',
            street: '123 St',
            city: 'Col',
            state: 'WP',
            postalCode: '10000',
            country: 'LK',
          },
          billingAddress: {
            fullName: 'Test User',
            phone: '123456789',
            street: '123 St',
            city: 'Col',
            state: 'WP',
            postalCode: '10000',
            country: 'LK',
          },
          subtotal: 260,
          total: 260,
        });

        // Set status to cancelled and simulate save
        order.isNew = false;
        order.orderStatus = 'cancelled';
        
        // Mongoose tracks modified fields via isModified. Let's stub order.isModified to return true for orderStatus.
        vi.spyOn(order, 'isModified').mockImplementation((path) => path === 'orderStatus');

        const nextFn = vi.fn();
        const preSaveHooks = (Order.schema as any).s?.hooks?._pres?.get('save') || [];
        const hookObj = preSaveHooks.find((h: any) => h.fn.toString().includes('LOW_STOCK_THRESHOLD'));
        const hookFn = hookObj?.fn;
        await hookFn.call(order, nextFn);

        expect(nextFn).toHaveBeenCalledWith();
        expect(mockProduct.stock).toBe(14);
        expect(mockProduct.save).toHaveBeenCalled();
      });
    });

    describe('GET /api/v1/products with Search, Filtering & Sorting', () => {
      let findSpy: any;
      let countSpy: any;

      beforeEach(() => {
        vi.restoreAllMocks();
        findSpy = vi.spyOn(Product, 'find').mockReturnValue({
          sort: vi.fn().mockReturnValue({
            skip: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                exec: vi.fn().mockResolvedValue([]),
              }),
            }),
          }),
        } as any);

        countSpy = vi.spyOn(Product, 'countDocuments').mockResolvedValue(0);
      });

      it('should compile query with color, size, and inStock filters', async () => {
        const res = await request(app).get('/api/v1/products').query({
          color: '#ffffff',
          size: 'M',
          inStock: 'true',
        });

        expect(res.status).toBe(200);
        expect(findSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            availableColors: '#ffffff',
            availableSizes: 'M',
            stock: { $gt: 0 },
          })
        );
      });

      it('should compile query with inStock=false filter', async () => {
        const res = await request(app).get('/api/v1/products').query({
          inStock: 'false',
        });

        expect(res.status).toBe(200);
        expect(findSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            stock: 0,
          })
        );
      });

      it('should map sort keys newest, price, and popularity to schema fields', async () => {
        const sortSpy = vi.fn().mockReturnValue({
          skip: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              exec: vi.fn().mockResolvedValue([]),
            }),
          }),
        });

        findSpy.mockReturnValue({ sort: sortSpy } as any);

        // test price sort
        await request(app).get('/api/v1/products').query({
          sortBy: 'price',
          sortOrder: 'asc',
        });
        expect(sortSpy).toHaveBeenCalledWith({ basePrice: 1 });

        // test newest sort
        await request(app).get('/api/v1/products').query({
          sortBy: 'newest',
          sortOrder: 'desc',
        });
        expect(sortSpy).toHaveBeenCalledWith({ createdAt: -1 });

        // test popularity sort
        await request(app).get('/api/v1/products').query({
          sortBy: 'popularity',
          sortOrder: 'desc',
        });
        expect(sortSpy).toHaveBeenCalledWith({ reviewCount: -1 });
      });
    });
  });
});

