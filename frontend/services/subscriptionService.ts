import apiClient from './apiClient';

export const SubscriptionService = {
  createCheckoutSession: async (priceId: string, type: 'subscription' | 'one-time') => {
    const response = await apiClient.post('/payment/create-checkout-session', {
      priceId,
      type,
    });
    return response.data;
  },
};
