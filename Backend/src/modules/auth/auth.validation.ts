import { z } from 'zod';

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Email must be a valid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Email must be a valid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
  }),
});

const forgotPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Email must be a valid email address' }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    token: z.string().min(1, { message: 'Token is required' }),
    newPassword: z.string().min(6, { message: 'New password must be at least 6 characters' }),
  }),
});

const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    avatar: z.string().optional(),
  }),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
  forgotPasswordValidationSchema,
  resetPasswordValidationSchema,
  updateProfileValidationSchema,
};
