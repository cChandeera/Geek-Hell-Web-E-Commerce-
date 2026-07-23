import { Schema, model, Document, Types } from 'mongoose';
import { IImageAsset, IVector3D } from '../types/models';

export interface ICustomDesign extends Document {
  user: Types.ObjectId;
  userId?: Types.ObjectId; // Alias for backwards compatibility
  product: Types.ObjectId;
  productId?: Types.ObjectId; // Alias for backwards compatibility
  shirtColor: string;
  hexColor: string;
  designImage: IImageAsset | string;
  position: IVector3D;
  rotation: IVector3D | number;
  scale: IVector3D | { x: number; y: number };
  printSide: 'front' | 'back' | 'leftSleeve' | 'rightSleeve';
  status: 'draft' | 'saved' | 'ordered';
  createdAt: Date;
  updatedAt: Date;
}

const vector3DSchema = new Schema<IVector3D>(
  {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 },
  },
  { _id: false }
);

const customDesignSchema = new Schema<ICustomDesign>(
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
    shirtColor: {
      type: String,
      required: [true, 'Shirt color is required'],
      default: '#09090b',
    },
    hexColor: {
      type: String,
      default: function (this: ICustomDesign) {
        return this.shirtColor || '#09090b';
      },
    },
    designImage: {
      type: Schema.Types.Mixed,
      required: [true, 'Design image is required'],
    },
    position: {
      type: vector3DSchema,
      default: () => ({ x: 0, y: 0, z: 0.15 }),
    },
    rotation: {
      type: Schema.Types.Mixed,
      default: () => ({ x: 0, y: 0, z: 0 }),
    },
    scale: {
      type: Schema.Types.Mixed,
      default: () => ({ x: 0.5, y: 0.5, z: 0.5 }),
    },
    printSide: {
      type: String,
      enum: ['front', 'back', 'leftSleeve', 'rightSleeve'],
      default: 'front',
    },
    status: {
      type: String,
      enum: ['draft', 'saved', 'ordered'],
      default: 'saved',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual aliases for userId and productId backwards compatibility
customDesignSchema.virtual('userId').get(function () {
  return this.user;
});

customDesignSchema.virtual('productId').get(function () {
  return this.product;
});

// Pre-validate hook to support alias input mappings
customDesignSchema.pre('validate', function () {
  if (!this.user && (this as unknown as { userId?: Types.ObjectId }).userId) {
    this.user = (this as unknown as { userId: Types.ObjectId }).userId;
  }
  if (!this.product && (this as unknown as { productId?: Types.ObjectId }).productId) {
    this.product = (this as unknown as { productId: Types.ObjectId }).productId;
  }
  if (!this.hexColor && this.shirtColor) {
    this.hexColor = this.shirtColor;
  }
});

export const CustomDesign = model<ICustomDesign>('CustomDesign', customDesignSchema);
export const Customization = CustomDesign; // Re-export alias for Step 04 service compatibility
