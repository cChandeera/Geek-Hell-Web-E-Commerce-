import { Schema, model, Document } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minimumOrder: number;
  maximumDiscount: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isValid(): boolean;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Coupon description is required'],
      trim: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: [true, 'Discount type is required'],
    },
    value: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative'],
    },
    minimumOrder: {
      type: Number,
      default: 0,
      min: [0, 'Minimum order amount cannot be negative'],
    },
    maximumDiscount: {
      type: Number,
      default: 0,
      min: [0, 'Maximum discount cannot be negative'],
    },
    usageLimit: {
      type: Number,
      default: 100,
      min: [1, 'Usage limit must be at least 1'],
    },
    usedCount: {
      type: Number,
      default: 0,
      min: [0, 'Used count cannot be negative'],
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiration date is required'],
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook to force code uppercase
couponSchema.pre('validate', function (next) {
  if (this.code) {
    this.code = this.code.toUpperCase().trim();
  }
  next();
});

// Instance method to check coupon validity
couponSchema.methods.isValid = function (): boolean {
  const now = new Date();
  return this.isActive && this.expiresAt > now && this.usedCount < this.usageLimit;
};

export const Coupon = model<ICoupon>('Coupon', couponSchema);
