import { Schema, model, Document, Types } from 'mongoose';

export interface IFavorite extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
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
  },
  {
    timestamps: true,
  }
);

// Enforce unique favorite per user per product
favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

export const Favorite = model<IFavorite>('Favorite', favoriteSchema);
