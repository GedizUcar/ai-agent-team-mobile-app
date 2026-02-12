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
