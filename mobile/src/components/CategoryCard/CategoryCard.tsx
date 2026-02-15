import React, { memo } from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { useThemeColors } from '../../hooks/useThemeColors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius, TOUCH_TARGET_MIN } from '../../theme/spacing';
import type { Category } from '../../types/product';

interface CategoryCardProps {
  category: Category;
  isSelected?: boolean;
  onPress: (category: Category) => void;
  testID?: string;
}

function CategoryCardComponent({
  category,
  isSelected = false,
  onPress,
  testID,
}: CategoryCardProps) {
  const colors = useThemeColors();

  const containerStyle = isSelected
    ? { backgroundColor: colors.primary }
    : { backgroundColor: colors.surfaceVariant };

  const textColor = isSelected ? colors.onPrimary : colors.text;
  const badgeTextColor = isSelected ? colors.primary : colors.onPrimary;
  const badgeBgColor = isSelected ? colors.onPrimary : colors.primary;

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={() => onPress(category)}
      activeOpacity={0.7}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`${category.name}${category.productCount != null ? `, ${category.productCount} urun` : ''}`}
      accessibilityState={{ selected: isSelected }}
    >
      <Text style={[typography.subtitle2, { color: textColor }]} numberOfLines={1}>
        {category.name}
      </Text>

      {category.productCount != null && category.productCount > 0 && (
        <View style={[styles.badge, { backgroundColor: badgeBgColor }]}>
          <Text style={[typography.overline, { color: badgeTextColor }]}>
            {category.productCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    minHeight: TOUCH_TARGET_MIN,
    marginRight: spacing.sm,
    gap: spacing.xs,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
});

export const CategoryCard = memo(CategoryCardComponent);
