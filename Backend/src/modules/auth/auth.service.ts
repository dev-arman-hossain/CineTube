import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import crypto from 'crypto';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { JwtUtils } from '../../utils/jwt';
import { sendEmail } from '../../utils/sendEmail';
import config from '../../config';

const register = async (payload: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, 'User already exists');
  }

  const { confirmPassword, ...userData } = payload;
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const newUser = await prisma.user.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      createdAt: true,
    },
  });

  const token = JwtUtils.generateToken({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  return { user: newUser, token };
};

const login = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  const token = JwtUtils.generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const { password, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

const getMe = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

// Forgot Password logic as per guide but adapting to Prisma (adding fields if needed)
// Note: Guide asks to add fields to User model. Let's assume we can add them or fix the schema later.
// For now, I'll implement the logic assuming fields exist or I will add them to schema.

const updateProfile = async (email: string, payload: any) => {
  const result = await prisma.user.update({
    where: { email },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatar: true,
      createdAt: true,
    },
  });
  return result;
};

export const AuthService = {
  register,
  login,
  getMe,
  updateProfile,
};
