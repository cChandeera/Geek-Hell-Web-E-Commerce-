import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import customizationRoutes from './customization.routes';
import { ApiResponse } from '../utils/ApiResponse';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json(
    new ApiResponse(
      200,
      { status: 'healthy', service: 'Geek Hell Express API Gateway', timestamp: new Date().toISOString() },
      'API service operational'
    )
  );
});

// Route Modules
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/customizations', customizationRoutes);

export default router;
