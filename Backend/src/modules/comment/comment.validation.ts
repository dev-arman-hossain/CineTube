import { z } from 'zod';

const createCommentValidationSchema = z.object({
  body: z.object({
    reviewId: z.string().min(1, { message: 'Review ID is required' }),
    content: z.string().min(1, { message: 'Comment content is required' }),
    parentId: z.string().optional(),
  }),
});

export const CommentValidation = {
  createCommentValidationSchema,
};
