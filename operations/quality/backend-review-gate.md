# Backend Inceleme Kapisi - Backend Review Gate

Bu kontrol listesi, Backend ajaninin ciktilari bir sonraki faza (Frontend entegrasyonu veya release) gecmeden once tamamlanmasi gereken kriterleri icerir.

## Kapsam

Bu kalite kapisi asagidaki teslimatlar icin uygulanir:
- API endpoint implementasyonlari
- Veritabani sema degisiklikleri
- Authentication/Authorization degisiklikleri
- Middleware ve servis katmani degisiklikleri
- Migration dosyalari

## Inceleme Sorumlusu

**Birincil**: Team Lead
**Ikincil**: Insan Gelistirici (guvenlik ve mimari kararlar icin)

---

## Kontrol Listesi

### 1. API Tasarim Standartlari

- [ ] URL yapisi RESTful ve kebab-case (`/api/v1/{resource}`)
- [ ] HTTP metodlari dogru kullanilmis (GET, POST, PUT, PATCH, DELETE)
- [ ] Response formati standart (`{ success, data, meta, error }`)
- [ ] HTTP status kodlari dogru (200, 201, 204, 400, 401, 403, 404, 422, 429, 500)
- [ ] Hata kodlari standart (`VALIDATION_ERROR`, `UNAUTHORIZED`, vb.)
- [ ] Versiyon yonetimi uygulanmis (`/api/v1/...`)
- [ ] Pagination uygulanmis (liste endpoint'leri icin)

### 2. Veritabani

- [ ] Tablo isimleri snake_case ve cogul
- [ ] Kolon isimleri snake_case
- [ ] Primary key UUID ile `@default(uuid())`
- [ ] `created_at` ve `updated_at` alanlari mevcut
- [ ] Soft delete gerekli mi degerlendirildi (`deleted_at`)
- [ ] Foreign key'ler `{entity}_id` formatinda
- [ ] Boolean alanlar `is_` veya `has_` prefix'li
- [ ] Gerekli index'ler eklenmis
- [ ] Migration dosyasi olusturulmus
- [ ] Iliski tanimlari dogru

### 3. Input Validation

- [ ] Tum endpoint'lerde Zod ile validation mevcut
- [ ] Zorunlu alanlar kontrol ediliyor
- [ ] Tip kontrolleri yapiliyor (string, number, email, vb.)
- [ ] Uzunluk kontrolleri mevcut (min, max)
- [ ] Ozel format kontrolleri var (email, telefon, vb.)
- [ ] Validation hatalari detayli mesaj donduruyor
- [ ] SQL injection korunmasi saglanmis (Prisma otomatik)

### 4. Authentication & Authorization

- [ ] Auth middleware dogru endpoint'lere uygulanmis
- [ ] Public endpoint'ler acikca belirtilmis
- [ ] Role kontrolleri uygulanmis (RBAC)
- [ ] Permission kontrolleri uygulanmis (gerekli ise)
- [ ] Token dogrulama calisiyor
- [ ] Hassas endpoint'lerde ekstra guvenlik onlemleri var

### 5. Guvenlik

- [ ] Sifre hashleme bcrypt ile (12 salt rounds)
- [ ] Hassas veri response'da donmuyor (passwordHash, vb.)
- [ ] Rate limiting uygulanmis
- [ ] CORS konfigurasyonu dogru
- [ ] Helmet middleware aktif
- [ ] Error mesajlari bilgi sizintisi icermiyor
- [ ] Input sanitization yapilmis

### 6. Performans

- [ ] API response suresi < 200ms (p95)
- [ ] Veritabani sorgulari < 50ms (ortalama)
- [ ] N+1 sorgu problemi yok (include/join kullanilmis)
- [ ] Sadece gerekli alanlar seciliyor (select)
- [ ] Caching uygulanmis (uygun endpoint'ler icin)
- [ ] Pagination ile buyuk veri setleri yonetiliyor

### 7. Hata Yonetimi

- [ ] Global error handler mevcut
- [ ] Tum hatalar standart formatta dondurulur
- [ ] Beklenmeyen hatalar 500 donduruyor (detay gizli)
- [ ] Validation hatalari 422 donduruyor
- [ ] Auth hatalari 401/403 donduruyor
- [ ] Hatalar loglanyor (hassas veri haric)

### 8. Logging

- [ ] Winston ile structured logging
- [ ] Request/Response loglari mevcut
- [ ] Error loglari mevcut
- [ ] Hassas veri loglanmiyor (sifre, token)
- [ ] Log seviyeleri dogru kullanilmis (info, warn, error)
- [ ] Request ID (correlation ID) mevcut

### 9. Kod Kalitesi

- [ ] TypeScript strict mode hatasiz
- [ ] Controller → Service → Repository katman yapisi
- [ ] Is mantigi Service katmaninda
- [ ] Kullanilmayan kod temizlenmis
- [ ] Anlamli degisken ve fonksiyon isimleri
- [ ] DRY prensibi uygulanmis

### 10. Dokumantasyon

- [ ] Swagger/OpenAPI spesifikasyonu guncel
- [ ] Request/Response ornekleri mevcut
- [ ] Error kodlari dokumante edilmis
- [ ] Rate limit bilgileri belirtilmis
- [ ] Frontend ajani icin entegrasyon notalari hazir

### 11. Test

- [ ] Unit testler yazilmis (service katmani)
- [ ] Integration testler yazilmis (API endpoint'leri)
- [ ] Edge case testleri mevcut
- [ ] Hata senaryolari test edilmis
- [ ] Auth/permission testleri mevcut

## Inceleme Sonucu

| Sonuc | Aciklama |
|-------|----------|
| **GECTI** | Tum kriterler karsilandi, Frontend entegrasyonu icin hazir |
| **KOSULLU GECTI** | Minor sorunlar var, paralel duzeltme ile ilerlenebilir |
| **KALDI** | Kritik sorunlar var, yeniden calisma gerekli |

### Inceleme Kaydi

```
Tarih: {YYYY-AA-GG}
Inceleyen: {Ajan/kisi adi}
Sonuc: GECTI / KOSULLU GECTI / KALDI
Notlar: {Varsa duzeltme gereken noktalar}
```

## Referanslar

- API standartlari: `../../templates/backend/api-standards.md`
- Veritabani standartlari: `../../templates/backend/database-standards.md`
- Auth stratejisi: `../../templates/backend/auth-strategy.md`
- Handoff protokolu: `../communication/handoff-protocols.md`

---

*Bu kalite kapisi, her backend teslimatinda Team Lead tarafindan uygulanir.*
