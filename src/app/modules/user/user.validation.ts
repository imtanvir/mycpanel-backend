import { z } from 'zod';

const roleEnum = z.enum(['user', 'admin']);

const userProfileValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string(),
    address: z.string(),
    role: roleEnum,
    password: z.string().min(6, 'Password must be at least 6 characters'),
    followers: z.array(z.string()).default([]),
    following: z.array(z.string()).default([]),
  }),
});
const profileUpdateValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

const userRoleUpdateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    role: roleEnum.optional(),
  }),
});

export const userValidation = {
  userRoleUpdateSchema,
  userProfileValidation,
  profileUpdateValidation,
};
