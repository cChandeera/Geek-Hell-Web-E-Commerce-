import { Schema, model, Document, Types } from 'mongoose';

export interface ICartItem extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: string;
  customization?: Types.ObjectId | null;
  price: number;
  subtotal: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
      index: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
    size: {
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      required: [true, 'Garment size is required'],
    },
    color: {
      type: String,
      required: [true, 'Garment color is required'],
    },
    customization: {
      type: Schema.Types.ObjectId,
      ref: 'CustomDesign',
      default: null,
    },
    price: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Price cannot be negative'],
    },
    subtotal: {
      type: Number,
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate subtotal automatically
cartItemSchema.pre('validate', function (next) {
  if (this.price !== undefined && this.quantity !== undefined) {
    this.subtotal = Number((this.price * this.quantity).toFixed(2));
  }
  next();
});

export const CartItem = model<ICartItem>('CartItem', cartItemSchema);
