import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
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
