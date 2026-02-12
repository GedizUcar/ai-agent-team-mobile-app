# Ozellik Gelistirme Is Akisi - Feature Development Workflow

Bu belge, yeni bir ozelligin basindan sonuna kadar gelistirme surecini tanimlar.

## Genel Bakis

```
Planlama → Tasarim → Backend → Frontend → Entegrasyon → Test → Release
   |          |         |          |           |          |       |
 Team Lead  Designer  Backend   Frontend   Frontend   Tum    Team Lead
                                          + Backend  Ajanlar
```

Her faz arasinda **kalite kapisi** vardir. Kalite kapisi gecilmeden bir sonraki faza gecilemez.

---

## Faz 0: Planlama

**Sorumlu**: Team Lead
**Girdi**: Kullanici hikayesi (`context/user-stories.md`)
**Cikti**: Ozellik spesifikasyonu (`context/feature-specs/`)

### Adimlar

1. Kullanici hikayesini degerlendir
2. Ozellik spesifikasyonu olustur (`context/feature-specs/feature-spec-template.md`)
3. Kabul kriterlerini belirle
4. Bagimlılıklari tanimla
5. Ajan gorev atamasini yap
6. `hub/task-board.md`'ye gorevleri ekle

### Insan Onayi Gereken Noktalar

- [ ] Ozellik kapsaminin onayi
- [ ] Oncelik belirleme
- [ ] Sprint planina dahil etme

---

## Faz 1: Tasarim

**Sorumlu**: Designer
**Girdi**: Ozellik spesifikasyonu
**Cikti**: Wireframe, mockup, komponent spesifikasyonlari

### Adimlar

1. Ozellik spesifikasyonunu oku
2. Kullanici akisini tasarla
3. Wireframe olustur
4. Mockup olustur (detayli gorsel tasarim)
5. Komponent spesifikasyonlarini yaz
6. Responsive varyantlari hazirla
7. Animasyon spesifikasyonlarini tanimla

### Teslimat

Teslimat formatı icin bkz: `../communication/handoff-protocols.md` (Designer → Frontend)

### Kalite Kapisi

**Uygulanacak**: `../quality/design-review-gate.md`

| Kontrol | Inceleyen |
|---------|-----------|
| Tasarim sistemi uyumu | Team Lead |
| Erisebilirlik | Team Lead |
| UX tutarliligi | Team Lead |
| Kritik ekranlar | Insan Gelistirici |

---

## Faz 2: Backend Gelistirme

**Sorumlu**: Backend
**Girdi**: Ozellik spesifikasyonu (API gereksinimleri, veri modeli)
**Cikti**: API endpoint'leri, veritabani sema, dokumantasyon

### Adimlar

1. Ozellik spesifikasyonundaki API gereksinimlerini oku
2. Veritabani semasini tasarla / guncelle
3. Migration olustur
4. API endpoint'lerini implement et
   - Route tanimlari
   - Validation (Zod)
   - Controller → Service → Repository
5. Authentication/Authorization uygula
6. Hata yonetimini implement et
7. Rate limiting uygula
8. Unit testler yaz
9. Integration testler yaz
10. API dokumantasyonunu guncelle (Swagger)

### Teslimat

Teslimat formati icin bkz: `../communication/handoff-protocols.md` (Backend → Frontend)

### Kalite Kapisi

**Uygulanacak**: `../quality/backend-review-gate.md`

| Kontrol | Inceleyen |
|---------|-----------|
| API standartlari | Team Lead |
| Veritabani tasarimi | Team Lead |
| Guvenlik | Team Lead + Insan Gelistirici |
| Performans | Team Lead |

---

## Faz 3: Frontend Gelistirme

**Sorumlu**: Frontend
**Girdi**: Tasarim teslimatlari + Backend API dokumantasyonu
**Cikti**: UI komponentleri, ekranlar, state yonetimi, API entegrasyonu

### Adimlar

1. Designer'in teslimat paketini incele
2. Backend API dokumantasyonunu oku
3. Komponent yapısını planla
4. UI komponentlerini implement et
   - Dosya yapisi standartlarina uygun
   - Design token'lari kullan
   - Accessibility props ekle
5. State yonetimini kur
   - UI state: useState
   - Form state: React Hook Form
   - Global state: Zustand
   - Server state: React Query
6. API entegrasyonunu yap (Axios + React Query)
7. Navigasyonu konfigure et
8. Hata yonetimini implement et (error boundaries, retry)
9. Loading/empty state'leri ekle
10. Unit testler yaz

### Kalite Kapisi

**Uygulanacak**: `../quality/frontend-review-gate.md`

| Kontrol | Inceleyen |
|---------|-----------|
| Tasarima uygunluk | Team Lead |
| Kod kalitesi | Team Lead |
| Performans | Team Lead |
| Erisebilirlik | Team Lead |
| Platform uyumu | Team Lead |

---

## Faz 4: Entegrasyon

**Sorumlu**: Frontend + Backend
**Girdi**: Frontend UI + Backend API
**Cikti**: Uc uca calisan ozellik

### Adimlar

1. Frontend'in API cagrilarini dogrula
2. Authentication akisini test et
3. CRUD islemlerini test et
4. Hata senaryolarini test et
5. Loading state'leri kontrol et
6. Edge case'leri test et
7. Platform bazli test (iOS + Android)
8. E2E test yaz

### Kalite Kapisi

**Uygulanacak**: `../quality/integration-gate.md`

| Kontrol | Inceleyen |
|---------|-----------|
| API entegrasyonu | Team Lead |
| Auth akisi | Team Lead |
| Veri tutarliligi | Team Lead |
| Hata yonetimi | Team Lead |
| Performans | Team Lead |

---

## Faz 5: Test ve Duzeltme

**Sorumlu**: Tum ajanlar
**Girdi**: Entegre edilmis ozellik
**Cikti**: Test edilmis, hatasiz ozellik

### Adimlar

1. Manuel test (tum ekranlar ve akislar)
2. Regresyon testi (mevcut ozelliklere etki)
3. Performans testi
4. Erisebilirlik testi
5. Bulunan hatalari duzelt (bkz: `bug-fix.md`)
6. Hata duzeltmelerini tekrar test et

---

## Faz 6: Release Hazirlik

**Sorumlu**: Team Lead + Insan Gelistirici

### Kalite Kapisi

**Uygulanacak**: `../quality/release-readiness-gate.md`

Release sureci icin bkz: `release.md`

---

## Ilerleme Takibi

Her faz gecisinde asagidaki guncellenmeler yapilir:

1. `hub/task-board.md` → Gorev durumu guncellenir
2. `tracking/sprint-log.md` → Aktivite kaydedilir
3. `hub/agent-status.md` → Ajan durumu guncellenir

## Referanslar

- Teslimat protokolleri: `../communication/handoff-protocols.md`
- Yukseltme yollari: `../communication/escalation-paths.md`
- Kalite kapilari: `../quality/`
- Gorev panosu: `../hub/task-board.md`
- Ozellik spesifikasyonu sablonu: `../../context/feature-specs/feature-spec-template.md`

---

*Bu is akisi, her yeni ozellik gelistirmede basindan sonuna kadar takip edilir.*
