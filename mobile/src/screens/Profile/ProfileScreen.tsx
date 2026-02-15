import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useThemeColors } from '../../hooks/useThemeColors';
import { typography, spacing, borderRadius } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth';
import { orderService } from '../../services/order';
import { Button } from '../../components/Button';
import { formatDate, formatPrice, getOrderStatusLabel } from '../../utils/format';
import type { ProfileStackScreenProps } from '../../navigation/types';

type Props = ProfileStackScreenProps<'ProfileMain'>;

function getStatusColor(status: string, colors: ReturnType<typeof useThemeColors>): string {
  switch (status) {
    case 'DELIVERED':
      return colors.success;
    case 'CANCELLED':
      return colors.error;
    case 'SHIPPED':
      return colors.info;
    default:
      return colors.warning;
  }
}

function ProfileScreenComponent({ navigation }: Props) {
  const colors = useThemeColors();
  const user = useAuthStore((s) => s.user);

  const {
    data: profile,
    isLoading: profileLoading,
    refetch: refetchProfile,
    isRefetching,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: authService.getMe,
  });

  const { data: ordersData } = useQuery({
    queryKey: ['orders', 1],
    queryFn: () => orderService.getOrders(1, 5),
  });

  const displayUser = profile || user;
  const recentOrders = ordersData?.orders?.slice(0, 3) ?? [];

  const handleNavigate = useCallback(
    (screen: 'ProfileEdit' | 'Settings' | 'OrderHistory') => {
      navigation.navigate(screen);
    },
    [navigation],
  );

  if (profileLoading && !displayUser) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
        testID="profile-screen-loading"
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetchProfile} tintColor={colors.primary} />
      }
      testID="profile-screen"
    >
      {/* User Info Card */}
      <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primaryContainer }]}>
          <Text style={[typography.h2, { color: colors.primary }]}>
            {displayUser?.firstName?.[0]?.toUpperCase() ?? '?'}
            {displayUser?.lastName?.[0]?.toUpperCase() ?? ''}
          </Text>
        </View>
        <Text style={[typography.h3, { color: colors.text, marginTop: spacing.sm }]}>
          {displayUser?.firstName} {displayUser?.lastName}
        </Text>
        <Text style={[typography.body2, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          {displayUser?.email}
        </Text>
        {displayUser?.phone && (
          <Text style={[typography.body2, { color: colors.textSecondary, marginTop: spacing.xs }]}>
            {displayUser.phone}
          </Text>
        )}
        <Button
          title="Profili Duzenle"
          onPress={() => handleNavigate('ProfileEdit')}
          variant="outline"
          style={{ marginTop: spacing.md }}
          testID="profile-edit-button"
        />
      </View>

      {/* Menu Items */}
      <View style={[styles.menuSection, { backgroundColor: colors.surface }]}>
        <MenuItem
          icon="receipt-outline"
          label="Siparislerim"
          onPress={() => handleNavigate('OrderHistory')}
          colors={colors}
          testID="profile-orders-menu"
        />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <MenuItem
          icon="settings-outline"
          label="Ayarlar"
          onPress={() => handleNavigate('Settings')}
          colors={colors}
          testID="profile-settings-menu"
        />
      </View>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[typography.h3, { color: colors.text }]}>Son Siparisler</Text>
            <TouchableOpacity
              onPress={() => handleNavigate('OrderHistory')}
              accessibilityRole="button"
              accessibilityLabel="Tum siparisleri gor"
            >
              <Text style={[typography.subtitle2, { color: colors.primary }]}>Tumunu Gor</Text>
            </TouchableOpacity>
          </View>
          {recentOrders.map((order) => (
            <View
              key={order.id}
              style={[styles.orderCard, { backgroundColor: colors.surface }]}
              testID={`profile-order-${order.id}`}
            >
              <View style={styles.orderHeader}>
                <Text style={[typography.subtitle2, { color: colors.text }]}>
                  #{order.orderNumber}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status, colors) + '20' }]}>
                  <Text style={[typography.caption, { color: getStatusColor(order.status, colors) }]}>
                    {getOrderStatusLabel(order.status)}
                  </Text>
                </View>
              </View>
              <View style={styles.orderDetails}>
                <Text style={[typography.body2, { color: colors.textSecondary }]}>
                  {formatDate(order.createdAt)}
                </Text>
                <Text style={[typography.subtitle2, { color: colors.text }]}>
                  {formatPrice(order.total)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Member Since */}
      {displayUser?.createdAt && (
        <Text
          style={[
            typography.caption,
            { color: colors.textTertiary, textAlign: 'center', marginTop: spacing.lg },
          ]}
        >
          Uye: {formatDate(displayUser.createdAt)}
        </Text>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  colors: ReturnType<typeof useThemeColors>;
  testID?: string;
}

const MenuItem = memo(function MenuItem({ icon, label, onPress, colors, testID }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={22} color={colors.primary} />
        <Text style={[typography.body1, { color: colors.text, marginLeft: spacing.md }]}>
          {label}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuSection: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: spacing.md + 22 + spacing.md,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderCard: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});

export const ProfileScreen = memo(ProfileScreenComponent);
