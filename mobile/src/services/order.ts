import { api } from './api';
import type { ApiResponse } from '../types/api';
import type { Order, CreateOrderRequest } from '../types/order';

export const orderService = {
  async createOrder(body: CreateOrderRequest): Promise<Order> {
    const { data } = await api.post<ApiResponse<Order>>('/orders', body);
    return data.data;
  },

  async getOrders(page = 1, limit = 20): Promise<{ orders: Order[]; pagination: any }> {
    const { data } = await api.get<ApiResponse<Order[]>>('/orders', {
      params: { page, limit },
    });
    return {
      orders: data.data,
      pagination: data.meta?.pagination,
    };
  },

  async getOrderById(id: string): Promise<Order> {
    const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return data.data;
  },
};
