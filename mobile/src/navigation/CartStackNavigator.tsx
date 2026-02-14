import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartScreen } from '../screens/Cart/CartScreen';
import { CheckoutScreen } from '../screens/Cart/CheckoutScreen';
import { OrderConfirmationScreen } from '../screens/Cart/OrderConfirmationScreen';
import { useThemeColors } from '../hooks/useThemeColors';
import type { CartStackParamList } from './types';

const Stack = createNativeStackNavigator<CartStackParamList>();

export function CartStackNavigator() {
  const colors = useThemeColors();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="CartMain" component={CartScreen} options={{ title: 'Sepet' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Siparis' }} />
      <Stack.Screen
        name="OrderConfirmation"
        component={OrderConfirmationScreen}
        options={{ title: 'Siparis Onay', headerBackVisible: false }}
      />
    </Stack.Navigator>
  );
}
