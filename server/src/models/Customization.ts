import { Schema, model, Document, Types } from 'mongoose';

export interface ICustomization extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  shirtColor: string;
  designImage: string;
  position: { x: number; y: number; z: number };
  scale: { x: number; y: number };
  rotation: number;
  createdAt: Date;
  updatedAt: Date;
}

const customizationSchema = new Schema<ICustomization>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
      index: true,
    },
    shirtColor: {
      type: String,
      required: [true, 'Shirt color is required'],
      default: '#09090b',
    },
    designImage: {
      type: String,
      required: [true, 'Design image URL/path is required'],
    },
    position: {
      x: { type: Number, default: 0 },
      y: { type: Number, default: 0 },
      z: { type: Number, default: 0.15 },
    },
    scale: {
      x: { type: Number, default: 0.5 },
      y: { type: Number, default: 0.5 },
    },
    rotation: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Customization = model<ICustomization>('Customization', customizationSchema);
