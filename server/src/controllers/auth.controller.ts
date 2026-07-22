import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import * as authService from '../services/auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const validatedInput = registerSchema.parse(req.body);
  const result = await authService.registerUser(validatedInput);

  res.status(201).json(new ApiResponse(201, result, 'User registered successfully'));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const validatedInput = loginSchema.parse(req.body);
  const result = await authService.loginUser(validatedInput);

  res.status(200).json(new ApiResponse(200, result, 'User logged in successfully'));
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const user = await authService.getUserById(userId);

  res.status(200).json(new ApiResponse(200, user, 'Authenticated user profile fetched'));
});
