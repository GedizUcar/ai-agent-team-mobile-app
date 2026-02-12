import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { typography } from '../../theme';

function ProductsScreenComponent() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} testID="products-screen">
      <Text style={[typography.h3, { color: colors.text }]}>Products</Text>
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

export const ProductsScreen = memo(ProductsScreenComponent);
