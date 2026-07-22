import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { createCustomizationSchema } from '../validators/customization.validator';
import * as customizationService from '../services/customization.service';

export const createCustomization = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const validatedInput = createCustomizationSchema.parse(req.body);
  const customization = await customizationService.createCustomization(userId, validatedInput);

  res.status(201).json(new ApiResponse(201, customization, 'T-Shirt customization saved successfully'));
});

export const getCustomizationById = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const customization = await customizationService.getCustomizationById(id);

  res.status(200).json(new ApiResponse(200, customization, 'Customization configuration fetched successfully'));
});
