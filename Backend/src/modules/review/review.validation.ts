import { z } from 'zod';

const createReviewValidationSchema = z.object({
  body: z.object({
    mediaId: z.string().min(1, { message: 'Media ID is required' }),
    rating: z.number().min(1).max(10),
    content: z.string().min(10, { message: 'Review must be at least 10 characters' }),
    tags: z.array(z.string()).optional(),
    hasSpoiler: z.boolean().default(false),
  }),
});

const updateReviewValidationSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(10).optional(),
    content: z.string().min(10).optional(),
    tags: z.array(z.string()).optional(),
    hasSpoiler: z.boolean().optional(),
  }),
});

export const ReviewValidation = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
};
