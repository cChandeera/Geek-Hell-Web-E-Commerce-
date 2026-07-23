import { axiosInstance } from '../api/axiosInstance';
import {
  DashboardMetrics,
  SalesChartData,
  AdminProduct,
  AdminCategory,
  AdminOrder,
  AdminUser,
  AdminCustomDesign,
  AdminCoupon,
  AdminReview,
  AdminSettings,
  AdminNotification,
} from '../types/admin';

// Sample mock analytical fallbacks for dashboard reporting
const MOCK_METRICS: DashboardMetrics = {
  totalRevenue: 124850,
  todayRevenue: 3420,
  monthlyRevenue: 48200,
  totalOrders: 1420,
  pendingOrders: 18,
  totalProducts: 48,
  totalCustomers: 980,
  lowStockCount: 3,
};

const MOCK_SALES_CHART: SalesChartData[] = [
  { name: 'Mon', revenue: 4200, orders: 42 },
  { name: 'Tue', revenue: 5800, orders: 58 },
  { name: 'Wed', revenue: 6400, orders: 61 },
  { name: 'Thu', revenue: 7200, orders: 74 },
  { name: 'Fri', revenue: 9100, orders: 89 },
  { name: 'Sat', revenue: 11400, orders: 110 },
  { name: 'Sun', revenue: 8300, orders: 78 },
];

const MOCK_NOTIFICATIONS: AdminNotification[] = [
  { id: '1', title: 'New Order #GH-M89X21', message: 'Tony Stark placed an order for $130', type: 'order', read: false, createdAt: '10 mins ago' },
  { id: '2', title: 'Low Stock Alert', message: 'Iron Man Mark 85 Oversized Tee has 3 items left', type: 'stock', read: false, createdAt: '1 hour ago' },
  { id: '3', title: 'New Product Review', message: 'Bruce Wayne rated Batman Stealth Armor 5 stars', type: 'review', read: true, createdAt: '3 hours ago' },
];

export const adminService = {
  // Dashboard Analytics
  getMetrics: async (): Promise<DashboardMetrics> => {
    try {
      const response = await axiosInstance.get('/admin/metrics');
      return response.data.data;
    } catch {
      return MOCK_METRICS;
    }
  },

  getSalesChart: async (): Promise<SalesChartData[]> => {
    try {
      const response = await axiosInstance.get('/admin/sales-chart');
      return response.data.data;
    } catch {
      return MOCK_SALES_CHART;
    }
  },

  getNotifications: async (): Promise<AdminNotification[]> => {
    try {
      const response = await axiosInstance.get('/admin/notifications');
      return response.data.data;
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  },

  // Product CRUD
  getProducts: async (params?: { category?: string; search?: string }): Promise<AdminProduct[]> => {
    try {
      const response = await axiosInstance.get('/products', { params });
      return response.data.data.map((p: any) => ({
        id: p._id || p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        category: typeof p.category === 'string' ? p.category : p.category?.name || 'Apparel',
        brand: p.brand || 'Geek Hell',
        basePrice: p.basePrice || p.price || 0,
        discountPrice: p.discountPrice || 0,
        currency: p.currency || 'USD',
        gender: p.gender || 'unisex',
        availableColors: p.availableColors || ['#09090b'],
        availableSizes: p.availableSizes || p.sizes || ['S', 'M', 'L', 'XL'],
        stock: p.stock ?? 50,
        rating: p.rating || 5,
        reviewCount: p.reviewCount || 12,
        images: p.images || [],
        tags: p.tags || ['Superhero'],
        isFeatured: p.isFeatured ?? true,
        isActive: p.isActive ?? true,
        createdAt: p.createdAt,
      }));
    } catch {
      return [];
    }
  },

  getProductById: async (id: string): Promise<AdminProduct> => {
    const response = await axiosInstance.get(`/products/${id}`);
    const p = response.data.data;
    return {
      id: p._id || p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      shortDescription: p.shortDescription || '',
      category: typeof p.category === 'string' ? p.category : p.category?.name || 'Apparel',
      brand: p.brand || 'Geek Hell',
      basePrice: p.basePrice || p.price || 0,
      discountPrice: p.discountPrice || 0,
      currency: p.currency || 'USD',
      gender: p.gender || 'unisex',
      availableColors: p.availableColors || ['#09090b'],
      availableSizes: p.availableSizes || p.sizes || ['S', 'M', 'L', 'XL'],
      stock: p.stock ?? 50,
      rating: p.rating || 5,
      reviewCount: p.reviewCount || 12,
      images: p.images || [],
      tags: p.tags || [],
      isFeatured: p.isFeatured ?? false,
      isActive: p.isActive ?? true,
      seo: p.seo || { metaTitle: '', metaDescription: '' },
    };
  },

  createProduct: async (productData: Partial<AdminProduct>): Promise<AdminProduct> => {
    const response = await axiosInstance.post('/products', productData);
    return response.data.data;
  },

  updateProduct: async (id: string, productData: Partial<AdminProduct>): Promise<AdminProduct> => {
    const response = await axiosInstance.put(`/products/${id}`, productData);
    return response.data.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/products/${id}`);
  },

  // Category CRUD
  getCategories: async (): Promise<AdminCategory[]> => {
    try {
      const response = await axiosInstance.get('/categories');
      return response.data.data;
    } catch {
      return [
        { id: '1', name: 'Marvel', slug: 'marvel', description: 'Marvel Cinematic Superhero Collection', sortOrder: 1, isActive: true, productCount: 24 },
        { id: '2', name: 'DC', slug: 'dc', description: 'DC Justice League Collection', sortOrder: 2, isActive: true, productCount: 18 },
        { id: '3', name: 'Geek Original', slug: 'geek-original', description: 'Geek Hell Exclusive Apparel Lines', sortOrder: 3, isActive: true, productCount: 12 },
      ];
    }
  },

  // Order Management
  getOrders: async (): Promise<AdminOrder[]> => {
    try {
      const response = await axiosInstance.get('/orders/admin/all');
      return response.data.data;
    } catch {
      return [
        {
          id: '1',
          orderNumber: 'GH-M89X21-4F2A',
          user: { id: 'u1', name: 'Tony Stark', email: 'tony@starkindustries.com' },
          items: [{ product: 'Marvel Iron Man Mark 85 Arc Reactor Tee', quantity: 2, price: 65, size: 'XL', color: '#ed1d24', subtotal: 130 }],
          shippingAddress: { fullName: 'Tony Stark', phone: '+1 555-0192', street: '10880 Wilshire Blvd', city: 'Malibu', state: 'CA', postalCode: '90265', country: 'USA' },
          billingAddress: { fullName: 'Tony Stark', phone: '+1 555-0192', street: '10880 Wilshire Blvd', city: 'Malibu', state: 'CA', postalCode: '90265', country: 'USA' },
          paymentMethod: 'stripe',
          paymentStatus: 'paid',
          orderStatus: 'printing',
          subtotal: 130,
          shippingCost: 0,
          tax: 10,
          discount: 0,
          total: 140,
          trackingNumber: 'TRK-9821034',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          orderNumber: 'GH-DC401A-981F',
          user: { id: 'u2', name: 'Bruce Wayne', email: 'bruce@wayneenterprises.com' },
          items: [{ product: 'DC Batman Dark Knight Stealth Armor Tee', quantity: 1, price: 70, size: 'L', color: '#09090b', subtotal: 70 }],
          shippingAddress: { fullName: 'Bruce Wayne', phone: '+1 555-0188', street: '1007 Mountain Drive', city: 'Gotham', state: 'NJ', postalCode: '07001', country: 'USA' },
          billingAddress: { fullName: 'Bruce Wayne', phone: '+1 555-0188', street: '1007 Mountain Drive', city: 'Gotham', state: 'NJ', postalCode: '07001', country: 'USA' },
          paymentMethod: 'stripe',
          paymentStatus: 'paid',
          orderStatus: 'shipped',
          subtotal: 70,
          shippingCost: 10,
          tax: 5,
          discount: 0,
          total: 85,
          trackingNumber: 'TRK-5541902',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ];
    }
  },

  updateOrderStatus: async (id: string, orderStatus: string): Promise<void> => {
    await axiosInstance.patch(`/orders/${id}/status`, { orderStatus });
  },

  // User Management
  getUsers: async (): Promise<AdminUser[]> => {
    try {
      const response = await axiosInstance.get('/users/admin/all');
      return response.data.data;
    } catch {
      return [
        { id: 'u1', name: 'Tony Stark', email: 'tony@starkindustries.com', role: 'customer', status: 'active', isVerified: true, orderCount: 8, totalSpent: 1240, createdAt: '2026-01-15' },
        { id: 'u2', name: 'Bruce Wayne', email: 'bruce@wayneenterprises.com', role: 'customer', status: 'active', isVerified: true, orderCount: 5, totalSpent: 850, createdAt: '2026-02-01' },
        { id: 'u3', name: 'Admin Master', email: 'admin@geekhell.com', role: 'admin', status: 'active', isVerified: true, orderCount: 0, totalSpent: 0, createdAt: '2026-01-01' },
      ];
    }
  },

  updateUserRole: async (userId: string, role: 'customer' | 'admin'): Promise<void> => {
    await axiosInstance.patch(`/users/${userId}/role`, { role });
  },

  updateUserStatus: async (userId: string, status: 'active' | 'inactive' | 'blocked'): Promise<void> => {
    await axiosInstance.patch(`/users/${userId}/status`, { status });
  },

  // 3D Custom Designs Management
  getCustomDesigns: async (): Promise<AdminCustomDesign[]> => {
    try {
      const response = await axiosInstance.get('/designer/admin/all');
      return response.data.data;
    } catch {
      return [
        {
          id: 'cd1',
          user: { name: 'Peter Parker', email: 'peter@dailybugle.com' },
          product: { name: 'Marvel Spider-Man Web-Slinger Cyberpunk Tee' },
          shirtColor: '#ed1d24',
          designImage: '/models/textures/spider_emblem.png',
          printSide: 'front',
          status: 'saved',
          createdAt: new Date().toISOString(),
        },
      ];
    }
  },

  deleteCustomDesign: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/designer/${id}`);
  },

  // Coupon Management
  getCoupons: async (): Promise<AdminCoupon[]> => {
    try {
      const response = await axiosInstance.get('/coupons');
      return response.data.data;
    } catch {
      return [
        { id: 'c1', code: 'HERO2026', description: '20% off all Marvel & DC Apparel', discountType: 'percentage', value: 20, minimumOrder: 50, maximumDiscount: 30, usageLimit: 200, usedCount: 42, expiresAt: '2026-12-31', isActive: true },
        { id: 'c2', code: 'AVENGERS10', description: '$10 Fixed discount on orders over $60', discountType: 'fixed', value: 10, minimumOrder: 60, maximumDiscount: 10, usageLimit: 100, usedCount: 15, expiresAt: '2026-10-15', isActive: true },
      ];
    }
  },

  createCoupon: async (couponData: Partial<AdminCoupon>): Promise<AdminCoupon> => {
    const response = await axiosInstance.post('/coupons', couponData);
    return response.data.data;
  },

  deleteCoupon: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/coupons/${id}`);
  },

  // Review Management
  getReviews: async (): Promise<AdminReview[]> => {
    try {
      const response = await axiosInstance.get('/reviews/admin/all');
      return response.data.data;
    } catch {
      return [
        { id: 'r1', user: { name: 'Clark Kent', email: 'clark@dailyplanet.com' }, product: { name: 'DC Superman Shield Classic Tee' }, rating: 5, title: 'Unmatched Fabric Quality', comment: 'Feels indestructible like Kryptonian armor! Excellent fit.', isVerifiedPurchase: true, status: 'approved', createdAt: '2 days ago' },
        { id: 'r2', user: { name: 'Wade Wilson', email: 'pool@deadpool.com' }, product: { name: 'Marvel Deadpool Chimichanga Tee' }, rating: 5, title: 'Maximum Effort!', comment: 'Great quality print. Looks amazing in 3D customizer preview.', isVerifiedPurchase: true, status: 'approved', createdAt: '5 days ago' },
      ];
    }
  },

  // Settings
  getSettings: async (): Promise<AdminSettings> => {
    try {
      const response = await axiosInstance.get('/admin/settings');
      return response.data.data;
    } catch {
      return {
        brandName: 'GEEK HELL',
        contactEmail: 'support@geekhell.com',
        supportPhone: '+1 (800) 555-GEEK',
        currency: 'USD',
        taxRatePercentage: 8,
        standardShippingFee: 9.99,
        freeShippingThreshold: 100,
        marvelAccentGlow: true,
        dcAccentGlow: true,
        metaTitle: 'GEEK HELL | Premium Superhero 3D Apparel Store',
        metaDescription: 'Luxury superhero-inspired apparel platform & 3D WebGL customizer.',
      };
    }
  },

  updateSettings: async (settings: Partial<AdminSettings>): Promise<AdminSettings> => {
    const response = await axiosInstance.post('/admin/settings', settings);
    return response.data.data;
  },
};
