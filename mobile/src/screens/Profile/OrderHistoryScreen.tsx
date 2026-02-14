import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useThemeColors } from '../../hooks/useThemeColors';
import { typography, spacing, borderRadius } from '../../theme';
import { orderService } from '../../services/order';
import { Button } from '../../components/Button';
import { formatDate, formatPrice, getOrderStatusLabel } from '../../utils/format';
import type { Order } from '../../types/order';
import type { ProfileStackScreenProps } from '../../navigation/types';

type Props = ProfileStackScreenProps<'OrderHistory'>;

const PAGE_SIZE = 20;

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

function OrderHistoryScreenComponent({ navigation }: Props) {
  const colors = useThemeColors();

  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['orderHistory'],
    queryFn: ({ pageParam = 1 }) => orderService.getOrders(pageParam, PAGE_SIZE),
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination) return undefined;
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const orders = data?.pages.flatMap((page) => page.orders) ?? [];

  const renderOrder = useCallback(
    ({ item }: { item: Order }) => (
      <View
        style={[styles.orderCard, { backgroundColor: colors.surface }]}
        testID={`order-history-item-${item.id}`}
      >
        <View style={styles.orderHeader}>
          <Text style={[typography.subtitle1, { color: colors.text }]}>
            #{item.orderNumber}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status, colors) + '20' }]}>
            <Text style={[typography.caption, { color: getStatusColor(item.status, colors) }]}>
              {getOrderStatusLabel(item.status)}
            </Text>
          </View>
        </View>

        <View style={[styles.orderMeta, { borderTopColor: colors.border }]}>
          <View style={styles.orderMetaRow}>
            <Text style={[typography.body2, { color: colors.textSecondary }]}>Tarih</Text>
            <Text style={[typography.body2, { color: colors.text }]}>
              {formatDate(item.createdAt)}
            </Text>
          </View>
          <View style={styles.orderMetaRow}>
            <Text style={[typography.body2, { color: colors.textSecondary }]}>Urun Adedi</Text>
            <Text style={[typography.body2, { color: colors.text }]}>
              {item.itemCount} urun
            </Text>
          </View>
          <View style={styles.orderMetaRow}>
            <Text style={[typography.body2, { color: colors.textSecondary }]}>Toplam</Text>
            <Text style={[typography.subtitle2, { color: colors.primary }]}>
              {formatPrice(item.total)}
            </Text>
          </View>
        </View>
      </View>
    ),
    [colors],
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <ActivityIndicator
        color={colors.primary}
        style={{ paddingVertical: spacing.md }}
      />
    );
  }, [isFetchingNextPage, colors.primary]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
        testID="order-history-loading"
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
        testID="order-history-error"
      >
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={[typography.body1, { color: colors.textSecondary, marginTop: spacing.md }]}>
          Siparisler yuklenirken bir hata olustu
        </Text>
        <Button
          title="Tekrar Dene"
          onPress={() => refetch()}
          variant="outline"
          style={{ marginTop: spacing.md }}
          testID="order-history-retry"
        />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
        testID="order-history-empty"
      >
        <Ionicons name="receipt-outline" size={64} color={colors.textTertiary} />
        <Text style={[typography.h3, { color: colors.text, marginTop: spacing.md }]}>
          Henuz siparisiniz yok
        </Text>
        <Text style={[typography.body2, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          Alisverise baslayin ve siparislerinizi buradan takip edin
        </Text>
        <Button
          title="Alisverise Basla"
          onPress={() => navigation.getParent()?.navigate('Home')}
          style={{ marginTop: spacing.lg }}
          testID="order-history-shop"
        />
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      renderItem={renderOrder}
      keyExtractor={(item) => item.id}
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
      }
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.3}
      ListFooterComponent={renderFooter}
      testID="order-history-screen"
    />
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
  listContent: {
    padding: spacing.md,
  },
  orderCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
  },
  orderMeta: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  orderMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs / 2,
  },
});

export const OrderHistoryScreen = memo(OrderHistoryScreenComponent);
