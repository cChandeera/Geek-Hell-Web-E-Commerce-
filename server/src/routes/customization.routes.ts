import { Router } from 'express';
import { createCustomization, getCustomizationById } from '../controllers/customization.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.post('/', protect, createCustomization);
router.get('/:id', getCustomizationById);

export default router;
