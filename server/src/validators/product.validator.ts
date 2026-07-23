import { z } from 'zod';
import { ApiError } from '../utils/ApiError';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters').max(150, 'Name cannot exceed 150 characters'),
  slug: z.string().optional(),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  shortDescription: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().default('Geek Hell'),
  basePrice: z.number().min(0, 'Base price cannot be negative'),
  discountPrice: z.number().min(0, 'Discount price cannot be negative').optional().default(0),
  currency: z.string().default('LKR'),
  gender: z.enum(['men', 'women', 'unisex']).default('unisex'),
  availableColors: z.array(z.string()).default(['#09090b', '#ffffff', '#ed1d24', '#0476f2']),
  availableSizes: z.array(z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL'])).default(['S', 'M', 'L', 'XL']),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  images: z
    .array(
      z.union([
        z.string(),
        z.object({
          publicId: z.string().optional(),
          url: z.string(),
          thumbnail: z.string().optional(),
        }),
      ])
    )
    .optional()
    .default([]),
  tags: z.array(z.string()).optional().default([]),
  isFeatured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  gender: z.enum(['men', 'women', 'unisex']).optional(),
  isFeatured: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
  isActive: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  color: z.string().optional(),
  size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']).optional(),
  inStock: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
  sortBy: z
    .enum([
      'basePrice',
      'name',
      'createdAt',
      'stock',
      'rating',
      'newest',
      'price',
      'popularity',
    ])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Validates multiple uploaded product images.
 *
 * @param files - Array of Express.Multer.File.
 */
export const validateProductImages = (files: Express.Multer.File[]): void => {
  if (!files || files.length === 0) {
    throw new ApiError(400, 'Please upload at least one image');
  }

  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new ApiError(
        400,
        `Invalid file type: ${file.originalname}. Only JPEG, PNG, and WEBP images are allowed.`
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new ApiError(
        400,
        `File too large: ${file.originalname}. Maximum allowed size is 5MB.`
      );
    }
  }
};

/**
 * Validates a single uploaded product image.
 *
 * @param file - Express.Multer.File.
 */
export const validateProductImage = (file: Express.Multer.File): void => {
  if (!file) {
    throw new ApiError(400, 'Please upload an image file');
  }
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new ApiError(
      400,
      `Invalid file type: ${file.originalname}. Only JPEG, PNG, and WEBP images are allowed.`
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new ApiError(
      400,
      `File too large: ${file.originalname}. Maximum allowed size is 5MB.`
    );
  }
};

export const updateStockSchema = z.object({
  quantity: z.number().int('Quantity must be an integer').min(0, 'Quantity cannot be negative'),
  action: z.enum(['increase', 'decrease', 'set']).default('set'),
});

export type UpdateStockInput = z.infer<typeof updateStockSchema>;

