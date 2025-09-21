import { z } from 'zod';

export const userIdSchema = z.object({
  id: z.string().transform(val => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num <= 0) {
      throw new Error('ID must be a positive integer');
    }
    return num;
  }),
});

export const updateUserSchema = z
  .object({
    name: z.string().max(255).trim().nonempty('Name is required').optional(),
    email: z
      .string()
      .max(255)
      .toLowerCase()
      .trim()
      .email('Invalid email address')
      .optional(),
    password: z
      .string()
      .min(6)
      .max(255)
      .nonempty('Password must be at least 6 characters')
      .optional(),
    role: z.enum(['user', 'admin']).optional(),
  })
  .refine(
    data => {
      return Object.keys(data).length > 0;
    },
    {
      message: 'At least one field must be provided for update',
    }
  );
