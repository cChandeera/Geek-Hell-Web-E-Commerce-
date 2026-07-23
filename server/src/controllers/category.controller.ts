import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryQuerySchema,
} from '../validators/category.validator';
import * as categoryService from '../services/category.service';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const queryInput = categoryQuerySchema.parse(req.query);
  const paginatedResult = await categoryService.getCategories(queryInput);

  res.status(200).json(new ApiResponse(200, paginatedResult, 'Categories retrieved successfully'));
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const category = await categoryService.getCategoryById(id);

  res.status(200).json(new ApiResponse(200, category, 'Category fetched successfully'));
});

export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = String(req.params.slug);
  const category = await categoryService.getCategoryBySlug(slug);

  res.status(200).json(new ApiResponse(200, category, 'Category fetched successfully'));
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const validatedInput = createCategorySchema.parse(req.body);
  const category = await categoryService.createCategory(validatedInput);

  res.status(201).json(new ApiResponse(201, category, 'Category created successfully'));
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const validatedInput = updateCategorySchema.parse(req.body);
  const category = await categoryService.updateCategory(id, validatedInput);

  res.status(200).json(new ApiResponse(200, category, 'Category updated successfully'));
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  await categoryService.deleteCategory(id);

  res.status(200).json(new ApiResponse(200, null, 'Category deleted successfully'));
});
