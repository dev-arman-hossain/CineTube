import apiClient from './apiClient';
import { Media } from '../types';

export const MediaService = {
  createMedia: async (data: any) => {
    const response = await apiClient.post('/media', data);
    return response.data;
  },

  uploadMedia: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    if (!response.data?.data?.url) {
      console.error('Upload response:', response.data);
      throw new Error('No URL returned from upload');
    }
    
    return response.data.data.url;
  },

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
    const response = await apiClient.put(`/media/${id}`, data);
    return response.data;
  },

  deleteMedia: async (id: string) => {
    const response = await apiClient.delete(`/media/${id}`);
    return response.data;
  },

  searchTmdb: async (title: string, year?: number) => {
    const params: any = { title };
    if (year) params.year = year;
    const response = await apiClient.get('/media/tmdb-search', { params });
    return response.data;
  },
};

