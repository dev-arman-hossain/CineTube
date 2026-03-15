import apiClient from './apiClient';

export const WatchlistService = {
  toggleWatchlist: async (mediaId: string) => {
    const response = await apiClient.post('/watchlist/toggle', { mediaId });
    return response.data;
  },

  getMyWatchlist: async () => {
    const response = await apiClient.get('/watchlist');
    return response.data;
  },
};
