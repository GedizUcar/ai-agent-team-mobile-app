import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../hooks/useThemeColors';
import { typography, spacing, borderRadius } from '../../theme';
import { productService } from '../../services/product';
import { ProductCard } from '../../components/ProductCard';
import { CategoryCard } from '../../components/CategoryCard';
import { Button } from '../../components/Button';
import type { Product, Category } from '../../types/product';
import type { HomeStackScreenProps } from '../../navigation/types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const HORIZONTAL_CARD_WIDTH = SCREEN_WIDTH * 0.42;

type Props = HomeStackScreenProps<'HomeMain'>;

function HomeScreenComponent({ navigation }: Props) {
  const colors = useThemeColors();

  const {
    data: homeData,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['home'],
    queryFn: productService.getHomeData,
  });

  const handleProductPress = useCallback(
    (product: Product) => {
      navigation.navigate('HomeProductDetail', { productId: product.id });
    },
    [navigation],
  );

  const handleCategoryPress = useCallback(
    (category: Category) => {
      navigation.getParent()?.navigate('Products', {
        screen: 'ProductList',
        params: { categoryId: category.id, categoryName: category.name },
      });
    },
    [navigation],
  );

  const renderHorizontalProduct = useCallback(
    ({ item }: { item: Product }) => (
      <View style={{ width: HORIZONTAL_CARD_WIDTH }}>
        <ProductCard
          product={item}
          onPress={handleProductPress}
          testID={`home-product-${item.id}`}
        />
      </View>
    ),
    [handleProductPress],
  );

  const renderCategory = useCallback(
    ({ item }: { item: Category }) => (
      <CategoryCard
        category={item}
        onPress={handleCategoryPress}
        testID={`home-category-${item.id}`}
      />
    ),
    [handleCategoryPress],
  );

  if (isLoading) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
        testID="home-screen-loading"
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={[styles.centerContainer, { backgroundColor: colors.background }]}
        testID="home-screen-error"
      >
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={[typography.body1, { color: colors.textSecondary, marginTop: spacing.md }]}>
          Veriler yuklenirken bir hata olustu
        </Text>
        <Button
          title="Tekrar Dene"
          onPress={() => refetch()}
          variant="outline"
          style={{ marginTop: spacing.md }}
          testID="home-retry-button"
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
      }
      testID="home-screen"
    >
      {/* Welcome Banner */}
      <View style={[styles.banner, { backgroundColor: colors.primaryContainer }]}>
        <Text style={[typography.h2, { color: colors.primary }]}>
          Stilora'ya Hos Geldiniz
        </Text>
        <Text style={[typography.body2, { color: colors.textSecondary, marginTop: spacing.xs }]}>
          En yeni ve en trend urunleri kesfet
        </Text>
      </View>

      {/* Categories */}
      {homeData?.categories && homeData.categories.length > 0 && (
        <View style={styles.section}>
          <Text style={[typography.h3, styles.sectionTitle, { color: colors.text }]}>
            Kategoriler
          </Text>
          <FlatList
            data={homeData.categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </View>
      )}

      {/* Featured Products */}
      {homeData?.featuredProducts && homeData.featuredProducts.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[typography.h3, { color: colors.text }]}>
              One Cikan Urunler
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.getParent()?.navigate('Products', {
                  screen: 'ProductList',
                  params: undefined,
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Tum urunleri gor"
            >
              <Text style={[typography.subtitle2, { color: colors.primary }]}>Tumunu Gor</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={homeData.featuredProducts}
            renderItem={renderHorizontalProduct}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </View>
      )}

      {/* New Arrivals */}
      {homeData?.newArrivals && homeData.newArrivals.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[typography.h3, { color: colors.text }]}>
              Yeni Gelenler
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.getParent()?.navigate('Products', {
                  screen: 'ProductList',
                  params: undefined,
                })
              }
              accessibilityRole="button"
              accessibilityLabel="Tum yeni urunleri gor"
            >
              <Text style={[typography.subtitle2, { color: colors.primary }]}>Tumunu Gor</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={homeData.newArrivals}
            renderItem={renderHorizontalProduct}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </View>
      )}

      {/* Bottom spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
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
  banner: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  horizontalListContent: {
    paddingHorizontal: spacing.sm,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});

export const HomeScreen = memo(HomeScreenComponent);
