# React Native Komponent Standartlari

Bu belge, projede kullanilacak komponent gelistirme standartlarini tanimlar.

## Komponent Kategorileri

### 1. Common (Ortak) Komponentler
Uygulamanin her yerinde kullanilabilir temel UI birimleri.

```
components/common/
├── Button/
├── Input/
├── Text/
├── Card/
├── Avatar/
├── Badge/
├── Divider/
├── Icon/
├── Image/
├── Loading/
└── Modal/
```

### 2. Layout Komponentleri
Sayfa yapisi ve duzenleme icin kullanilan komponentler.

```
components/layout/
├── Container/
├── Header/
├── Footer/
├── TabBar/
├── SafeArea/
├── ScrollView/
├── KeyboardAvoid/
└── Spacer/
```

### 3. Feature Komponentleri
Belirli ozelliklere ozel komponentler.

```
components/features/
├── auth/
│   ├── LoginForm/
│   └── RegisterForm/
├── product/
│   ├── ProductCard/
│   └── ProductList/
└── user/
    ├── ProfileCard/
    └── UserAvatar/
```

## Komponent Dosya Yapisi

Her komponent icin klasor yapisi:

```
ComponentName/
├── index.ts              # Export dosyasi
├── ComponentName.tsx     # Ana komponent
├── ComponentName.styles.ts   # Stiller
├── ComponentName.types.ts    # TypeScript tipleri
├── ComponentName.test.tsx    # Testler
└── ComponentName.stories.tsx # Storybook (opsiyonel)
```

## Kod Sablonlari

### Temel Komponent Sablonu

```typescript
// ComponentName.types.ts
export interface ComponentNameProps {
  /** Komponent aciklamasi */
  title: string;
  /** Opsiyonel prop */
  subtitle?: string;
  /** Callback fonksiyonu */
  onPress?: () => void;
  /** Test ID */
  testID?: string;
}
```

```typescript
// ComponentName.tsx
import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './ComponentName.styles';
import type { ComponentNameProps } from './ComponentName.types';

export const ComponentName: React.FC<ComponentNameProps> = memo(({
  title,
  subtitle,
  onPress,
  testID = 'component-name',
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      testID={testID}
      activeOpacity={0.7}
    >
      <Text style={styles.title}>{title}</Text>
      {subtitle && (
        <Text style={styles.subtitle}>{subtitle}</Text>
      )}
    </TouchableOpacity>
  );
});

ComponentName.displayName = 'ComponentName';
```

```typescript
// ComponentName.styles.ts
import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
```

```typescript
// index.ts
export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName.types';
```

### Varyantli Komponent Sablonu

```typescript
// Button.types.ts
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  testID?: string;
}
```

```typescript
// Button.tsx
import React, { memo, useMemo } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { getButtonStyles, getTextStyles } from './Button.styles';
import type { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = memo(({
  variant = 'primary',
  size = 'md',
  label,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  testID = 'button',
}) => {
  const buttonStyles = useMemo(
    () => getButtonStyles({ variant, size, disabled, fullWidth }),
    [variant, size, disabled, fullWidth]
  );

  const textStyles = useMemo(
    () => getTextStyles({ variant, size, disabled }),
    [variant, size, disabled]
  );

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      testID={testID}
    >
      {loading ? (
        <ActivityIndicator color={textStyles.color} />
      ) : (
        <View style={styles.content}>
          {leftIcon}
          <Text style={textStyles}>{label}</Text>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';
```

### Custom Hook Kullanan Komponent

```typescript
// SearchInput.tsx
import React, { memo, useCallback } from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';
import { useDebounce } from '@/hooks/useDebounce';
import { Icon } from '@/components/common/Icon';
import { styles } from './SearchInput.styles';
import type { SearchInputProps } from './SearchInput.types';

export const SearchInput: React.FC<SearchInputProps> = memo(({
  value,
  onChangeText,
  onSearch,
  placeholder = 'Ara...',
  debounceMs = 300,
  testID = 'search-input',
}) => {
  const debouncedSearch = useDebounce(onSearch, debounceMs);

  const handleChangeText = useCallback((text: string) => {
    onChangeText(text);
    debouncedSearch(text);
  }, [onChangeText, debouncedSearch]);

  const handleClear = useCallback(() => {
    onChangeText('');
    onSearch?.('');
  }, [onChangeText, onSearch]);

  return (
    <View style={styles.container} testID={testID}>
      <Icon name="search" size={20} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={styles.placeholder.color}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear}>
          <Icon name="close" size={20} />
        </TouchableOpacity>
      )}
    </View>
  );
});

SearchInput.displayName = 'SearchInput';
```

## Best Practices

### 1. Performance

```typescript
// DOGRU: memo kullanimi
export const ExpensiveComponent = memo(({ data }) => {
  // ...
});

// DOGRU: useCallback ile fonksiyon memoization
const handlePress = useCallback(() => {
  onPress(item.id);
}, [onPress, item.id]);

// DOGRU: useMemo ile hesaplama memoization
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.name.localeCompare(b.name));
}, [data]);
```

### 2. Accessibility

```typescript
// DOGRU: Accessibility props
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Sepete ekle butonu"
  accessibilityHint="Urunu sepetinize ekler"
  accessibilityRole="button"
  accessibilityState={{ disabled: isDisabled }}
>
  <Text>Sepete Ekle</Text>
</TouchableOpacity>
```

### 3. Error Handling

```typescript
// DOGRU: Error boundary kullanimi
<ErrorBoundary fallback={<ErrorFallback />}>
  <RiskyComponent />
</ErrorBoundary>

// DOGRU: Null check
{user?.name && <Text>{user.name}</Text>}
```

### 4. Testing

```typescript
// ComponentName.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <ComponentName title="Test Title" />
    );
    expect(getByText('Test Title')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <ComponentName title="Test" onPress={onPress} />
    );
    fireEvent.press(getByTestId('component-name'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

## Naming Conventions

| Tur | Format | Ornek |
|-----|--------|-------|
| Komponent | PascalCase | `UserProfile` |
| Props interface | PascalCase + Props | `UserProfileProps` |
| Hook | camelCase + use prefix | `useUserData` |
| Event handler | camelCase + handle prefix | `handlePress` |
| Boolean prop | camelCase + is/has prefix | `isLoading`, `hasError` |
| Style object | camelCase | `containerStyle` |

## Checklist

Her komponent icin:

- [ ] TypeScript tipleri tanimli
- [ ] Props dokumante edilmis (JSDoc)
- [ ] Default props set edilmis
- [ ] testID prop'u var
- [ ] memo() ile wrapped (gerekli ise)
- [ ] Accessibility props eklenmis
- [ ] Unit testler yazilmis
- [ ] Stiller ayri dosyada

---

*Bu standartlar tum frontend gelistirme surecinde uygulanir.*
