import { z } from 'zod';

const createMediaValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    synopsis: z.string().min(1, { message: 'Synopsis is required' }),
    genre: z.array(z.string()).min(1, { message: 'At least one genre is required' }),
    releaseYear: z.number().int().min(1800),
    director: z.string().min(1, { message: 'Director is required' }),
    cast: z.array(z.string()),
    platform: z.array(z.string()),
    posterUrl: z.string().url().optional().or(z.literal('')),
    backdropUrl: z.string().url().optional().or(z.literal('')),
    streamingLink: z.string().url().optional().or(z.literal('')),
    type: z.enum(['MOVIE', 'SERIES']),
    contentType: z.enum(['FREE', 'PREMIUM']).default('FREE'),
  }),
});

const updateMediaValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    synopsis: z.string().optional(),
    genre: z.array(z.string()).optional(),
    releaseYear: z.number().optional(),
    director: z.string().optional(),
    cast: z.array(z.string()).optional(),
    platform: z.array(z.string()).optional(),
    posterUrl: z.string().url().optional().or(z.literal('')),
    backdropUrl: z.string().url().optional().or(z.literal('')),
    streamingLink: z.string().url().optional().or(z.literal('')),
    type: z.enum(['MOVIE', 'SERIES']).optional(),
    contentType: z.enum(['FREE', 'PREMIUM']).optional(),
  }),
});

export const MediaValidation = {
  createMediaValidationSchema,
  updateMediaValidationSchema,
};
