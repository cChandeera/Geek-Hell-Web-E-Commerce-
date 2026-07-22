import { axiosInstance } from '../api/axiosInstance';

export const authService = {
  login: async (credentials: Record<string, string>) => {
    return axiosInstance.post('/auth/login', credentials);
  },
  register: async (payload: Record<string, string>) => {
    return axiosInstance.post('/auth/register', payload);
  },
  logout: async () => {
    return axiosInstance.post('/auth/logout');
  },
};
