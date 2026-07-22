import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import * as productService from '../services/product.service';

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const category = req.query.category ? String(req.query.category) : undefined;
  const search = req.query.search ? String(req.query.search) : undefined;

  const products = await productService.getProducts(category, search);

  res.status(200).json(new ApiResponse(200, products, 'Products fetched successfully'));
});

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const product = await productService.getProductById(id);

  res.status(200).json(new ApiResponse(200, product, 'Product fetched successfully'));
});
