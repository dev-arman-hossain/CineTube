import apiClient from './apiClient';

export const AdminAppService = {
  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  updateUserRole: async (userId: string, role: string) => {
    const response = await apiClient.patch(`/admin/users/${userId}/role`, { role });
    return response.data;
  },
};
