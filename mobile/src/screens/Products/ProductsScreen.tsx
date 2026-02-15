import React, { memo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../hooks/useThemeColors';
import { typography, spacing } from '../../theme';
import { productService } from '../../services/product';
import { ProductCard } from '../../components/ProductCard';
import { Button } from '../../components/Button';
import type { Product } from '../../types/product';
import type { ProductStackScreenProps } from '../../navigation/types';

type Props = ProductStackScreenProps<'ProductList'>;

function ProductsScreenComponent({ navigation, route }: Props) {
  const colors = useThemeColors();
  const categoryId = route.params?.categoryId;
  const categoryName = route.params?.categoryName;

  useEffect(() => {
    navigation.setOptions({
      title: categoryName ?? 'Tum Urunler',
    });
  }, [navigation, categoryName]);

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
    queryKey: ['products', { categoryId }],
    queryFn: ({ pageParam = 1 }) =>
      productService.getProducts({ page: pageParam, limit: 20, categoryId }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const allProducts = data?.pages.flatMap((page) => page.products) ?? [];

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('ProductDetail', { productId: product.id });
    },
    [navigation],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <View style={styles.gridItem}>
        <ProductCard
          product={item}
          onPress={handleProductPress}
          testID={`product-list-item-${item.id}`}
        />
      </View>
    ),
    [handleProductPress],
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [isFetchingNextPage, colors.primary]);

  const renderEmpty = useCallback(() => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bag-outline" size={48} color={colors.textTertiary} />
        <Text style={[typography.body1, { color: colors.textSecondary, marginTop: spacing.md }]}>
          Urun bulunamadi
        </Text>
      </View>
    );
  }, [isLoading, colors]);

  if (isLoading) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
        testID="products-screen-loading"
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
        testID="products-screen-error"
      >
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={[typography.body1, { color: colors.textSecondary, marginTop: spacing.md }]}>
          Urunler yuklenirken bir hata olustu
        </Text>
        <Button
          title="Tekrar Dene"
          onPress={() => refetch()}
          variant="outline"
          style={{ marginTop: spacing.md }}
          testID="products-retry-button"
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} testID="products-screen">
      <FlatList
        data={allProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
      />
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
  listContent: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
    maxWidth: '50%',
  },
  footerLoader: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing['3xl'],
  },
});

export const ProductsScreen = memo(ProductsScreenComponent);
