export interface DashboardMetrics {
  totalRevenue: number;
  todayRevenue: number;
  monthlyRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalCustomers: number;
  lowStockCount: number;
}

export interface SalesChartData {
  name: string;
  revenue: number;
  orders: number;
}

export interface CategoryDistribution {
  name: string;
  count: number;
}

export interface AdminProduct {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: string;
  brand: string;
  basePrice: number;
  price?: number;
  discountPrice?: number;
  currency: string;
  gender: 'men' | 'women' | 'unisex';
  availableColors: string[];
  availableSizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  stock: number;
  rating: number;
  reviewCount: number;
  images: { publicId?: string; url: string }[] | string[];
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  seo?: { metaTitle?: string; metaDescription?: string };
  createdAt?: string;
}

export interface AdminCategory {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  description: string;
  parentCategory?: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
  createdAt?: string;
}

export interface AdminOrderItem {
  product: string | AdminProduct;
  customization?: string | null;
  quantity: number;
  price: number;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: string;
  subtotal: number;
}

export interface AdminAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface AdminOrder {
  id: string;
  _id?: string;
  orderNumber: string;
  user: { id?: string; _id?: string; name: string; email: string };
  items: AdminOrderItem[];
  shippingAddress: AdminAddress;
  billingAddress: AdminAddress;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'processing' | 'printing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  status: 'active' | 'inactive' | 'blocked';
  isVerified: boolean;
  phone?: string;
  avatar?: string | { url: string };
  orderCount?: number;
  totalSpent?: number;
  createdAt: string;
}

export interface AdminCustomDesign {
  id: string;
  _id?: string;
  user: { id?: string; _id?: string; name: string; email: string };
  product: { id?: string; _id?: string; name: string; images?: string[] };
  shirtColor: string;
  designImage: { url: string } | string;
  printSide: 'front' | 'back' | 'leftSleeve' | 'rightSleeve';
  status: 'draft' | 'saved' | 'ordered';
  createdAt: string;
}

export interface AdminCoupon {
  id: string;
  _id?: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minimumOrder: number;
  maximumDiscount: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
  createdAt?: string;
}

export interface AdminReview {
  id: string;
  _id?: string;
  user: { name: string; email: string };
  product: { name: string };
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  status?: 'approved' | 'hidden' | 'pending';
  createdAt: string;
}

export interface AdminSettings {
  brandName: string;
  contactEmail: string;
  supportPhone: string;
  currency: string;
  taxRatePercentage: number;
  standardShippingFee: number;
  freeShippingThreshold: number;
  marvelAccentGlow: boolean;
  dcAccentGlow: boolean;
  metaTitle: string;
  metaDescription: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'stock' | 'review' | 'system';
  read: boolean;
  createdAt: string;
}
