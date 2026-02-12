export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:3000/api/v1' : 'https://api.stilora.com/api/v1',
  TIMEOUT: 15000,
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
} as const;
