# Entegrasyon Kapisi - Integration Gate

Bu kontrol listesi, Frontend ve Backend bilesenleri bir araya getirildikten sonra release adimina gecmeden once tamamlanmasi gereken kriterleri icerir.

## Kapsam

Bu kalite kapisi asagidaki entegrasyon senaryolari icin uygulanir:
- Frontend-Backend API entegrasyonu
- Authentication akisi (kayit, giris, cikis, token yenileme)
- CRUD islemleri (listeleme, olusturma, guncelleme, silme)
- Dosya yukleme/indirme
- Real-time guncellemeler (varsa)

## Inceleme Sorumlusu

**Birincil**: Team Lead
**Ikincil**: Insan Gelistirici

---

## Kontrol Listesi

### 1. API Entegrasyonu

- [ ] Tum endpoint'ler Frontend'den basariyla cagriliyor
- [ ] Request formati API spesifikasyonuna uygun
- [ ] Response verisi dogru parse ediliyor
- [ ] Pagination dogru calisiyor
- [ ] Filtreleme ve siralama calisiyor
- [ ] Arama fonksiyonu calisiyor (varsa)

### 2. Authentication Akisi

- [ ] Kayit (register) akisi uc uca calisiyor
- [ ] Giris (login) akisi calisiyor
- [ ] Token yenileme otomatik calisiyor
- [ ] Cikis (logout) calisiyor ve state temizleniyor
- [ ] Sifre sifirlama akisi calisiyor
- [ ] Token suresi dolunca login ekranina yonlendiriliyor
- [ ] Yetkisiz erisim denemeleri dogru ele aliniyor (401/403)

### 3. Veri Tutarliligi

- [ ] Frontend'de gosterilen veri, backend verisi ile tutarli
- [ ] Olusturma isleminden sonra liste guncellanıyor
- [ ] Guncelleme isleminden sonra veri yansıyor
- [ ] Silme isleminden sonra veri listeden kalkiyor
- [ ] Optimistic update calisiyor (kullanildiysa)
- [ ] Cache invalidation dogru calisiyor

### 4. Hata Yonetimi

- [ ] Validation hatalari (422) kullaniciya gosteriliyor
- [ ] Network hatasi durumunda uyari gosteriliyor
- [ ] Server hatasi (500) durumunda genel hata mesaji
- [ ] Timeout durumu ele aliniyor
- [ ] Retry mekanizmasi calisiyor
- [ ] Offline durumda uygun mesaj gosteriliyor

### 5. Loading States

- [ ] API cagrilari sirasinda loading gostergesi var
- [ ] Skeleton loader veya spinner kullanilmis
- [ ] Loading durumunda butonlar disable
- [ ] Uzun sureli islemler icin progress gostergesi

### 6. Performans

- [ ] API cagrilari beklenen surede tamamlaniyor (< 200ms p95)
- [ ] Gereksiz API cagrisi yapilmiyor
- [ ] React Query cache dogru calisiyor
- [ ] Buyuk veri setlerinde sayfa performansi kabul edilebilir
- [ ] Image/asset yukleme optimize
- [ ] Memory leak yok

### 7. Guvenlik

- [ ] Auth token guvenli depolaniyor (AsyncStorage)
- [ ] Token her istekte gonderiyor (Authorization header)
- [ ] Hassas veri aciga cikmiyorR
- [ ] HTTPS kullaniliyor
- [ ] Input sanitization frontend'de de yapiliyor

### 8. Platform Testi

- [ ] iOS'ta tum akislar calisiyor
- [ ] Android'de tum akislar calisiyor
- [ ] Farkli ekran boyutlarinda test edildi
- [ ] Keyboard acik/kapali durumda sorun yok
- [ ] Arka plandan one gelme durumu ele alindi

### 9. Edge Cases

- [ ] Bos veri seti durumu ele alindi (empty state)
- [ ] Cok buyuk veri seti durumu test edildi
- [ ] Concurrent request durumu ele alindi
- [ ] Cift tiklama korunmasi var
- [ ] Hizli navigasyon durumunda sorun yok

### 10. E2E Test

- [ ] Kritik kullanici akislari icin E2E test yazildi
- [ ] Happy path senaryolari test edildi
- [ ] Hata senaryolari test edildi
- [ ] Tum testler gecti

## Inceleme Sonucu

| Sonuc | Aciklama |
|-------|----------|
| **GECTI** | Tum kriterler karsilandi, release adimina gecilebilir |
| **KOSULLU GECTI** | Minor sorunlar var, release oncesi duzeltilmeli |
| **KALDI** | Kritik sorunlar var, entegrasyon yeniden yapilmali |

### Inceleme Kaydi

```
Tarih: {YYYY-AA-GG}
Inceleyen: {Ajan/kisi adi}
Sonuc: GECTI / KOSULLU GECTI / KALDI
Notlar: {Varsa duzeltme gereken noktalar}
```

## Referanslar

- API standartlari: `../../templates/backend/api-standards.md`
- Frontend standartlari: `../../templates/frontend/component-standards.md`
- Auth stratejisi: `../../templates/backend/auth-strategy.md`
- Release hazirlik kapisi: `release-readiness-gate.md`

---

*Bu kalite kapisi, her entegrasyon fazinda Team Lead tarafindan uygulanir.*
