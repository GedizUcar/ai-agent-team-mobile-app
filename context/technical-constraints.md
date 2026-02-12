# Teknik Kisitlamalar ve Kararlar

Bu belge, projede alinan teknik kararlari ve uyulmasi gereken kisitlamalari icerir. Tum ajanlar bu belgeye uyum saglar.

## Teknoloji Stack Kararlari

### Frontend

| Karar | Secim | Gerekce |
|-------|-------|---------|
| Framework | React Native | Tek kod tabaniyla iOS + Android, TypeScript destegi |
| Dil | TypeScript (strict mode) | Tip guvenligi, daha az runtime hatasi |
| State (global) | Zustand + AsyncStorage persist | Hafif, basit API, persist destegi |
| State (server) | React Query / TanStack Query | Cache, pagination, background refetch |
| Form | React Hook Form | Performansli, uncontrolled form yonetimi |
| HTTP Client | Axios | Interceptor destegi, hata yonetimi |
| Navigation | React Navigation | React Native icin standart cozum |
| Styling | Nativewind + StyleSheet | Utility-first + native performans |
| Test | Jest + Detox | Unit + E2E test |

### Backend

| Karar | Secim | Gerekce |
|-------|-------|---------|
| Runtime | Node.js | Frontend ile ayni ekosistem |
| Framework | Express.js (NestJS opsiyonel) | Hizli gelistirme, genis ekosistem |
| Veritabani | PostgreSQL 15+ | ACID, JSONB, full-text search |
| ORM | Prisma | Type-safe, otomatik migration |
| Auth | JWT (RS256) | Stateless, mobile-friendly |
| Validation | Zod | Runtime tip dogrulamasi |
| Cache | Redis | Session, cache, rate limiting |
| Logging | Winston | Structured logging |
| Docs | Swagger/OpenAPI | API dokumantasyonu |
| Test | Jest + Supertest | Unit + integration test |

## Mimari Kisitlamalar

### API Tasarimi

- **Versiyon**: URL tabanli (`/api/v1/...`)
- **Format**: JSON, UTF-8
- **Auth Header**: `Authorization: Bearer <token>`
- **Response yapisi**: Standart `{ success, data, meta, error }` formati (bkz: `templates/backend/api-standards.md`)
- **Hata kodlari**: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `RATE_LIMIT_EXCEEDED`

### Veritabani

- **Primary key**: UUID (`@default(uuid())`)
- **Soft delete**: `deleted_at` kolonu ile
- **Zorunlu alanlar**: Her tabloda `created_at`, `updated_at`
- **Foreign key**: `{entity}_id` formati
- **Boolean prefix**: `is_` veya `has_`
- **Tablo isimleri**: snake_case, cogul (`users`, `order_items`)
- **Kolon isimleri**: snake_case (`first_name`, `created_at`)

### Authentication

- **Access Token suresi**: 1 saat
- **Refresh Token suresi**: 14 gun
- **Password hashing**: bcrypt, 12 salt rounds
- **Sifre gereksinimleri**: Min 8 karakter, buyuk/kucuk harf, rakam, ozel karakter
- **OAuth providers**: Google (zorunlu), Apple (iOS icin zorunlu), Facebook (opsiyonel)

## Performans Kisitlamalari

### Frontend

| Metrik | Hedef | Olcum |
|--------|-------|-------|
| Animasyon FPS | >= 60 FPS | React Native Performance Monitor |
| Time to Interactive | < 3 saniye | Cold start olcumu |
| Bundle boyutu | < 10 MB | Metro bundler analizi |
| Test coverage | > %70 | Jest coverage raporu |

### Backend

| Metrik | Hedef | Olcum |
|--------|-------|-------|
| API response (p95) | < 200ms | Winston + APM |
| DB query (ortalama) | < 50ms | Prisma query logging |
| Uptime | > %99.9 | Health check monitoring |
| Error rate | < %0.1 | Error tracking |

### Erisebilirlik

| Metrik | Hedef |
|--------|-------|
| WCAG uyumu | AA seviyesi |
| Touch target | Minimum 44x44px |
| Renk kontrasti | Minimum 4.5:1 |
| Form elemani yuksekligi | Minimum 48px |

## Isimlendirme Kurallari

| Oge | Konvansiyon | Ornek |
|-----|-------------|-------|
| Komponentler | PascalCase | `UserProfile.tsx` |
| Fonksiyonlar | camelCase | `getUserData` |
| Sabitler | UPPER_SNAKE_CASE | `API_BASE_URL` |
| Dosyalar (komponent) | PascalCase | `UserProfile.tsx` |
| Klasorler | kebab-case | `user-profile/` |
| DB tablolar | snake_case, cogul | `users`, `order_items` |
| DB kolonlar | snake_case | `created_at`, `is_active` |
| API URL'leri | kebab-case, versiyonlu | `/api/v1/user-profiles` |

## Tasarim Sistemi Kisitlamalari

- **Ana renk**: `#2196F3` (blue)
- **Grid sistemi**: 8px
- **Font ailesi**: Inter (UI), JetBrains Mono (kod)
- **Breakpoints**: 320px (mobile min), 768px (tablet), 1024px+ (desktop)
- **Token referansi**: `templates/design/design-tokens.md`

## Calisma Sureci Kisitlamalari

1. Her iterasyonda tek bir ajan, tek bir alan uzerinde calisir
2. Her faz sonunda insan gelistirici onayi zorunludur
3. Team Lead tum ciktilari inceler
4. Tum kararlar dokumante edilir (`operations/tracking/decision-log.md`)
5. Kalite kapilari gecilmeden bir sonraki faza gecilemez (`operations/quality/`)

## Referanslar

- Frontend standartlari: `templates/frontend/`
- Backend standartlari: `templates/backend/`
- Tasarim standartlari: `templates/design/`
- Ajan rolleri: `agents/`

---

*Bu kisitlamalar proje boyunca tum ajanlar tarafindan uygulanir. Degisiklik icin Team Lead onayi ve karar kaydi (ADR) gereklidir.*
