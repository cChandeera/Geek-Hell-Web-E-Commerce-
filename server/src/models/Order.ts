import { Schema, model, Document, Types } from 'mongoose';
import { IAddress } from '../types/models';
import { addressSchema } from './User';
import { Product } from './Product';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';


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

const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomHex = Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(4, '0');
  return `GH-${timestamp}-${randomHex}`;
};

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
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
      default: generateOrderNumber,
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

// Pre-validate hook
orderSchema.pre('validate', function () {
  if (!this.orderNumber) {
    this.orderNumber = generateOrderNumber();
  }
  if (this.subtotal !== undefined && this.total === undefined) {
    this.total = Number((this.subtotal + (this.shippingCost || 0) + (this.tax || 0) - (this.discount || 0)).toFixed(2));
  }
});

// Pre-save hook to validate stock and update inventory
orderSchema.pre('save', async function (next) {
  const LOW_STOCK_THRESHOLD = 5;

  try {
    if (this.isNew) {
      for (const item of this.items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return next(new ApiError(404, `Product not found with ID ${item.product}`));
        }

        if (!product.isActive) {
          return next(new ApiError(400, `Product '${product.name}' is inactive and cannot be purchased.`));
        }

        if (product.stock < item.quantity) {
          return next(
            new ApiError(
              400,
              `Insufficient stock for product '${product.name}'. Available: ${product.stock}, Requested: ${item.quantity}`
            )
          );
        }

        // Deduct stock
        product.stock -= item.quantity;

        // Handle alerts
        if (product.stock === 0) {
          logger.warn(`[Out of Stock Alert] Product '${product.name}' (ID: ${product._id}) is now out of stock.`);
        } else if (product.stock <= LOW_STOCK_THRESHOLD) {
          logger.warn(
            `[Low Stock Alert] Product '${product.name}' (ID: ${product._id}) is low on stock: ${product.stock} left.`
          );
        }

        await product.save();
      }
    } else if (this.isModified('orderStatus')) {
      // If order status is changed to cancelled, restore stock
      if (this.orderStatus === 'cancelled') {
        for (const item of this.items) {
          const product = await Product.findById(item.product);
          if (product) {
            product.stock += item.quantity;
            await product.save();
            logger.info(
              `[Stock Restored] Restored ${item.quantity} units for product '${product.name}' (ID: ${product._id}) due to order cancellation.`
            );
          }
        }
      }
    }
    next();
  } catch (err) {
    next(err as any);
  }
});

export const Order = model<IOrder>('Order', orderSchema);

