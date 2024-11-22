import { Types } from 'mongoose';
import { z } from 'zod';

export const postCheck = z.object({
  body: z.object({
    user: z.string().refine((value) => Types.ObjectId.isValid(value), {
      message: 'Invalid user ObjectId',
    }),
    id: z.string().refine((value) => Types.ObjectId.isValid(value), {
      message: 'Invalid id ObjectId',
    }),
    premium: z.boolean().optional().default(false),
    category: z.enum(['tip', 'story']).optional().default('story'),
    post: z.string().min(1, 'Post content is required').trim(),
    comments: z
      .array(
        z.object({
          author: z.string().refine((value) => Types.ObjectId.isValid(value), {
            message: 'Invalid author ObjectId',
          }),
          comment: z.string().min(1, 'Comment is required'),
        }),
      )
      .optional()
      .default([]),
  }),
});

export const postValidation = {
  postCheck,
};
