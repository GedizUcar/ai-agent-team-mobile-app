import './global.css';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/services/queryClient';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useIsDarkMode } from './src/hooks/useThemeColors';
import { lightColors, darkColors } from './src/theme/colors';

const LightNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: lightColors.primary,
    background: lightColors.background,
    card: lightColors.surface,
    text: lightColors.text,
    border: lightColors.border,
    notification: lightColors.error,
  },
};

const DarkNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: darkColors.primary,
    background: darkColors.background,
    card: darkColors.surface,
    text: darkColors.text,
    border: darkColors.border,
    notification: darkColors.error,
  },
};

export default function App() {
  const isDark = useIsDarkMode();

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer theme={isDark ? DarkNavigationTheme : LightNavigationTheme}>
        <RootNavigator />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </NavigationContainer>
    </QueryClientProvider>
  );
}
