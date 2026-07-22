import { Router } from 'express';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json(new ApiResponse(200, { status: 'healthy', service: 'Geek Hell API Gateway' }, 'API service operational'));
});

export default router;
