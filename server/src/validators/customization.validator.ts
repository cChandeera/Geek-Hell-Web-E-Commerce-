import { z } from 'zod';

export const createCustomizationSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  shirtColor: z.string().min(1, 'Shirt color is required'),
  designImage: z.string().min(1, 'Design image is required'),
  position: z
    .object({
      x: z.number().default(0),
      y: z.number().default(0),
      z: z.number().default(0.15),
    })
    .default({ x: 0, y: 0, z: 0.15 }),
  scale: z
    .object({
      x: z.number().default(0.5),
      y: z.number().default(0.5),
    })
    .default({ x: 0.5, y: 0.5 }),
  rotation: z.number().default(0),
});

export type CreateCustomizationInput = z.infer<typeof createCustomizationSchema>;
