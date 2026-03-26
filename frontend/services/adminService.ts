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

  suspendUser: async (userId: string, isSuspended: boolean) => {
    const response = await apiClient.patch(`/admin/users/${userId}/suspend`, { isSuspended });
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await apiClient.delete(`/admin/users/${userId}`);
    return response.data;
  },

  clearCache: async () => {
    const response = await apiClient.post('/admin/clear-cache');
    return response.data;
  },
};
