export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  imageUrl: string | null;
  size: string;
  color: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
  notes?: string;
  items: OrderItem[];
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CreateOrderRequest {
  shippingAddress: ShippingAddress;
  notes?: string;
  items?: Array<{
    productId: string;
    variantId: string;
    quantity: number;
  }>;
}

export interface CartItemResponse {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    comparePrice: number | null;
    imageUrl: string | null;
    isAvailable: boolean;
  };
  variant: {
    size: string;
    color: string;
    colorHex: string | null;
    stock: number;
    isAvailable: boolean;
  };
  unitPrice: number;
  total: number;
}

export interface CartResponse {
  items: CartItemResponse[];
  subtotal: number;
  itemCount: number;
}

export interface AddCartItemRequest {
  productId: string;
  variantId: string;
  quantity: number;
}
