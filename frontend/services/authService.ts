import apiClient from './apiClient';
import { AuthResponse } from '../types';

export const AuthService = {
  register: async (data: any): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data.data;
  },

  login: async (data: any): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data.data;
  },

  updateProfile: async (data: any): Promise<any> => {
    const response = await apiClient.patch('/auth/profile', data);
    return response.data.data;
  },

  uploadAvatar: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data; // returns updated user object
  },
};

