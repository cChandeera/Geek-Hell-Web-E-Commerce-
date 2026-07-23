import { Types } from 'mongoose';

/**
 * Base Interface for all Mongoose Document Data
 */
export interface IBaseDocument {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Type helper for ObjectId fields
 */
export type ObjectIdLike = Types.ObjectId | string;

/**
 * Image asset representation for Cloudinary uploads
 */
export interface IImageAsset {
  publicId: string;
  url: string;
  thumbnail?: string;
}

/**
 * Embedded Customer Address Structure
 */
export interface IAddress {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

/**
 * 3D Transform coordinates (position, rotation, scale)
 */
export interface IVector3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Pagination Request Query Parameters
 */
export interface IPaginationParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * Standardized Paginated Result Container
 */
export interface IPaginatedResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
