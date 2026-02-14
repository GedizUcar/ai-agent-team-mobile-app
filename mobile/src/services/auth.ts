import * as SecureStore from 'expo-secure-store';
import { api } from './api';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import type { User, AuthTokens, LoginRequest, RegisterRequest, UpdateProfileRequest } from '../types/user';
import type { ApiResponse } from '../types/api';

interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

async function saveTokens(tokens: AuthTokens): Promise<void> {
  await SecureStore.setItemAsync('accessToken', tokens.accessToken);
  await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
}

async function clearTokens(): Promise<void> {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
}

function extractData<T>(response: ApiResponse<T>): T {
  if (!response.data) {
    throw new Error('Unexpected empty response from server');
  }
  return response.data;
}

export const authService = {
  async register(input: RegisterRequest): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', input);
    const result = extractData(data);
    await saveTokens(result.tokens);
    useAuthStore.getState().setUser(result.user);
    return result;
  },

  async login(input: LoginRequest): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', input);
    const result = extractData(data);
    await saveTokens(result.tokens);
    useAuthStore.getState().setUser(result.user);
    return result;
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } finally {
      await clearTokens();
      useAuthStore.getState().logout();
      useCartStore.getState().clearCart();
    }
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password });
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>('/auth/me');
    return extractData(data);
  },

  async updateProfile(input: UpdateProfileRequest): Promise<User> {
    const { data } = await api.put<ApiResponse<User>>('/auth/profile', input);
    const user = extractData(data);
    useAuthStore.getState().setUser(user);
    return user;
  },
};
