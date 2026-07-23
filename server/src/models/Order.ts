import { Schema, model, Document, Types } from 'mongoose';
import { IAddress } from '../types/models';
import { addressSchema } from './User';

export interface IOrderItem {
  product: Types.ObjectId;
  customization?: Types.ObjectId | null;
  quantity: number;
  price: number;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: string;
  subtotal: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  shippingAddress: IAddress;
  billingAddress: IAddress;
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
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    customization: {
      type: Schema.Types.ObjectId,
      ref: 'CustomDesign',
      default: null,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    price: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Price cannot be negative'],
    },
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      required: [true, 'Size is required'],
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
  },
  { _id: true }
);

const orderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    orderNumber: {
      type: String,
      required: [true, 'Order number is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Order items cannot be empty'],
    },
    shippingAddress: {
      type: addressSchema,
      required: [true, 'Shipping address is required'],
    },
    billingAddress: {
      type: addressSchema,
      required: [true, 'Billing address is required'],
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      default: 'stripe',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'printing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true,
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: [0, 'Shipping cost cannot be negative'],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    total: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
    },
    trackingNumber: {
      type: String,
      default: '',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook to generate unique order number if missing
orderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(4, '0');
    this.orderNumber = `GH-${timestamp}-${randomHex}`;
  }
  if (this.subtotal !== undefined && this.total === undefined) {
    this.total = Number((this.subtotal + (this.shippingCost || 0) + (this.tax || 0) - (this.discount || 0)).toFixed(2));
  }
  next();
});

export const Order = model<IOrder>('Order', orderSchema);
