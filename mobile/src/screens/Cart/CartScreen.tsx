import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../hooks/useThemeColors';
import { typography, spacing, borderRadius, TOUCH_TARGET_MIN } from '../../theme';
import { Button } from '../../components/Button';
import { useCartStore, CartItem } from '../../store/cartStore';
import type { CartStackScreenProps } from '../../navigation/types';

const SHIPPING_COST = 29.99;
const FREE_SHIPPING_THRESHOLD = 500;

function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return `${num.toFixed(2).replace('.', ',')} \u20BA`;
}

interface CartItemRowProps {
  item: CartItem;
  onIncrease: (item: CartItem) => void;
  onDecrease: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
}

const CartItemRow = memo(function CartItemRow({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemRowProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[styles.itemContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}
      testID={`cart-item-${item.productId}`}
    >
      {/* Product Image */}
      <View style={[styles.imageContainer, { backgroundColor: colors.surfaceVariant }]}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.itemImage} resizeMode="cover" />
        ) : (
          <Ionicons name="image-outline" size={32} color={colors.textTertiary} />
        )}
      </View>

      {/* Product Info */}
      <View style={styles.itemInfo}>
        <Text style={[typography.subtitle2, { color: colors.text }]} numberOfLines={2}>
          {item.name}
        </Text>

        {(item.size || item.color) && (
          <Text style={[typography.caption, { color: colors.textSecondary, marginTop: spacing.xs }]}>
            {[item.size && `Beden: ${item.size}`, item.color && `Renk: ${item.color}`]
              .filter(Boolean)
              .join(' | ')}
          </Text>
        )}

        <Text style={[typography.subtitle1, { color: colors.primary, marginTop: spacing.xs }]}>
          {formatPrice(item.price)}
        </Text>

        {/* Quantity Controls */}
        <View style={styles.quantityRow}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[styles.quantityButton, { borderColor: colors.border }]}
              onPress={() => onDecrease(item)}
              hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
              accessibilityLabel="Adet azalt"
              accessibilityRole="button"
            >
              <Ionicons name="remove" size={18} color={colors.text} />
            </TouchableOpacity>

            <Text style={[typography.subtitle2, { color: colors.text, minWidth: 28, textAlign: 'center' }]}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={[styles.quantityButton, { borderColor: colors.border }]}
              onPress={() => onIncrease(item)}
              hitSlop={{ top: 6, right: 6, bottom: 6, left: 6 }}
              accessibilityLabel="Adet artir"
              accessibilityRole="button"
            >
              <Ionicons name="add" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => onRemove(item)}
            hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
            accessibilityLabel="Urunu kaldir"
            accessibilityRole="button"
          >
            <Ionicons name="trash-outline" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

function CartScreenComponent({ navigation }: CartStackScreenProps<'CartMain'>) {
  const colors = useThemeColors();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = totalPrice + shippingCost;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);

  const handleIncrease = useCallback(
    (item: CartItem) => {
      updateQuantity(item.productId, item.quantity + 1, item.variantId);
    },
    [updateQuantity],
  );

  const handleDecrease = useCallback(
    (item: CartItem) => {
      if (item.quantity <= 1) {
        Alert.alert('Urunu Kaldir', `${item.name} sepetten kaldirilsin mi?`, [
          { text: 'Iptal', style: 'cancel' },
          {
            text: 'Kaldir',
            style: 'destructive',
            onPress: () => removeItem(item.productId, item.variantId),
          },
        ]);
        return;
      }
      updateQuantity(item.productId, item.quantity - 1, item.variantId);
    },
    [updateQuantity, removeItem],
  );

  const handleRemove = useCallback(
    (item: CartItem) => {
      Alert.alert('Urunu Kaldir', `${item.name} sepetten kaldirilsin mi?`, [
        { text: 'Iptal', style: 'cancel' },
        {
          text: 'Kaldir',
          style: 'destructive',
          onPress: () => removeItem(item.productId, item.variantId),
        },
      ]);
    },
    [removeItem],
  );

  const handleCheckout = useCallback(() => {
    navigation.navigate('Checkout');
  }, [navigation]);

  const handleStartShopping = useCallback(() => {
    navigation.getParent()?.navigate('Products');
  }, [navigation]);

  const renderItem = useCallback(
    ({ item }: { item: CartItem }) => (
      <CartItemRow
        item={item}
        onIncrease={handleIncrease}
        onDecrease={handleDecrease}
        onRemove={handleRemove}
      />
    ),
    [handleIncrease, handleDecrease, handleRemove],
  );

  const keyExtractor = useCallback(
    (item: CartItem) => `${item.productId}-${item.variantId ?? 'default'}`,
    [],
  );

  // Empty state
  if (items.length === 0) {
    return (
      <View
        style={[styles.emptyContainer, { backgroundColor: colors.background }]}
        testID="cart-empty"
      >
        <Ionicons name="cart-outline" size={80} color={colors.textTertiary} />
        <Text style={[typography.h3, { color: colors.text, marginTop: spacing.lg }]}>
          Sepetiniz Bos
        </Text>
        <Text
          style={[
            typography.body2,
            { color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' },
          ]}
        >
          Begendiginiz urunleri sepete ekleyerek alisverise baslayabilirsiniz.
        </Text>
        <Button
          title="Alisverise Basla"
          onPress={handleStartShopping}
          style={{ marginTop: spacing.lg }}
          testID="start-shopping-button"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} testID="cart-screen">
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Order Summary */}
      <View
        style={[styles.summaryContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}
      >
        <View style={styles.summaryRow}>
          <Text style={[typography.body2, { color: colors.textSecondary }]}>Ara Toplam</Text>
          <Text style={[typography.body2, { color: colors.text }]}>{formatPrice(totalPrice)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={[typography.body2, { color: colors.textSecondary }]}>Kargo</Text>
          <Text
            style={[
              typography.body2,
              { color: shippingCost === 0 ? colors.success : colors.text },
            ]}
          >
            {shippingCost === 0 ? 'Ucretsiz' : formatPrice(shippingCost)}
          </Text>
        </View>

        {shippingCost > 0 && remainingForFreeShipping > 0 && (
          <Text style={[typography.caption, { color: colors.info, marginBottom: spacing.sm }]}>
            {formatPrice(remainingForFreeShipping)} daha ekleyin, kargo ucretsiz!
          </Text>
        )}

        <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
          <Text style={[typography.subtitle1, { color: colors.text }]}>Toplam</Text>
          <Text style={[typography.h3, { color: colors.primary }]}>{formatPrice(grandTotal)}</Text>
        </View>

        <Button
          title="Siparisi Tamamla"
          onPress={handleCheckout}
          testID="checkout-button"
          style={{ marginTop: spacing.sm }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  listContent: {
    paddingBottom: spacing.md,
  },
  itemContainer: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  imageContainer: {
    width: 90,
    height: 120,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryContainer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  totalRow: {
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
});

export const CartScreen = memo(CartScreenComponent);
