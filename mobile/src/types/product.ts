export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl: string | null;
  sortOrder: number;
  parentId?: string;
  productCount?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  colorHex: string | null;
  stock: number;
  sku: string | null;
  price?: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  isFeatured: boolean;
  category: { name: string };
  images: ProductImage[];
}

export interface ProductDetail extends Product {
  categoryId: string;
  variants: ProductVariant[];
  category: Category;
}

export interface HomeData {
  featuredProducts: Product[];
  newArrivals: Product[];
  categories: Category[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  sortBy?: string;
}

export interface ProductListResponse {
  products: Product[];
  pagination: Pagination;
}
