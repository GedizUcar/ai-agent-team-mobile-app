import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductsScreen } from '../screens/Products/ProductsScreen';
import { ProductDetailScreen } from '../screens/Products/ProductDetailScreen';
import { useThemeColors } from '../hooks/useThemeColors';
import type { ProductStackParamList } from './types';

const Stack = createNativeStackNavigator<ProductStackParamList>();

export function ProductStackNavigator() {
  const colors = useThemeColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="ProductList"
        component={ProductsScreen}
        options={{ title: 'Urunler' }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ title: '' }}
      />
    </Stack.Navigator>
  );
}
