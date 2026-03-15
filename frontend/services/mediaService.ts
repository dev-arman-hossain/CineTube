import apiClient from './apiClient';
import { Media } from '../types';

export const MediaService = {
  getMedia: async (params?: any) => {
    const response = await apiClient.get('/media', { params });
    return response.data;
  },

  getFeaturedMedia: async () => {
    const response = await apiClient.get('/media/featured');
    return response.data;
  },

  getMediaById: async (id: string) => {
    const response = await apiClient.get(`/media/${id}`);
    return response.data;
  },

  updateMedia: async (id: string, data: Partial<Media>) => {
    const response = await apiClient.patch(`/media/${id}`, data);
    return response.data;
  },

  deleteMedia: async (id: string) => {
    const response = await apiClient.delete(`/media/${id}`);
    return response.data;
  },
};
