import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { typography, spacing } from '../../theme';

function HomeScreenComponent() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} testID="home-screen">
      <Text style={[typography.h2, { color: colors.text }]}>Stilora</Text>
      <Text style={[typography.body1, { color: colors.textSecondary, marginTop: spacing.sm }]}>
        Welcome to Stilora
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const HomeScreen = memo(HomeScreenComponent);
