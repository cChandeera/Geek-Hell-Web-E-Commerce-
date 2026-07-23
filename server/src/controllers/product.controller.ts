import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
  validateProductImages,
  validateProductImage,
  updateStockSchema,
} from '../validators/product.validator';
import * as productService from '../services/product.service';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const queryInput = productQuerySchema.parse(req.query);
  const paginatedResult = await productService.getProducts(queryInput);

  res.status(200).json(new ApiResponse(200, paginatedResult, 'Products retrieved successfully'));
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const product = await productService.getProductById(id);

  res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  const product = await productService.getProductBySlug(slug);

  res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const validatedInput = createProductSchema.parse(req.body);
  const product = await productService.createProduct(validatedInput);

  res.status(201).json(new ApiResponse(201, product, 'Product created successfully'));
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const validatedInput = updateProductSchema.parse(req.body);
  const product = await productService.updateProduct(id, validatedInput);

  res.status(200).json(new ApiResponse(200, product, 'Product updated successfully'));
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  await productService.deleteProduct(id);

  res.status(200).json(new ApiResponse(200, null, 'Product deleted successfully'));
});

/**
 * Upload multiple images for a product.
 */
export const uploadProductImages = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const files = req.files as Express.Multer.File[];

  if (!files || files.length === 0) {
    throw new ApiError(400, 'Please upload at least one image file');
  }

  // Validate formatting and file size
  validateProductImages(files);

  const product = await productService.uploadProductImages(id, files);

  res.status(200).json(new ApiResponse(200, product, 'Product images uploaded successfully'));
});

/**
 * Replaces an existing product image with a new uploaded image.
 */
export const updateProductImage = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { oldPublicId } = req.body;
  const file = req.file as Express.Multer.File;

  if (!oldPublicId) {
    throw new ApiError(400, 'Please provide the oldPublicId of the image to replace');
  }

  if (!file) {
    throw new ApiError(400, 'Please upload a new image file');
  }

  // Validate new image formatting and file size
  validateProductImage(file);

  const product = await productService.updateProductImage(id, oldPublicId, file);

  res.status(200).json(new ApiResponse(200, product, 'Product image updated successfully'));
});

/**
 * Deletes a product image from the catalog and CDN.
 */
export const deleteProductImage = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const publicId = String(req.query.publicId || req.body.publicId || '');

  if (!publicId) {
    throw new ApiError(400, 'Please provide the publicId of the image to delete');
  }

  const product = await productService.deleteProductImage(id, publicId);

  res.status(200).json(new ApiResponse(200, product, 'Product image deleted successfully'));
});

/**
 * Direct manual update of product stock by admin.
 */
export const updateProductStock = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const { quantity, action } = updateStockSchema.parse(req.body);

  const product = await productService.updateProductStock(id, quantity, action);

  res.status(200).json(new ApiResponse(200, product, 'Product stock updated successfully'));
});

