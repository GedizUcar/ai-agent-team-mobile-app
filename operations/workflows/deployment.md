# Deployment Is Akisi - Deployment Workflow

Bu belge, uygulamanin build, test ve deploy sureclerini tanimlar.

## Genel Bakis

```
Kod Dondurucu → Build → Test → Staging → Onay → Production
      |           |       |        |        |         |
   Team Lead    CI/CD   CI/CD   Test    Insan      CI/CD
                                      Gelistirici
```

---

## Ortam Tanimlari

| Ortam | Amac | Erisim |
|-------|------|--------|
| **Development** | Aktif gelistirme | Ajanlar |
| **Staging** | Test ve dogrulama | Team Lead + Insan Gelistirici |
| **Production** | Canli ortam | Son kullanicilar |

---

## Build Sureci

### Frontend (React Native)

#### iOS Build
```
1. TypeScript derleme kontrolu
2. ESLint kontrolu
3. Unit testler
4. Metro bundler ile bundle olusturma
5. Xcode ile IPA olusturma
6. Code signing
```

#### Android Build
```
1. TypeScript derleme kontrolu
2. ESLint kontrolu
3. Unit testler
4. Metro bundler ile bundle olusturma
5. Gradle ile APK/AAB olusturma
6. Signing
```

### Backend (Node.js)

```
1. TypeScript derleme kontrolu
2. ESLint kontrolu
3. Unit testler
4. Integration testler
5. Docker image olusturma
6. Image tagging (semver)
```

---

## Test Pipeline

### Otomatik Testler

| Adim | Tur | Araç | Basari Kriteri |
|------|-----|------|----------------|
| 1 | TypeScript derleme | tsc | Hata yok |
| 2 | Lint | ESLint | Hata yok |
| 3 | Unit test | Jest | Coverage > %70, tum testler gecti |
| 4 | Integration test | Jest + Supertest | Tum testler gecti |
| 5 | E2E test | Detox | Kritik akislar gecti |

### Manuel Testler

Staging ortaminda yapilir:

- [ ] Tum kullanici akislari test edildi
- [ ] Edge case'ler kontrol edildi
- [ ] Platform bazli test (iOS + Android)
- [ ] Farkli ekran boyutlari test edildi
- [ ] Network kotu durum testi (yavas/offline)

---

## Staging Deployment

### On Kosullar

- [ ] Tum otomatik testler gecti
- [ ] Kod inceleme onaylandi
- [ ] Entegrasyon kapisi gecildi (`quality/integration-gate.md`)

### Adimlar

1. **Backend**: Staging veritabanina migration uygula
2. **Backend**: Staging ortamina deploy et
3. **Backend**: Health check dogrula
4. **Frontend**: Staging API'ye yonelik build olustur
5. **Frontend**: Test cihazlarina yukle (TestFlight / Firebase App Distribution)
6. **Manuel test**: Smoke test yap
7. **Sonuc**: Basarili ise production onayi iste

---

## Production Deployment

### On Kosullar

- [ ] Staging testi basarili
- [ ] Release hazirlik kapisi gecildi (`quality/release-readiness-gate.md`)
- [ ] Insan gelistirici onayi alindi
- [ ] Rollback plani hazir

### Backend Deploy

```
1. Veritabani backup al
2. Migration'lari uygula
3. Yeni versiyon deploy et (blue-green veya rolling)
4. Health check dogrula
5. Monitoring kontrol et
6. Eski versiyonu standby'da tut (rollback icin)
```

### Frontend Deploy

```
1. Production build olustur
2. App Store Connect / Google Play Console'a yukle
3. Internal test → Beta test → Production
4. Kademeli dagitim (%10 → %50 → %100)
5. Crash raporlarini izle
6. Kullanici geri bildirimlerini takip et
```

---

## Rollback Plani

### Ne Zaman Rollback Yapilir?

- Kritik hata tespit edildi
- Performans ciddi sekilde dustu
- Guvenlik acigi kesfedildi
- Veri tutarsizligi olustu

### Backend Rollback

```
1. Onceki versiyona geri don
2. Gerekirse migration rollback yap
3. Health check dogrula
4. Monitoring kontrol et
```

### Frontend Rollback

```
1. App Store/Play Store'da surum geri cek (mumkunse)
2. Onceki versiyonu tekrar yayinla
3. Zorunlu guncelleme mesaji goster (gerekirse)
```

---

## Environment Degiskenleri

### Yonetim Ilkeleri

- `.env` dosyalari git'e eklenmez
- `.env.example` dosyasi template olarak saklanir
- Production degiskenleri guvenli yonetim araci ile saklanir
- Her ortam icin ayri `.env` dosyasi

### Gerekli Degiskenler

```
# Backend
DATABASE_URL=
REDIS_URL=
JWT_PRIVATE_KEY=
JWT_PUBLIC_KEY=
PORT=
NODE_ENV=
ALLOWED_ORIGINS=

# Frontend
API_BASE_URL=
```

---

## Monitoring ve Alerting

### Izlenmesi Gereken Metrikler

| Metrik | Esik | Aksyon |
|--------|------|--------|
| API response time (p95) | > 200ms | Alert |
| Error rate | > %1 | Alert |
| CPU usage | > %80 | Alert |
| Memory usage | > %85 | Alert |
| App crash rate | > %1 | Kritik alert |
| API uptime | < %99.9 | Kritik alert |

### Health Check Endpoint

```
GET /api/v1/health

Response:
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

---

## Deployment Kontrol Listesi

Her deployment oncesi:

- [ ] Tum testler gecti
- [ ] Kod inceleme onaylandi
- [ ] Database migration hazir
- [ ] Environment degiskenleri dogru
- [ ] Rollback plani var
- [ ] Monitoring aktif
- [ ] Insan gelistirici onayi alindi (production icin)

## Referanslar

- Release sureci: `release.md`
- Release hazirlik kapisi: `../quality/release-readiness-gate.md`
- Entegrasyon kapisi: `../quality/integration-gate.md`

---

*Bu surec, tum deployment islemlerinde takip edilir.*
