import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

// Auth stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

// Product stack (nested inside Products tab)
export type ProductStackParamList = {
  ProductList: { categoryId?: string; categoryName?: string } | undefined;
  ProductDetail: { productId: string };
};

export type ProductStackScreenProps<T extends keyof ProductStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ProductStackParamList, T>,
  BottomTabScreenProps<TabParamList>
>;

// Home stack (nested inside Home tab)
export type HomeStackParamList = {
  HomeMain: undefined;
  HomeProductDetail: { productId: string };
};

export type HomeStackScreenProps<T extends keyof HomeStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, T>,
  BottomTabScreenProps<TabParamList>
>;

// Cart stack (nested inside Cart tab)
export type CartStackParamList = {
  CartMain: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderNumber: string; orderId: string };
};

export type CartStackScreenProps<T extends keyof CartStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<CartStackParamList, T>,
  BottomTabScreenProps<TabParamList>
>;

// Profile stack (nested inside Profile tab)
export type ProfileStackParamList = {
  ProfileMain: undefined;
  ProfileEdit: undefined;
  Settings: undefined;
  OrderHistory: undefined;
};

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, T>,
  BottomTabScreenProps<TabParamList>
>;

// Main tab
export type TabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Products: NavigatorScreenParams<ProductStackParamList>;
  Cart: NavigatorScreenParams<CartStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type TabScreenProps<T extends keyof TabParamList> = BottomTabScreenProps<TabParamList, T>;
