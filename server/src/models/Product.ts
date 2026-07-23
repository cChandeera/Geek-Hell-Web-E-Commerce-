import { Schema, model, Document, Types } from 'mongoose';
import { IImageAsset } from '../types/models';

export interface ISEO {
  metaTitle?: string;
  metaDescription?: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: Types.ObjectId | string;
  brand: string;
  basePrice: number;
  price?: number; // Alias helper
  discountPrice?: number;
  currency: string;
  gender: 'men' | 'women' | 'unisex';
  availableColors: string[];
  availableSizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  sizes?: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[]; // Alias helper for backwards compatibility
  stock: number;
  rating: number;
  reviewCount: number;
  images: (IImageAsset | string)[];
  tags: string[];
  isFeatured: boolean;
  isActive: boolean;
  seo?: ISEO;
  createdAt: Date;
  updatedAt: Date;
}

const seoSchema = new Schema<ISEO>(
  {
    metaTitle: { type: String, default: '', trim: true },
    metaDescription: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [150, 'Name cannot exceed 150 characters'],
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      default: function (this: IProduct) {
        if (this.name) {
          return this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        }
        return undefined;
      },
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: Schema.Types.Mixed,
      required: [true, 'Category is required'],
      index: true,
    },
    brand: {
      type: String,
      default: 'Geek Hell',
      trim: true,
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
      default: 0,
    },
    currency: {
      type: String,
      default: 'USD',
      trim: true,
    },
    gender: {
      type: String,
      enum: ['men', 'women', 'unisex'],
      default: 'unisex',
    },
    availableColors: {
      type: [String],
      default: ['#09090b', '#ffffff', '#ed1d24', '#0476f2'],
    },
    availableSizes: {
      type: [String],
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      default: ['S', 'M', 'L', 'XL'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0,
    },
    reviewCount: {
      type: Number,
      min: [0, 'Review count cannot be negative'],
      default: 0,
    },
    images: {
      type: [Schema.Types.Mixed],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    seo: {
      type: seoSchema,
      default: () => ({ metaTitle: '', metaDescription: '' }),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for `price` backwards compatibility
productSchema.virtual('price').get(function () {
  return this.basePrice;
});

// Virtual for `sizes` backwards compatibility
productSchema.virtual('sizes').get(function () {
  return this.availableSizes;
});

// Sync pre-validate hook for fallback
productSchema.pre('validate', function () {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  if (this.basePrice === undefined && (this as unknown as { price?: number }).price !== undefined) {
    this.basePrice = (this as unknown as { price: number }).price;
  }
});

export const Product = model<IProduct>('Product', productSchema);
