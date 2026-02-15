import React, { memo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { typography, spacing, borderRadius } from '../../theme';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useCartStore } from '../../store/cartStore';
import { orderService } from '../../services/order';
import type { CartStackScreenProps } from '../../navigation/types';
import type { ShippingAddress } from '../../types/order';

const SHIPPING_COST = 29.99;
const FREE_SHIPPING_THRESHOLD = 500;

function formatPrice(price: number | string): string {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return `${num.toFixed(2).replace('.', ',')} \u20BA`;
}

function CheckoutScreenComponent({ navigation }: CartStackScreenProps<'Checkout'>) {
  const colors = useThemeColors();
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const totalItems = useCartStore((s) => s.totalItems);
  const clearCart = useCartStore((s) => s.clearCart);

  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = totalPrice + shippingCost;

  // Redirect back if cart becomes empty
  useEffect(() => {
    if (items.length === 0) {
      navigation.goBack();
    }
  }, [items.length, navigation]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'TR',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

  const updateField = useCallback((field: keyof ShippingAddress, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};

    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      newErrors.fullName = 'Ad Soyad zorunludur';
    }
    if (!form.phone.trim() || form.phone.trim().length < 10) {
      newErrors.phone = 'Gecerli bir telefon numarasi giriniz';
    }
    if (!form.address.trim() || form.address.trim().length < 5) {
      newErrors.address = 'Adres zorunludur (en az 5 karakter)';
    }
    if (!form.city.trim() || form.city.trim().length < 2) {
      newErrors.city = 'Sehir zorunludur';
    }
    if (!form.postalCode.trim() || form.postalCode.trim().length < 4) {
      newErrors.postalCode = 'Gecerli bir posta kodu giriniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handlePlaceOrder = useCallback(async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const order = await orderService.createOrder({
        shippingAddress: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          postalCode: form.postalCode.trim(),
          country: form.country,
        },
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId ?? '',
          quantity: item.quantity,
        })),
      });

      clearCart();
      navigation.replace('OrderConfirmation', {
        orderNumber: order.orderNumber,
        orderId: order.id,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.message ||
        'Siparis olusturulurken bir hata olustu';
      Alert.alert('Hata', message);
    } finally {
      setIsSubmitting(false);
    }
  }, [validate, form, clearCart, navigation]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      testID="checkout-screen"
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Shipping Address Form */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[typography.subtitle1, { color: colors.text, marginBottom: spacing.md }]}>
            Teslimat Adresi
          </Text>

          <Input
            label="Ad Soyad"
            placeholder="Ad Soyad"
            value={form.fullName}
            onChangeText={(v) => updateField('fullName', v)}
            error={errors.fullName}
            icon="person-outline"
            testID="checkout-fullname"
          />

          <Input
            label="Telefon"
            placeholder="05XX XXX XX XX"
            value={form.phone}
            onChangeText={(v) => updateField('phone', v)}
            error={errors.phone}
            icon="call-outline"
            keyboardType="phone-pad"
            testID="checkout-phone"
          />

          <Input
            label="Adres"
            placeholder="Mahalle, Sokak, Bina No, Daire No"
            value={form.address}
            onChangeText={(v) => updateField('address', v)}
            error={errors.address}
            icon="location-outline"
            multiline
            numberOfLines={3}
            testID="checkout-address"
          />

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Input
                label="Sehir"
                placeholder="Sehir"
                value={form.city}
                onChangeText={(v) => updateField('city', v)}
                error={errors.city}
                testID="checkout-city"
              />
            </View>
            <View style={styles.halfField}>
              <Input
                label="Posta Kodu"
                placeholder="34000"
                value={form.postalCode}
                onChangeText={(v) => updateField('postalCode', v)}
                error={errors.postalCode}
                keyboardType="number-pad"
                testID="checkout-postalcode"
              />
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[typography.subtitle1, { color: colors.text, marginBottom: spacing.md }]}>
            Siparis Ozeti
          </Text>

          {items.map((item) => (
            <View
              key={`${item.productId}-${item.variantId ?? 'default'}`}
              style={[styles.orderItemRow, { borderBottomColor: colors.border }]}
            >
              <View style={styles.orderItemInfo}>
                <Text style={[typography.body2, { color: colors.text }]} numberOfLines={1}>
                  {item.name}
                </Text>
                {(item.size || item.color) && (
                  <Text style={[typography.caption, { color: colors.textSecondary }]}>
                    {[item.size, item.color].filter(Boolean).join(' / ')}
                  </Text>
                )}
              </View>
              <Text style={[typography.body2, { color: colors.textSecondary }]}>
                {item.quantity}x
              </Text>
              <Text style={[typography.subtitle2, { color: colors.text, minWidth: 80, textAlign: 'right' }]}>
                {formatPrice(item.price * item.quantity)}
              </Text>
            </View>
          ))}

          <View style={[styles.summaryDivider, { borderTopColor: colors.border }]}>
            <View style={styles.summaryRow}>
              <Text style={[typography.body2, { color: colors.textSecondary }]}>
                Ara Toplam ({totalItems} urun)
              </Text>
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

            <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
              <Text style={[typography.subtitle1, { color: colors.text }]}>Toplam</Text>
              <Text style={[typography.h3, { color: colors.primary }]}>{formatPrice(grandTotal)}</Text>
            </View>
          </View>
        </View>

        {/* Place Order Button */}
        <Button
          title="Siparisi Onayla"
          onPress={handlePlaceOrder}
          loading={isSubmitting}
          disabled={items.length === 0}
          testID="place-order-button"
          style={{ marginHorizontal: spacing.md, marginBottom: spacing.xl }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: spacing.md,
  },
  section: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  halfField: {
    flex: 1,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
  },
  orderItemInfo: {
    flex: 1,
  },
  summaryDivider: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
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
  },
});

export const CheckoutScreen = memo(CheckoutScreenComponent);
