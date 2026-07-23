import { describe, it, expect } from 'vitest';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { Coupon } from '../models/Coupon';
import { CustomDesign } from '../models/CustomDesign';
import { Types } from 'mongoose';

describe('MongoDB Models Validation & Schema Suite', () => {
  // 1. User Model Validation
  describe('User Model', () => {
    it('should validate a valid user object without errors', () => {
      const user = new User({
        name: 'Tony Stark',
        email: 'tony@stark.com',
        password: 'password123',
        role: 'customer',
      });
      const err = user.validateSync();
      expect(err).toBeUndefined();
    });

    it('should fail validation if email is missing or invalid format', () => {
      const user = new User({
        name: 'Tony Stark',
        email: 'invalid-email-format',
        password: 'password123',
      });
      const err = user.validateSync();
      expect(err).toBeDefined();
      expect(err?.errors.email).toBeDefined();
    });
  });

  // 2. Product Model Validation
  describe('Product Model', () => {
    it('should auto-generate slug from name if not provided', () => {
      const product = new Product({
        name: 'Iron Man Arc Reactor Oversized Tee',
        description: 'Heavy cotton luxury tee',
        category: new Types.ObjectId(),
        basePrice: 65,
        stock: 50,
      });
      product.validateSync();
      expect(product.slug).toBe('iron-man-arc-reactor-oversized-tee');
    });

    it('should fail validation if basePrice is negative', () => {
      const product = new Product({
        name: 'Spider-Man Cyberpunk Tee',
        slug: 'spiderman-tee',
        description: 'Spider-man tee description',
        category: 'Marvel',
        basePrice: -10,
      });
      const err = product.validateSync();
      expect(err).toBeDefined();
      expect(err?.errors.basePrice).toBeDefined();
    });
  });

  // 3. Order Model Validation
  describe('Order Model', () => {
    it('should auto-generate unique orderNumber with GH prefix', () => {
      const order = new Order({
        user: new Types.ObjectId(),
        items: [
          {
            product: new Types.ObjectId(),
            quantity: 2,
            price: 50,
            size: 'L',
            color: '#09090b',
            subtotal: 100,
          },
        ],
        shippingAddress: {
          fullName: 'Bruce Wayne',
          phone: '+15550192',
          street: '1007 Mountain Drive',
          city: 'Gotham',
          state: 'NJ',
          postalCode: '07001',
          country: 'USA',
        },
        billingAddress: {
          fullName: 'Bruce Wayne',
          phone: '+15550192',
          street: '1007 Mountain Drive',
          city: 'Gotham',
          state: 'NJ',
          postalCode: '07001',
          country: 'USA',
        },
        subtotal: 100,
        total: 100,
      });
      order.validateSync();
      expect(order.orderNumber).toBeDefined();
      expect(order.orderNumber.startsWith('GH-')).toBe(true);
    });
  });

  // 4. Coupon Expiration Logic
  describe('Coupon Expiration & Usage Limits', () => {
    it('should return isValid() true for active unexpired coupon under limit', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const coupon = new Coupon({
        code: 'HERO2026',
        description: '20% off superhero sale',
        discountType: 'percentage',
        value: 20,
        usageLimit: 100,
        usedCount: 5,
        expiresAt: futureDate,
        isActive: true,
      });
      expect(coupon.isValid()).toBe(true);
      expect(coupon.code).toBe('HERO2026');
    });

    it('should return isValid() false for expired coupon', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const coupon = new Coupon({
        code: 'EXPIRED10',
        description: 'Expired promo',
        discountType: 'fixed',
        value: 10,
        expiresAt: pastDate,
        isActive: true,
      });
      expect(coupon.isValid()).toBe(false);
    });
  });

  // 5. Custom Design Creation
  describe('Custom Design Creation', () => {
    it('should create custom 3D design model with vector defaults', () => {
      const design = new CustomDesign({
        user: new Types.ObjectId(),
        product: new Types.ObjectId(),
        shirtColor: '#ed1d24',
        designImage: { publicId: 'spider_logo', url: 'https://cloudinary.com/spider.png' },
        printSide: 'front',
      });
      design.validateSync();
      expect(design.shirtColor).toBe('#ed1d24');
      expect(design.hexColor).toBe('#ed1d24');
      expect(design.status).toBe('saved');
    });
  });
});
