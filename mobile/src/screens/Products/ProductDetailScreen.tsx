import React, { memo, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../hooks/useThemeColors';
import { typography, spacing, borderRadius, TOUCH_TARGET_MIN } from '../../theme';
import { productService } from '../../services/product';
import { cartService } from '../../services/cart';
import { Button } from '../../components/Button';
import { useCartStore } from '../../store/cartStore';
import type { ProductImage, ProductVariant } from '../../types/product';
import type { ProductStackScreenProps } from '../../navigation/types';

const SCREEN_WIDTH = Dimensions.get('window').width;

type Props = ProductStackScreenProps<'ProductDetail'> | { route: { params: { productId: string } }; navigation: any };

function ProductDetailScreenComponent({ route, navigation }: any) {
  const colors = useThemeColors();
  const addItem = useCartStore((s) => s.addItem);
  const productId: string = route.params.productId;

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const flatListRef = useRef<FlatList<ProductImage>>(null);

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getProductById(productId),
  });

  const formatPrice = (price: number | string): string => {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    return `${num.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} \u20BA`;
  };

  // Extract unique sizes and colors from variants
  const uniqueSizes = product
    ? [...new Set(product.variants.map((v) => v.size).filter(Boolean))]
    : [];
  const uniqueColors = product
    ? product.variants.reduce<Array<{ color: string; colorHex: string | null }>>(
        (acc, v) => {
          if (v.color && !acc.find((c) => c.color === v.color)) {
            acc.push({ color: v.color, colorHex: v.colorHex });
          }
          return acc;
        },
        [],
      )
    : [];

  // Find matching variant for selected size/color
  const selectedVariant = product?.variants.find(
    (v) =>
      (selectedSize ? v.size === selectedSize : true) &&
      (selectedColor ? v.color === selectedColor : true),
  );

  const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;
  const canAddToCart =
    product != null &&
    (uniqueSizes.length === 0 || selectedSize != null) &&
    (uniqueColors.length === 0 || selectedColor != null) &&
    !isOutOfStock;

  const getVariantStockForSize = (size: string): number => {
    if (!product) return 0;
    const variants = product.variants.filter(
      (v) => v.size === size && (selectedColor ? v.color === selectedColor : true),
    );
    return variants.reduce((sum, v) => sum + v.stock, 0);
  };

  const handleAddToCart = useCallback(async () => {
    if (!product || !canAddToCart || !selectedVariant) return;

    // Update local store
    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      name: product.name,
      price: parseFloat(String(selectedVariant?.price ?? product.price)),
      quantity: 1,
      imageUrl: product.images[0]?.url,
      size: selectedSize ?? undefined,
      color: selectedColor ?? undefined,
    });

    // Sync with backend cart
    try {
      await cartService.addItem({
        productId: product.id,
        variantId: selectedVariant.id,
        quantity: 1,
      });
    } catch {
      // Local cart is already updated, backend sync failed silently
    }

    Alert.alert('Basarili', `${product.name} sepete eklendi.`, [{ text: 'Tamam' }]);
  }, [product, canAddToCart, selectedVariant, selectedSize, selectedColor, addItem]);

  const onImageScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { x: number }; layoutMeasurement: { width: number } } }) => {
      const index = Math.round(
        event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width,
      );
      setActiveImageIndex(index);
    },
    [],
  );

  const renderImage = useCallback(
    ({ item }: { item: ProductImage }) => (
      <View style={[styles.imageSlide, { backgroundColor: colors.surfaceVariant }]}>
        <Image
          source={{ uri: item.url }}
          style={styles.productImage}
          resizeMode="cover"
          accessibilityLabel={item.altText ?? product?.name ?? 'Urun gorseli'}
        />
      </View>
    ),
    [colors.surfaceVariant, product?.name],
  );

  if (isLoading) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
        testID="product-detail-loading"
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
        testID="product-detail-error"
      >
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={[typography.body1, { color: colors.textSecondary, marginTop: spacing.md }]}>
          Urun yuklenirken bir hata olustu
        </Text>
        <Button
          title="Tekrar Dene"
          onPress={() => refetch()}
          variant="outline"
          style={{ marginTop: spacing.md }}
          testID="product-detail-retry"
        />
      </View>
    );
  }

  const hasDiscount =
    product.comparePrice != null && product.comparePrice > product.price;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} testID="product-detail-screen">
      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        {/* Image Gallery */}
        {product.images.length > 0 ? (
          <View>
            <FlatList
              ref={flatListRef}
              data={product.images}
              renderItem={renderImage}
              keyExtractor={(item) => item.id}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onImageScroll}
              decelerationRate="fast"
              snapToInterval={SCREEN_WIDTH}
            />
            {product.images.length > 1 && (
              <View style={styles.pagination}>
                {product.images.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      {
                        backgroundColor:
                          index === activeImageIndex ? colors.primary : colors.textTertiary,
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: colors.surfaceVariant }]}>
            <Ionicons name="image-outline" size={64} color={colors.textTertiary} />
          </View>
        )}

        {/* Product Info */}
        <View style={styles.infoSection}>
          <Text style={[typography.caption, { color: colors.textSecondary }]}>
            {product.category?.name}
          </Text>

          <Text style={[typography.h2, { color: colors.text, marginTop: spacing.xs }]}>
            {product.name}
          </Text>

          {/* Price */}
          <View style={styles.priceRow}>
            {hasDiscount ? (
              <>
                <Text style={[typography.h3, { color: colors.error }]}>
                  {formatPrice(product.price)}
                </Text>
                <Text
                  style={[
                    typography.body1,
                    styles.comparePrice,
                    { color: colors.textTertiary, marginLeft: spacing.sm },
                  ]}
                >
                  {formatPrice(product.comparePrice!)}
                </Text>
              </>
            ) : (
              <Text style={[typography.h3, { color: colors.text }]}>
                {formatPrice(product.price)}
              </Text>
            )}
          </View>

          {/* Stock Status */}
          {selectedVariant && (
            <View style={styles.stockRow}>
              <Ionicons
                name={selectedVariant.stock > 0 ? 'checkmark-circle' : 'close-circle'}
                size={16}
                color={selectedVariant.stock > 0 ? colors.success : colors.error}
              />
              <Text
                style={[
                  typography.caption,
                  {
                    color: selectedVariant.stock > 0 ? colors.success : colors.error,
                    marginLeft: spacing.xs,
                  },
                ]}
              >
                {selectedVariant.stock > 0
                  ? `Stokta (${selectedVariant.stock} adet)`
                  : 'Stokta yok'}
              </Text>
            </View>
          )}

          {/* Size Selector */}
          {uniqueSizes.length > 0 && (
            <View style={styles.optionSection}>
              <Text style={[typography.subtitle1, { color: colors.text }]}>Beden</Text>
              <View style={styles.optionRow}>
                {uniqueSizes.map((size) => {
                  const stock = getVariantStockForSize(size);
                  const isSelected = selectedSize === size;
                  const isDisabled = stock <= 0;

                  return (
                    <TouchableOpacity
                      key={size}
                      style={[
                        styles.sizeChip,
                        {
                          borderColor: isSelected ? colors.primary : colors.border,
                          backgroundColor: isSelected ? colors.primaryContainer : colors.surface,
                          opacity: isDisabled ? 0.4 : 1,
                        },
                      ]}
                      onPress={() => !isDisabled && setSelectedSize(isSelected ? null : size)}
                      disabled={isDisabled}
                      accessibilityRole="button"
                      accessibilityLabel={`Beden ${size}${isDisabled ? ', stokta yok' : ''}`}
                      accessibilityState={{ selected: isSelected, disabled: isDisabled }}
                    >
                      <Text
                        style={[
                          typography.subtitle2,
                          { color: isSelected ? colors.primary : colors.text },
                        ]}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Color Selector */}
          {uniqueColors.length > 0 && (
            <View style={styles.optionSection}>
              <Text style={[typography.subtitle1, { color: colors.text }]}>Renk</Text>
              <View style={styles.optionRow}>
                {uniqueColors.map((colorItem) => {
                  const isSelected = selectedColor === colorItem.color;

                  return (
                    <TouchableOpacity
                      key={colorItem.color}
                      style={[
                        styles.colorCircleOuter,
                        {
                          borderColor: isSelected ? colors.primary : 'transparent',
                        },
                      ]}
                      onPress={() => setSelectedColor(isSelected ? null : colorItem.color)}
                      accessibilityRole="button"
                      accessibilityLabel={`Renk: ${colorItem.color}`}
                      accessibilityState={{ selected: isSelected }}
                    >
                      <View
                        style={[
                          styles.colorCircleInner,
                          {
                            backgroundColor: colorItem.colorHex ?? colors.textTertiary,
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
              {selectedColor && (
                <Text style={[typography.caption, { color: colors.textSecondary, marginTop: spacing.xs }]}>
                  {selectedColor}
                </Text>
              )}
            </View>
          )}

          {/* Description */}
          {product.description && (
            <View style={styles.optionSection}>
              <Text style={[typography.subtitle1, { color: colors.text }]}>Aciklama</Text>
              <Text
                style={[
                  typography.body2,
                  { color: colors.textSecondary, marginTop: spacing.xs },
                ]}
              >
                {product.description}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom spacer for the fixed button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Add to Cart Button */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        ]}
      >
        <Button
          title="Sepete Ekle"
          onPress={handleAddToCart}
          disabled={!canAddToCart}
          testID="add-to-cart-button"
          style={styles.addToCartButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  imageSlide: {
    width: SCREEN_WIDTH,
    aspectRatio: 3 / 4,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: SCREEN_WIDTH,
    aspectRatio: 3 / 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  infoSection: {
    padding: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  comparePrice: {
    textDecorationLine: 'line-through',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  optionSection: {
    marginTop: spacing.lg,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  sizeChip: {
    minWidth: TOUCH_TARGET_MIN,
    minHeight: TOUCH_TARGET_MIN,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircleOuter: {
    width: TOUCH_TARGET_MIN,
    height: TOUCH_TARGET_MIN,
    borderRadius: TOUCH_TARGET_MIN / 2,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorCircleInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
  },
  addToCartButton: {
    width: '100%',
  },
});

export const ProductDetailScreen = memo(ProductDetailScreenComponent);
