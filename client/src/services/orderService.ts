import { axiosInstance } from '../api/axiosInstance';

export const orderService = {
  createCheckoutSession: async (cartItems: unknown[]) => {
    return axiosInstance.post('/orders/create-checkout-session', { cartItems });
  },
  getMyOrders: async () => {
    return axiosInstance.get('/orders/my-orders');
  },
};
