import { AxiosError } from 'axios';

interface ApiErrorResponse {
  error?: {
    message?: string;
  };
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError && error.response?.data) {
    const data = error.response.data as ApiErrorResponse;
    if (data.error?.message) {
      return data.error.message;
    }
  }
  return fallback;
}
