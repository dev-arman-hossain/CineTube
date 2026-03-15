import apiClient from './apiClient';

export const ReviewService = {
  createReview: async (data: any) => {
    const response = await apiClient.post('/reviews', data);
    return response.data;
  },

  toggleLike: async (id: string) => {
    const response = await apiClient.post(`/reviews/${id}/like`);
    return response.data;
  },

  getAllReviews: async (params?: any) => {
    const response = await apiClient.get('/reviews', { params });
    return response.data;
  },
};
