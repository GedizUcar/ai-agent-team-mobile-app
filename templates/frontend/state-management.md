# State Yonetimi Stratejisi

Bu belge, projede kullanilacak state yonetimi yaklasimini ve standartlarini tanimlar.

## State Turleri

### 1. Local State (Yerel Durum)
Sadece bir komponente ozgu durum.

```typescript
// Ornek: Form input degeri
const [email, setEmail] = useState('');

// Ornek: Modal acik/kapali
const [isModalVisible, setIsModalVisible] = useState(false);
```

**Kullanim Alani:**
- Form inputlari
- UI toggle'lari
- Gecici animasyon durumlari

### 2. Global State (Genel Durum)
Birden fazla komponentin eristigi paylasilan durum.

```typescript
// Ornek: Kullanici bilgisi
// Ornek: Tema tercihi
// Ornek: Dil secimi
```

**Kullanim Alani:**
- Authentication durumu
- Kullanici profili
- Uygulama ayarlari
- Sepet icerigi

### 3. Server State (Sunucu Durumu)
API'den gelen ve cache'lenen veriler.

```typescript
// Ornek: Urun listesi
// Ornek: Kullanici siparisleri
```

**Kullanim Alani:**
- API'den gelen tum veriler
- Paginasyon durumu
- Arama sonuclari

## Teknoloji Secimi

### Global State: Zustand

```
Secim Gerekceleri:
- Minimal API, kolay ogrenme
- TypeScript ile mukemmel uyum
- Boilerplate yok
- DevTools destegi
- Persist middleware
```

### Server State: React Query (TanStack Query)

```
Secim Gerekceleri:
- Otomatik caching
- Background refetching
- Optimistic updates
- Retry mekanizmasi
- Devtools
```

## Zustand Kullanimi

### Store Yapisi

```
store/
├── index.ts              # Store birlesimi
├── useAuthStore.ts       # Authentication store
├── useUserStore.ts       # User store
├── useCartStore.ts       # Cart store
├── useSettingsStore.ts   # Settings store
└── types/
    └── store.types.ts    # Store tipleri
```

### Store Sablonu

```typescript
// useAuthStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  // State
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setToken: (token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      setToken: (token) => set({
        token,
        isAuthenticated: true
      }),

      logout: () => set({
        token: null,
        isAuthenticated: false
      }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ token: state.token }),
    }
  )
);
```

### Selector Kullanimi

```typescript
// DOGRU: Sadece gerekli state'i sec
const token = useAuthStore((state) => state.token);
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

// YANLIS: Tum store'u sec (gereksiz re-render)
const authStore = useAuthStore();
```

### Derived State

```typescript
// useCartStore.ts
import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],

  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),

  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  })),

  updateQuantity: (id, quantity) => set((state) => ({
    items: state.items.map((item) =>
      item.id === id ? { ...item, quantity } : item
    )
  })),

  clearCart: () => set({ items: [] }),
}));

// Derived selectors
export const useCartTotal = () =>
  useCartStore((state) =>
    state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  );

export const useCartItemCount = () =>
  useCartStore((state) =>
    state.items.reduce((count, item) => count + item.quantity, 0)
  );
```

## React Query Kullanimi

### Query Hook Yapisi

```typescript
// hooks/queries/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import type { Product, CreateProductDTO } from '@/types/product';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: string) => [...productKeys.lists(), { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Hooks
export const useProducts = (filters?: string) => {
  return useQuery({
    queryKey: productKeys.list(filters || ''),
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 dakika
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductDTO) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
```

### Optimistic Update

```typescript
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productService.updateProduct(id, data),

    onMutate: async ({ id, data }) => {
      // Bekleyen query'leri iptal et
      await queryClient.cancelQueries({ queryKey: productKeys.detail(id) });

      // Onceki degeri kaydet
      const previousProduct = queryClient.getQueryData(productKeys.detail(id));

      // Optimistic update
      queryClient.setQueryData(productKeys.detail(id), (old: Product) => ({
        ...old,
        ...data,
      }));

      return { previousProduct };
    },

    onError: (err, { id }, context) => {
      // Hata durumunda geri al
      queryClient.setQueryData(
        productKeys.detail(id),
        context?.previousProduct
      );
    },

    onSettled: (_, __, { id }) => {
      // Her durumda yenile
      queryClient.invalidateQueries({ queryKey: productKeys.detail(id) });
    },
  });
};
```

## State Yonetimi Kararlari

### Hangi State Nerede?

```
+------------------+-------------------+----------------------+
| Durum Turu       | Cozum             | Ornek                |
+------------------+-------------------+----------------------+
| UI State         | useState          | Modal acik/kapali    |
| Form State       | React Hook Form   | Login formu          |
| Auth State       | Zustand + Persist | Token, user          |
| App Settings     | Zustand + Persist | Tema, dil            |
| Cart/Wishlist    | Zustand + Persist | Sepet icerigi        |
| Server Data      | React Query       | Urun listesi         |
| Navigation State | React Navigation  | Aktif ekran          |
+------------------+-------------------+----------------------+
```

### State Akis Diyagrami

```
+-------------+     +-------------+     +-------------+
|   Server    | <-> | React Query | <-> | Components  |
+-------------+     +-------------+     +-------------+
                          |
                          v
+-------------+     +-------------+     +-------------+
| AsyncStorage| <-> |   Zustand   | <-> | Components  |
+-------------+     +-------------+     +-------------+
```

## Best Practices

### 1. State Normalization

```typescript
// YANLIS: Nested data
interface State {
  users: Array<{
    id: string;
    posts: Array<{
      id: string;
      comments: Comment[];
    }>;
  }>;
}

// DOGRU: Normalized data
interface State {
  users: Record<string, User>;
  posts: Record<string, Post>;
  comments: Record<string, Comment>;
}
```

### 2. Selective Subscription

```typescript
// YANLIS: Tum store'a subscribe
const { user, settings, cart } = useStore();

// DOGRU: Sadece gerekli kısma subscribe
const user = useStore((state) => state.user);
```

### 3. Action Gruplandirma

```typescript
// DOGRU: Ilgili action'lari birlikte tut
const useCartStore = create((set) => ({
  items: [],

  // Cart actions
  cart: {
    add: (item) => set((state) => ({ ... })),
    remove: (id) => set((state) => ({ ... })),
    clear: () => set({ items: [] }),
  },
}));
```

## Debugging

### Zustand DevTools

```typescript
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      // state & actions
    }),
    { name: 'MyStore' }
  )
);
```

### React Query DevTools

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// App.tsx
<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

## Checklist

Her state karari icin:

- [ ] State turu belirlendi (local/global/server)
- [ ] Dogru cozum secildi
- [ ] Persist gereksinimi degerlendirildi
- [ ] Selector'lar optimize edildi
- [ ] TypeScript tipleri tanimlandi
- [ ] DevTools entegrasyonu yapildi

---

*Bu strateji tum state yonetimi kararlarinda referans olarak kullanilir.*
