import { axiosInstance } from '../api/axiosInstance';

export const productService = {
  getProducts: async (params?: Record<string, string | number>) => {
    return axiosInstance.get('/products', { params });
  },
  getProductBySlug: async (slug: string) => {
    return axiosInstance.get(`/products/${slug}`);
  },
};
