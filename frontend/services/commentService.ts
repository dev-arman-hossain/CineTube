import apiClient from './apiClient';

export const CommentService = {
  createComment: async (data: { reviewId: string; content: string; parentId?: string }) => {
    const response = await apiClient.post('/comments', data);
    return response.data;
  },

  getCommentsByReviewId: async (reviewId: string) => {
    const response = await apiClient.get(`/comments/review/${reviewId}`);
    return response.data;
  },

  deleteComment: async (id: string) => {
    const response = await apiClient.delete(`/comments/${id}`);
    return response.data;
  },
};
