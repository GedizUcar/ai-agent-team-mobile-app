# Sprint Kaydi - Sprint Log

Bu belge, sprint bazli aktivite kayitlarini tutar. Her gun sonu Team Lead tarafindan guncellenir.

---

## Ön-Sprint: Proje Altyapi Kurulumu

**Hedef**: Proje iskeleti, ajan rolleri ve gelistirme standartlarinin tanimlanmasi

### Tamamlanan Aktiviteler

| Gun | Ajan | Aktivite | Sonuc |
|-----|------|----------|-------|
| Gun 1 | Team Lead | Proje iskeleti ve Team Lead ajan kurulumu | Tamamlandi |
| Gun 2 | Designer | Designer ajani kurulumu ve tasarim standartlari | Tamamlandi |
| Gun 3 | Frontend | Frontend ajani kurulumu ve gelistirme standartlari | Tamamlandi |
| Gun 4 | Backend | Backend ajani kurulumu ve API/DB standartlari | Tamamlandi |
| Gun 5 | Team Lead | Operasyon merkezi kurulumu | Tamamlandi |
| Gun 6 | Team Lead | Proje kesfi oturumu (Stilora) | Tamamlandi |

### Notlar
- Tum 4 ajan rolu tanimlanmis ve aktif
- Tasarim tokenlari, komponent standartlari, API standartlari, DB standartlari hazir
- Auth stratejisi belirlenmis (JWT, RS256)
- Operasyon merkezi kuruldu (is akislari, kalite kapilari, iletisim protokolleri)
- Proje kesfi tamamlandi: **Stilora** - moda e-ticaret mobil uygulamasi
- PRD dolduruldu, 16 MVP kullanici hikayesi yazildi, 6 milestone tanimlandi
- 3 yeni ADR kaydedildi (ADR-004, ADR-005, ADR-006)

---

## Sprint 5: M5 - Profil, Ayarlar ve Dark Mode

**Tarih**: 2026-02-14
**Hedef**: Profil goruntuleme/duzenleme, ayarlar ekrani (tema, bildirimler, cikis), siparis gecmisi ve dark mode tam implementasyonu

### Gunluk Kayitlar

#### Gun 1 - 2026-02-14
- **Aktif Ajan**: Backend + Frontend (paralel calisma)
- **Yapilan Is**:
  - Backend: Profile update Zod validation schema (updateProfileSchema: firstName, lastName, phone) (T-035)
  - Backend: Profile update service fonksiyonu (updateProfile) (T-035)
  - Backend: Profile update controller + route (PUT /auth/profile, authenticated) (T-035)
  - Frontend: UpdateProfileRequest tipi eklendi (T-036)
  - Frontend: authService.updateProfile fonksiyonu eklendi (store sync ile) (T-036)
  - Frontend: ProfileScreen - avatar (initials), kullanici bilgileri, menu (Siparislerim, Ayarlar), son siparisler, pull-to-refresh (T-037)
  - Frontend: ProfileEditScreen - React Hook Form (ad, soyad, telefon), form validasyon, basari/hata mesajlari (T-038)
  - Frontend: SettingsScreen - tema secici (Acik/Koyu/Sistem), bildirim switch, cikis butonu (onay dialog) (T-039)
  - Frontend: OrderHistoryScreen - siparis listesi, infinite scroll, durum badge'leri, empty state (T-040)
  - Frontend: ProfileStackNavigator (ProfileMain, ProfileEdit, Settings, OrderHistory) (T-041)
  - Frontend: TabNavigator guncellendi - ProfileStackNavigator kullaniliyor
  - Frontend: Navigation types guncellendi - ProfileStackParamList eklendi
- **Durum**: Tamamlandi
- **Notlar**: Backend ve Frontend paralel calistirildi, TypeScript strict mode aktif, tum ekranlar dark mode uyumlu (useThemeColors hook), Zustand settings store ile tema persist

### Sprint Sonu Degerlendirmesi

| Metrik | Hedef | Gerceklesen |
|--------|-------|-------------|
| Planlanan gorev | 7 | 7 |
| Tamamlanan gorev | 7 | 7 |
| Bulunan bug | - | 0 |
| Duzeltilen bug | - | 0 |

### Dersler
- Mevcut useThemeColors hook ve Zustand settings store sayesinde dark mode tum ekranlarda otomatik calisiyor
- Profile stack navigator pattern diger tab'larla tutarli tutuldu
- React Query invalidation ile profil guncelleme sonrasi tum ekranlar senkronize

---

## Sprint 4: M4 - Sepet ve Siparis

**Tarih**: 2026-02-13
**Hedef**: Sepet ve siparis sisteminin backend ve frontend icin tam implementasyonu (Cart, Checkout, Order Confirmation)

### Gunluk Kayitlar

#### Gun 1 - 2026-02-13
- **Aktif Ajan**: Backend + Frontend (paralel calisma)
- **Yapilan Is**:
  - Backend: Cart/Order Zod validation schemalari (addCartItem, updateCartItem, removeCartItem, createOrder, listOrders, getOrder) (T-025)
  - Backend: Cart service katmani - getCart, addItem (stok kontrolu, duplicate handling), updateItemQuantity, removeItem, clearCart (T-026)
  - Backend: Order service katmani - createOrder (cart->order donusumu, stok azaltma, orderNumber uretimi, transaction), listOrders (pagination), getOrderById (T-027)
  - Backend: Cart controller + routes - GET /cart, POST /cart/items, PATCH /cart/items/:itemId, DELETE /cart/items/:itemId (tumu auth gerektirir) (T-028)
  - Backend: Order controller + routes - POST /orders, GET /orders, GET /orders/:id (tumu auth gerektirir) (T-029)
  - Frontend: Order/Cart TypeScript tipleri guncellendi (CartResponse, CartItemResponse, AddCartItemRequest, ShippingAddress, CreateOrderRequest) (T-030)
  - Frontend: Cart API service fonksiyonlari (getCart, addItem, updateItemQuantity, removeItem) (T-030)
  - Frontend: Order API service fonksiyonlari (createOrder, getOrders, getOrderById) (T-030)
  - Frontend: CartScreen - urun listesi, gorsel, miktar +/-, silme, ara toplam/kargo/toplam, ucretsiz kargo bilgisi, empty state (T-031)
  - Frontend: CheckoutScreen - teslimat adresi formu (ad, telefon, adres, sehir, posta kodu), siparis ozeti, form validasyon (T-032)
  - Frontend: OrderConfirmationScreen - basari ikonu, siparis numarasi, alisverise devam/siparisleri gor butonlari (T-033)
  - Frontend: CartStackNavigator (CartMain, Checkout, OrderConfirmation) (T-034)
  - Frontend: TabNavigator guncellendi - CartStackNavigator kullaniliyor, Cart badge aktif
  - Frontend: Navigation types guncellendi - CartStackParamList eklendi
- **Durum**: Tamamlandi
- **Notlar**: Backend ve Frontend paralel calistirildi, TypeScript strict mode aktif, kargo ucretsiz esik degeri 500 TL, standart kargo 29.99 TL

### Sprint Sonu Degerlendirmesi

| Metrik | Hedef | Gerceklesen |
|--------|-------|-------------|
| Planlanan gorev | 10 | 10 |
| Tamamlanan gorev | 10 | 10 |
| Bulunan bug | - | 0 |
| Duzeltilen bug | - | 0 |

### Dersler
- Prisma $transaction ile order olusturma + stok azaltma atomik yapilarak veri butunlugu saglandi
- Cart store (Zustand/lokal) ve backend cart sync'i MVP icin lokal oncelikli tutuldu
- Kargo ucreti icin threshold pattern (500 TL ucretsiz) iyi bir UX sagliyor

---

## Sprint 3: M3 - Urun Katalogu

**Tarih**: 2026-02-12
**Hedef**: Urun katalogu sisteminin backend ve frontend icin tam implementasyonu (Home, Product List, Product Detail)

### Gunluk Kayitlar

#### Gun 1 - 2026-02-12
- **Aktif Ajan**: Backend + Frontend (paralel calisma)
- **Yapilan Is**:
  - Backend: Product/Category Zod validation schemalari (listProducts, getProduct, listCategories, homeData) (T-016)
  - Backend: Product service katmani - listProducts (pagination, filter, search, sort), getProductById, listCategories (productCount), getHomeData (featured, newArrivals, categories) (T-017)
  - Backend: Product controller + routes - GET /products, GET /products/home, GET /products/:id, GET /categories (T-018)
  - Backend: Seed data scripti - 6 kategori (Kadin, Erkek, Aksesuar, Ayakkabi, Canta, Spor), 24 urun, varyantlar + gorseller (T-019)
  - Frontend: Product TypeScript tipleri guncellendi (Category, ProductImage, ProductVariant, Product, ProductDetail, HomeData, Pagination) (T-020)
  - Frontend: Product API service fonksiyonlari (getHomeData, getProducts, getProductById, getCategories) (T-020)
  - Frontend: ProductCard komponenti (gorsel, fiyat, indirim, kategori, memo) (T-021)
  - Frontend: CategoryCard komponenti (pill/chip, selected state, productCount badge) (T-021)
  - Frontend: HomeScreen - banner, yatay kategori listesi, featured products, new arrivals, pull-to-refresh (T-022)
  - Frontend: ProductsScreen - 2'li grid, infinite scroll, kategori filtreleme (T-023)
  - Frontend: ProductDetailScreen - gorsel galeri, beden/renk secimi, stok durumu, sepete ekle (T-024)
  - Frontend: ProductStackNavigator + HomeStackNavigator (tab icinde stack navigasyon) (T-024)
  - Frontend: TabNavigator guncellendi - stack navigator'lar ve Turkce tab isimleri
- **Durum**: Tamamlandi
- **Notlar**: Backend ve Frontend paralel calistirildi, TypeScript strict mode aktif, her iki proje hatasiz derleniyor

### Sprint Sonu Degerlendirmesi

| Metrik | Hedef | Gerceklesen |
|--------|-------|-------------|
| Planlanan gorev | 9 | 9 |
| Tamamlanan gorev | 9 | 9 |
| Bulunan bug | - | 0 |
| Duzeltilen bug | - | 0 |

### Dersler
- Backend ve Frontend paralel calistirilarak sprint suresi yari yariya kisaltildi
- Prisma schema onceden hazir oldugu icin backend hizla tamamlandi
- useInfiniteQuery ile sayfalama React Query'de cleanly implement edildi

---

## Sprint 2: M2 - Authentication Sistemi

**Tarih**: 2026-02-11
**Hedef**: Kimlik dogrulama sisteminin backend ve frontend icin tam implementasyonu

### Gunluk Kayitlar

#### Gun 1 - 2026-02-11
- **Aktif Ajan**: Backend + Frontend
- **Yapilan Is**:
  - Backend: Prisma User modeline lockout ve password reset alanlari eklendi (failedLoginAttempts, lockUntil, resetToken, resetTokenExp)
  - Backend: JWT utility fonksiyonlari (generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken) (T-008)
  - Backend: Password hashing utility (bcrypt, 12 salt rounds) (T-008)
  - Backend: Auth middleware (authenticate, requireRole) (T-008)
  - Backend: Zod validation schemalari (register, login, refresh, forgotPassword, resetPassword) (T-009)
  - Backend: Auth service katmani - register, login, logout, refresh, forgotPassword, resetPassword, getMe (T-010)
  - Backend: Auth controller ve route'lari - 7 endpoint (/register, /login, /logout, /refresh, /forgot-password, /reset-password, /me) (T-011)
  - Backend: Hesap kilitleme (5 basarisiz deneme -> 30 dk kilit) ve token rotation implementasyonu
  - Frontend: @react-navigation/native-stack paketi eklendi
  - Frontend: Auth API service fonksiyonlari (register, login, logout, forgotPassword, resetPassword, getMe) (T-014)
  - Frontend: Input komponenti (label, error, icon, password toggle destegi) (T-013)
  - Frontend: Button komponenti (primary, secondary, outline, ghost varyantlari) (T-013)
  - Frontend: LoginScreen - email/sifre formu, React Hook Form validasyon (T-015)
  - Frontend: RegisterScreen - ad/soyad/email/sifre/sifre tekrar formu (T-015)
  - Frontend: ForgotPasswordScreen - email formu + basari durumu ekrani (T-015)
  - Frontend: AuthNavigator (Native Stack) + RootNavigator (auth/main switch) (T-012)
  - Frontend: App.tsx guncellendi - RootNavigator kullaniliyor
- **Durum**: Tamamlandi
- **Notlar**: TypeScript strict mode aktif, backend ve frontend hatasiz derleniyor

### Sprint Sonu Degerlendirmesi

| Metrik | Hedef | Gerceklesen |
|--------|-------|-------------|
| Planlanan gorev | 8 | 8 |
| Tamamlanan gorev | 8 | 8 |
| Bulunan bug | - | 0 |
| Duzeltilen bug | - | 0 |

### Dersler
- jsonwebtoken v9+ `expiresIn` icin `StringValue` tipi bekliyor, string cast gerekli
- Prisma schema degisikliklerinden sonra `prisma generate` calistirilmali
- Auth akisinda token rotation (her refresh'te yeni token uretme) guvenlik icin onemli

---

## Sprint 1: M1 - Proje Scaffolding

**Tarih**: 2026-02-09 - 2026-02-09
**Hedef**: Backend ve Frontend proje iskeletlerinin olusturulmasi

### Gunluk Kayitlar

#### Gun 1 - 2026-02-09
- **Aktif Ajan**: Backend + Frontend
- **Yapilan Is**:
  - Backend: Express + TypeScript + Prisma projesi olusturuldu (T-001, T-002)
  - Backend: Tum DB modelleri Prisma schema'da tanimlandi (User, Product, Category, Cart, Order vb.)
  - Frontend: Expo + React Native + TypeScript projesi olusturuldu (T-003)
  - Frontend: Tab Navigator (Home, Products, Cart, Profile) kuruldu (T-004)
  - Frontend: Dark mode tema altyapisi (light/dark/system) hazir (T-005)
  - Frontend: Zustand store'lari (auth, cart, settings) AsyncStorage persist ile kuruldu (T-006)
  - Frontend: Axios interceptor'lari + React Query konfigurasyonu tamamlandi (T-007)
- **Durum**: Tamamlandi
- **Notlar**: TypeScript strict mode aktif, tum dosyalar hatasiz derleniyor

### Sprint Sonu Degerlendirmesi

| Metrik | Hedef | Gerceklesen |
|--------|-------|-------------|
| Planlanan gorev | 7 | 7 |
| Tamamlanan gorev | 7 | 7 |
| Bulunan bug | - | 0 |
| Duzeltilen bug | - | 0 |

### Dersler
- Expo template blank-typescript ile strict mode varsayilan olarak acik geliyor
- NativeWind + Tailwind 3.3.2 ile uyumlu calisma saglanmali

---

*Yeni sprint kayitlari bu dosyanin basina eklenir (en yeni en ustte).*
