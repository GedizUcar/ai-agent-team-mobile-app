import React from 'react';
import { useAuthStore } from '../store/authStore';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';

export function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  return <TabNavigator />;
}
