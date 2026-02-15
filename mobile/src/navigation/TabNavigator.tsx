import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeStackNavigator } from './HomeStackNavigator';
import { ProductStackNavigator } from './ProductStackNavigator';
import { CartStackNavigator } from './CartStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { useThemeColors } from '../hooks/useThemeColors';
import { useCartStore } from '../store/cartStore';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<keyof TabParamList, { focused: string; unfocused: string }> = {
  Home: { focused: 'home', unfocused: 'home-outline' },
  Products: { focused: 'grid', unfocused: 'grid-outline' },
  Cart: { focused: 'cart', unfocused: 'cart-outline' },
  Profile: { focused: 'person', unfocused: 'person-outline' },
};

export function TabNavigator() {
  const colors = useThemeColors();
  const totalItems = useCartStore((s) => s.totalItems);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.unfocused;
          return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.tabBarBorder,
        },
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{ title: 'Ana Sayfa', headerShown: false }}
      />
      <Tab.Screen
        name="Products"
        component={ProductStackNavigator}
        options={{ title: 'Urunler', headerShown: false }}
      />
      <Tab.Screen
        name="Cart"
        component={CartStackNavigator}
        options={{
          title: 'Sepet',
          headerShown: false,
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{ title: 'Profil', headerShown: false }}
      />
    </Tab.Navigator>
  );
}
