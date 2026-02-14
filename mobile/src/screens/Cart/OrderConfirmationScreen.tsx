import React, { memo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../hooks/useThemeColors';
import { typography, spacing } from '../../theme';
import { Button } from '../../components/Button';
import type { CartStackScreenProps } from '../../navigation/types';

function OrderConfirmationScreenComponent({ route, navigation }: CartStackScreenProps<'OrderConfirmation'>) {
  const colors = useThemeColors();
  const { orderNumber } = route.params;

  const handleContinueShopping = useCallback(() => {
    // Reset cart stack to initial state before navigating away
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'CartMain' }],
      }),
    );
    navigation.getParent()?.navigate('Home');
  }, [navigation]);

  const handleViewOrders = useCallback(() => {
    // Reset cart stack to initial state before navigating away
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'CartMain' }],
      }),
    );
    navigation.getParent()?.navigate('Profile');
  }, [navigation]);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }]}
      testID="order-confirmation-screen"
    >
      {/* Success Icon */}
      <View style={[styles.iconCircle, { backgroundColor: colors.success + '20' }]}>
        <Ionicons name="checkmark-circle" size={80} color={colors.success} />
      </View>

      {/* Title */}
      <Text style={[typography.h2, { color: colors.text, marginTop: spacing.lg }]}>
        Siparisiniz Alindi!
      </Text>

      {/* Order Number */}
      <Text style={[typography.body1, { color: colors.textSecondary, marginTop: spacing.sm, textAlign: 'center' }]}>
        Siparis numaraniz:
      </Text>
      <Text style={[typography.h3, { color: colors.primary, marginTop: spacing.xs }]}>
        {orderNumber}
      </Text>

      <Text
        style={[
          typography.body2,
          { color: colors.textSecondary, marginTop: spacing.lg, textAlign: 'center', paddingHorizontal: spacing.xl },
        ]}
      >
        Siparissiniz basariyla olusturuldu. Siparis durumunuzu profil sayfanizdan takip edebilirsiniz.
      </Text>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Alisverise Devam Et"
          onPress={handleContinueShopping}
          testID="continue-shopping-button"
          style={styles.actionButton}
        />
        <Button
          title="Siparislerimi Gor"
          onPress={handleViewOrders}
          variant="outline"
          testID="view-orders-button"
          style={styles.actionButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    width: '100%',
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  actionButton: {
    width: '100%',
  },
});

export const OrderConfirmationScreen = memo(OrderConfirmationScreenComponent);
