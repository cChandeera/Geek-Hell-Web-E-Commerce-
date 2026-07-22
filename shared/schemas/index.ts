import { z } from 'zod';

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const userRegisterSchema = userLoginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const decalTransformSchema = z.object({
  position: z.object({ x: z.number(), y: z.number(), z: z.number() }),
  scale: z.object({ x: z.number(), y: z.number() }),
  rotation: z.number(),
  decalImageUrl: z.string().url('Invalid decal image URL'),
  printSide: z.enum(['front', 'back', 'left_sleeve', 'right_sleeve']),
});
