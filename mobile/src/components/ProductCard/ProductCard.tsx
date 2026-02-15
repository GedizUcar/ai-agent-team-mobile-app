import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../hooks/useThemeColors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  onPress: (product: Product) => void;
  testID?: string;
}

function ProductCardComponent({ product, onPress, testID }: ProductCardProps) {
  const colors = useThemeColors();
  const firstImage = product.images?.[0];
  const hasDiscount = product.comparePrice != null && product.comparePrice > product.price;

  const formatPrice = (price: number | string): string => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return `${num.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} \u20BA`;
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }]}
      onPress={() => onPress(product)}
      activeOpacity={0.7}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatPrice(product.price)}`}
    >
      <View style={[styles.imageContainer, { backgroundColor: colors.surfaceVariant }]}>
        {firstImage ? (
          <Image
            source={{ uri: firstImage.url }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={firstImage.altText ?? product.name}
          />
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="image-outline" size={32} color={colors.textTertiary} />
          </View>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text
          style={[typography.caption, { color: colors.textSecondary }]}
          numberOfLines={1}
        >
          {product.category?.name}
        </Text>

        <Text
          style={[typography.subtitle2, { color: colors.text, marginTop: 2 }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {product.name}
        </Text>

        <View style={styles.priceContainer}>
          {hasDiscount ? (
            <>
              <Text style={[typography.subtitle1, { color: colors.error }]}>
                {formatPrice(product.price)}
              </Text>
              <Text
                style={[
                  typography.caption,
                  styles.comparePrice,
                  { color: colors.textTertiary },
                ]}
              >
                {formatPrice(product.comparePrice!)}
              </Text>
            </>
          ) : (
            <Text style={[typography.subtitle1, { color: colors.text }]}>
              {formatPrice(product.price)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    flex: 1,
    margin: spacing.xs,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: spacing.sm,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  comparePrice: {
    textDecorationLine: 'line-through',
  },
});

export const ProductCard = memo(ProductCardComponent);
