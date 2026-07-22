import { AxiosError } from 'axios';

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
}

export const handleApiError = (error: unknown): ApiErrorResponse => {
  if (error instanceof AxiosError && error.response?.data) {
    return {
      message: error.response.data.message || 'An unexpected error occurred',
      statusCode: error.response.status,
    };
  }
  return {
    message: error instanceof Error ? error.message : 'Unknown network failure',
  };
};
