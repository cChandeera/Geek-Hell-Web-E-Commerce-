import { Router } from 'express';
import {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  updateProductImage,
  deleteProductImage,
  updateProductStock,
} from '../controllers/product.controller';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Public Product Catalog Routes
router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);

// Protected Admin Product Management Routes
router.post('/', authenticate, authorize('admin'), createProduct);
router.put('/:id', authenticate, authorize('admin'), updateProduct);
router.delete('/:id', authenticate, authorize('admin'), deleteProduct);

// Product Image Management Routes
router.post('/:id/images', authenticate, authorize('admin'), upload.array('images', 10), uploadProductImages);
router.put('/:id/images', authenticate, authorize('admin'), upload.single('image'), updateProductImage);
router.delete('/:id/images', authenticate, authorize('admin'), deleteProductImage);

// Product Inventory Management Routes
router.patch('/:id/stock', authenticate, authorize('admin'), updateProductStock);

export default router;

