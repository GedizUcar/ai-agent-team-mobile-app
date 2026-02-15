import { api } from './api';
import type { ApiResponse } from '../types/api';
import type {
  HomeData,
  Product,
  ProductDetail,
  ProductListParams,
  ProductListResponse,
  Category,
} from '../types/product';

export const productService = {
  async getHomeData(): Promise<HomeData> {
    const { data } = await api.get<ApiResponse<HomeData>>('/home');
    return data.data;
  },

  async getProducts(params: ProductListParams = {}): Promise<ProductListResponse> {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null),
    );
    const { data } = await api.get<
      ApiResponse<Product[]> & { meta?: { pagination?: ProductListResponse['pagination'] } }
    >('/products', { params: cleanParams });

    return {
      products: data.data,
      pagination: data.meta?.pagination ?? {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        total: data.data.length,
        totalPages: 1,
      },
    };
  },

  async getProductById(id: string): Promise<ProductDetail> {
    const { data } = await api.get<ApiResponse<ProductDetail>>(`/products/${id}`);
    return data.data;
  },

  async getCategories(): Promise<Category[]> {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories');
    return data.data;
  },
};
