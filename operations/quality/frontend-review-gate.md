# Frontend Inceleme Kapisi - Frontend Review Gate

Bu kontrol listesi, Frontend ajaninin ciktilari bir sonraki faza (entegrasyon veya release) gecmeden once tamamlanmasi gereken kriterleri icerir.

## Kapsam

Bu kalite kapisi asagidaki teslimatlar icin uygulanir:
- Komponent implementasyonlari
- Ekran gelistirmeleri
- State yonetimi degisiklikleri
- Navigasyon degisiklikleri
- Stil ve tema uygulamalari

## Inceleme Sorumlusu

**Birincil**: Team Lead
**Ikincil**: Insan Gelistirici (mimari kararlar icin)

---

## Kontrol Listesi

### 1. Kod Kalitesi

- [ ] TypeScript strict mode hatasiz
- [ ] ESLint hata ve uyari yok
- [ ] Prettier ile formatlanmis
- [ ] Kullanilmayan import/degisken yok
- [ ] console.log/debug kodu kaldirilmis
- [ ] Anlamli degisken ve fonksiyon isimleri

### 2. Komponent Standartlari

- [ ] Dosya yapisi standarda uygun (`ComponentName/` dizin yapisi)
- [ ] `index.ts` export dosyasi mevcut
- [ ] Props interface'i `.types.ts` dosyasinda tanimli
- [ ] Stiller `.styles.ts` dosyasinda ayri
- [ ] `memo()` uygulanmis (gerekli ise)
- [ ] `testID` prop'u mevcut
- [ ] `displayName` tanimli

### 3. Tasarima Uygunluk

- [ ] Pixel-perfect uygulama (tolerans: 2px)
- [ ] Design token degerleri kullanilmis (hardcoded deger yok)
- [ ] Dogru font ailesi, boyut ve agirlik
- [ ] Dogru renk kodlari
- [ ] Dogru bosluk (spacing) degerleri
- [ ] Animasyonlar spesifikasyona uygun

### 4. State Yonetimi

- [ ] UI state: `useState` kullanilmis
- [ ] Form state: React Hook Form kullanilmis
- [ ] Global state: Zustand kullanilmis
- [ ] Server state: React Query kullanilmis
- [ ] Gereksiz re-render yok
- [ ] State normalizasyonu uygun

### 5. Performans

- [ ] Animasyonlar >= 60 FPS
- [ ] Gereksiz re-render kontrolu yapilmis
- [ ] useCallback/useMemo uygun kullanilmis
- [ ] Buyuk listeler FlatList/VirtualizedList ile
- [ ] Image'lar optimize edilmis
- [ ] Lazy loading uygulanmis (gerekli ise)
- [ ] Bundle boyutuna etkisi kontrol edilmis

### 6. Erisebilirlik (Accessibility)

- [ ] `accessibilityLabel` eklenmis (etkilesimli elemanlar)
- [ ] `accessibilityHint` eklenmis (belirsiz eylemler icin)
- [ ] `accessibilityRole` dogru tanimlanmis
- [ ] `accessibilityState` uygulanmis (disabled, selected, vb.)
- [ ] Touch target >= 44x44px
- [ ] Screen reader ile test edilmis

### 7. Hata Yonetimi

- [ ] API hatalari kullaniciya gosteriliyor
- [ ] Loading state uygulanmis
- [ ] Empty state uygulanmis
- [ ] Error boundary mevcut
- [ ] Retry mekanizmasi var (API hatalarinda)
- [ ] Network offline durumu ele alinmis

### 8. Platform Uyumu

- [ ] iOS'ta dogru gorunuyor
- [ ] Android'de dogru gorunuyor
- [ ] SafeArea kullanilmis
- [ ] Keyboard-aware scroll uygulanmis
- [ ] Platform-spesifik farklar ele alinmis

### 9. Test

- [ ] Unit testler yazilmis (coverage > %70)
- [ ] Render testleri mevcut
- [ ] Etkilesim testleri mevcut (press, input)
- [ ] Edge case testleri mevcut
- [ ] E2E test senaryolari tanimli (kritik akislar)

### 10. Navigasyon

- [ ] Dogru ekrana yonlendirme yapiliyor
- [ ] Geri navigasyon calisiyor
- [ ] Deep link destegi (gerekli ise)
- [ ] Tab bar durumu dogru
- [ ] Gecis animasyonlari uygun

## Inceleme Sonucu

| Sonuc | Aciklama |
|-------|----------|
| **GECTI** | Tum kriterler karsilandi, entegrasyon/release icin hazir |
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

- Komponent standartlari: `../../templates/frontend/component-standards.md`
- State yonetimi: `../../templates/frontend/state-management.md`
- Teknoloji kararlari: `../../templates/frontend/technology-decision.md`
- Tasarim tokenlari: `../../templates/design/design-tokens.md`
- Handoff protokolu: `../communication/handoff-protocols.md`

---

*Bu kalite kapisi, her frontend teslimatinda Team Lead tarafindan uygulanir.*
