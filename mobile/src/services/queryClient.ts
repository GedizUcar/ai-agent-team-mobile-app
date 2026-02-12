import { QueryClient } from '@tanstack/react-query';
import { API_CONFIG } from '../config/api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: API_CONFIG.STALE_TIME,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
