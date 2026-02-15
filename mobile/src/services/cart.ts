import { api } from './api';
import type { ApiResponse } from '../types/api';
import type { CartResponse, AddCartItemRequest } from '../types/order';

export const cartService = {
  async getCart(): Promise<CartResponse> {
    const { data } = await api.get<ApiResponse<CartResponse>>('/cart');
    return data.data;
  },

  async addItem(body: AddCartItemRequest): Promise<CartResponse> {
    const { data } = await api.post<ApiResponse<CartResponse>>('/cart/items', body);
    return data.data;
  },

  async updateItemQuantity(itemId: string, quantity: number): Promise<CartResponse> {
    const { data } = await api.patch<ApiResponse<CartResponse>>(`/cart/items/${itemId}`, { quantity });
    return data.data;
  },

  async removeItem(itemId: string): Promise<CartResponse> {
    const { data } = await api.delete<ApiResponse<CartResponse>>(`/cart/items/${itemId}`);
    return data.data;
  },
};
