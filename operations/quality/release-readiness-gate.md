# Release Hazirlik Kapisi - Release Readiness Gate

Bu kontrol listesi, uygulamanin bir surum olarak yayinlanmadan once tamamlanmasi gereken tum kriterleri icerir. Bu, kalite kapi zincirinin son halkasıdir.

## Kapsam

Bu kalite kapisi her release oncesinde uygulanir:
- Major release (v1.0, v2.0)
- Minor release (v1.1, v1.2)
- Patch release (v1.0.1, v1.0.2)
- Hotfix release

## Inceleme Sorumlusu

**Birincil**: Team Lead + Insan Gelistirici
**Onay**: Insan Gelistirici onayi zorunlu

---

## On Kosullar

Asagidaki kalite kapilari basariyla gecilmis olmalidir:

- [ ] **Tasarim inceleme kapisi** gecildi (`design-review-gate.md`)
- [ ] **Frontend inceleme kapisi** gecildi (`frontend-review-gate.md`)
- [ ] **Backend inceleme kapisi** gecildi (`backend-review-gate.md`)
- [ ] **Entegrasyon kapisi** gecildi (`integration-gate.md`)

---

## Kontrol Listesi

### 1. Fonksiyonel Tamamlik

- [ ] Tum planlanan ozellikler gelistirildi
- [ ] Tum kullanici hikayeleri kabul kriterlerini karsilar
- [ ] Bilinen kritik bug yok
- [ ] Regresyon testi gecti
- [ ] Smoke test basarili

### 2. Kod Kalitesi

- [ ] Tum TypeScript hatalari cozuldu
- [ ] ESLint hata yok
- [ ] Kod review tamamlandi
- [ ] Teknik borc kabul edilebilir seviyede
- [ ] Debug/console kodlari kaldirildi
- [ ] .env dosyalari guvenli (production degerleri ayri)

### 3. Test Kapsamı

- [ ] Frontend unit test coverage > %70
- [ ] Backend unit test coverage > %70
- [ ] Integration testler gecti
- [ ] E2E testler gecti (kritik akislar)
- [ ] Manuel test tamamlandi
- [ ] Her platform test edildi (iOS + Android)

### 4. Performans

- [ ] API response (p95) < 200ms
- [ ] Database query (avg) < 50ms
- [ ] Frontend TTI < 3 saniye
- [ ] Animasyonlar >= 60 FPS
- [ ] Bundle boyutu < 10 MB
- [ ] Memory leak kontrolu yapildi

### 5. Guvenlik

- [ ] Guvenlik denetimi yapildi
- [ ] OWASP Mobile Top 10 kontrol edildi
- [ ] Hassas veri sifrelenmis
- [ ] API rate limiting aktif
- [ ] Auth token yonetimi guvenli
- [ ] Ucuncu parti kutuphane guvenlik taramasi yapildi

### 6. Erisebilirlik

- [ ] WCAG AA uyumu saglanmis
- [ ] Screen reader testi yapilmis
- [ ] Touch target >= 44x44px
- [ ] Renk kontrasti >= 4.5:1
- [ ] Keyboard navigation calisiyor (varsa)

### 7. Dokumantasyon

- [ ] API dokumantasyonu (Swagger) guncel
- [ ] README.md guncel
- [ ] CHANGELOG.md guncellendi
- [ ] Mimari karar kayitlari (ADR) tamamlandi
- [ ] Environment degiskenleri dokumante edildi

### 8. Deployment Hazırligi

- [ ] Build basariyla tamamlandi (iOS + Android)
- [ ] Environment konfigurasyonu dogru (production)
- [ ] Database migration'lar hazir
- [ ] Rollback plani mevcut
- [ ] Monitoring ve alerting kurulmus
- [ ] Health check endpoint aktif

### 9. App Store Hazırligi

- [ ] App Store/Play Store metadata hazir
- [ ] Uygulama ikonu ve splash screen hazir
- [ ] Ekran goruntuleri hazir
- [ ] Gizlilik politikasi ve kullanim sartlari hazir
- [ ] App Store review kurallarina uygun
- [ ] Versiyon numarasi ve build numarasi dogru

### 10. Iletisim

- [ ] Release notlari yazildi
- [ ] Takim bilgilendirildi
- [ ] Rollout plani belirlendi (kademeli/tam)
- [ ] Destek ekibi bilgilendirildi (varsa)

## Release Tipi Kontrol Matrisi

| Kontrol | Major | Minor | Patch | Hotfix |
|---------|-------|-------|-------|--------|
| Tam test suite | Zorunlu | Zorunlu | Opsiyonel | Opsiyonel |
| E2E test | Zorunlu | Zorunlu | Etkilenen alan | Etkilenen alan |
| Performans testi | Zorunlu | Opsiyonel | Hayir | Hayir |
| Guvenlik taramasi | Zorunlu | Zorunlu | Hayir | Zorunlu |
| App Store metadata | Zorunlu | Gerekirse | Hayir | Hayir |
| Insan onayi | Zorunlu | Zorunlu | Zorunlu | Zorunlu |

## Inceleme Sonucu

| Sonuc | Aciklama |
|-------|----------|
| **RELEASE ONAYLI** | Tum kriterler karsilandi, yayinlanabilir |
| **BEKLEMEDE** | Bazi kriterler eksik, tamamlaninca tekrar degerlendirilecek |
| **REDDEDILDI** | Kritik sorunlar var, release ertelendi |

### Inceleme Kaydi

```
Tarih: {YYYY-AA-GG}
Versiyon: {vX.Y.Z}
Inceleyen: {Team Lead + Insan Gelistirici}
Sonuc: RELEASE ONAYLI / BEKLEMEDE / REDDEDILDI
Notlar: {Varsa duzeltme gereken noktalar}
Planlanan Release Tarihi: {Tarih}
```

## Referanslar

- Release sureci: `../workflows/release.md`
- Deployment sureci: `../workflows/deployment.md`
- Versiyon politikasi: Semantic Versioning (SemVer)

---

*Bu kalite kapisi, her release oncesinde Team Lead ve Insan Gelistirici tarafindan birlikte degerlendirilir.*
