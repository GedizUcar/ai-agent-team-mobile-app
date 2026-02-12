# Karar Kaydi Indeksi - Decision Log (ADR Index)

Bu belge, projede alinan tum mimari ve teknik kararlarin indeksini tutar. Her kararin detayi icin ilgili ADR belgesine basvurun.

## Karar Sablon Kullanimi

Yeni karar eklemek icin: `../communication/decision-log-template.md` sablonunu kullanin.

---

## Karar Listesi

| ADR # | Baslik | Tarih | Durum | Karar Veren |
|-------|--------|-------|-------|-------------|
| ADR-001 | Frontend framework secimi: React Native | - | Kabul Edildi | Team Lead |
| ADR-002 | Auth stratejisi: JWT (RS256) | - | Kabul Edildi | Team Lead |
| ADR-003 | State yonetimi: Zustand + React Query | - | Kabul Edildi | Team Lead |
| ADR-004 | Uygulama konsepti: Stilora moda e-ticaret | 2026-02-09 | Kabul Edildi | Team Lead + Insan Gelistirici |
| ADR-005 | E-ticaret modeli: Tek satici magaza | 2026-02-09 | Kabul Edildi | Team Lead + Insan Gelistirici |
| ADR-006 | Tasarim yaklaşimi: Modern minimalist | 2026-02-09 | Kabul Edildi | Team Lead + Insan Gelistirici |

---

## ADR-001: Frontend Framework Secimi

**Tarih**: Proje baslangici
**Durum**: Kabul Edildi
**Karar Veren**: Team Lead
**Ilgili Ajanlar**: Frontend, Designer

### Karar
Frontend gelistirme icin **React Native** kullanilacak.

### Alternatifler

| Alternatif | Artilari | Eksileri |
|------------|----------|----------|
| React Native | Tek kod tabani, genis ekosistem, hot reload | Native performans farki |
| Flutter | Yuksek performans, guzel UI | Dart dili, daha kucuk ekosistem |
| Native (Swift/Kotlin) | En iyi performans | Ayri kod tabani, iki kat efor |

### Gerekce
- JavaScript/TypeScript ekosistemi ile backend uyumu
- Genis topluluk ve kutuphane destegi
- Tek kod tabani ile iOS ve Android destegi
- Hot reload ile hizli gelistirme deneyimi

### Referans
Detaylar: `../../templates/frontend/technology-decision.md`

---

## ADR-002: Authentication Stratejisi

**Tarih**: Proje baslangici
**Durum**: Kabul Edildi
**Karar Veren**: Team Lead
**Ilgili Ajanlar**: Backend, Frontend

### Karar
Kimlik dogrulama icin **JWT (RS256)** tabanli token sistemi kullanilacak. Access token 1 saat, refresh token 14 gun gecerli.

### Alternatifler

| Alternatif | Artilari | Eksileri |
|------------|----------|----------|
| JWT | Stateless, olceklenebilir, mobile-friendly | Token iptal zorlugu |
| Session-based | Basit iptal, sunucu kontrolu | Stateful, olceklenme zorlu |
| OAuth2 only | Standart, genis destek | Karmasik implementasyon |

### Gerekce
- Stateless yapisi load balancing ile uyumlu
- Mobil uygulamalar icin cookie gerektirmez
- RS256 ile guvenli imzalama
- Refresh token ile kullanici deneyimi (surekli giris gerekmez)

### Referans
Detaylar: `../../templates/backend/auth-strategy.md`

---

## ADR-003: State Yonetimi Stratejisi

**Tarih**: Proje baslangici
**Durum**: Kabul Edildi
**Karar Veren**: Team Lead
**Ilgili Ajanlar**: Frontend

### Karar
- **Global client state**: Zustand (AsyncStorage persist ile)
- **Server/async state**: React Query / TanStack Query
- **Form state**: React Hook Form
- **UI state**: useState

### Alternatifler

| Alternatif | Artilari | Eksileri |
|------------|----------|----------|
| Zustand + React Query | Hafif, basit, ayrilmis sorumluluk | Iki kutuphane ogrenmek |
| Redux + RTK Query | Guclu ekosistem, tek cozum | Boilerplate fazla, karmasik |
| MobX | Reaktif, basit | Proxy tabanli, debug zor |
| Context API | Dahili, ekstra bagimlılık yok | Re-render sorunu, performans |

### Gerekce
- Zustand: ~1KB, minimal boilerplate, AsyncStorage persist middleware
- React Query: Cache, background refetch, pagination, optimistic update
- Farkli state turleri icin farkli araçlar (separation of concerns)
- TypeScript ile dogal entegrasyon

### Referans
Detaylar: `../../templates/frontend/state-management.md`

---

## ADR-004: Uygulama Konsepti

**Tarih**: 2026-02-09
**Durum**: Kabul Edildi
**Karar Veren**: Team Lead + Insan Gelistirici
**Ilgili Ajanlar**: Tum ajanlar

### Karar
Uygulama **Stilora** adinda, **moda / giyim** alaninda bir **e-ticaret** uygulamasi olacak. Hedef kitle B2C bireysel kullanicilar. Arayuz dili Ingilizce.

### Alternatifler

| Alternatif | Artilari | Eksileri |
|------------|----------|----------|
| E-ticaret (moda) | Genis ozellik yelpazesi, portfolio icin gosterisli | Rekabetci alan |
| Saglik/Fitness | Niş pazar, geri donus yuksek | Daha dar kapsam |
| Egitim | Sosyal etki, talep artiyor | Farkli teknoloji gereksinimleri |
| Finans | Yuksek teknik derinlik | Regulasyon karmasikligi |

### Gerekce
- E-ticaret, end-to-end uygulama gelistirme pratiklerini en iyi gosteren alan
- Moda kategorisi gorsel tasarim agirlikli, portfolio icin etkileyici
- Auth, CRUD, sepet, siparis gibi temel mobile pattern'lerin hepsini kapsiyor
- Kisisel proje olarak olceklenebilir ve genisletilebilir

---

## ADR-005: E-ticaret Modeli

**Tarih**: 2026-02-09
**Durum**: Kabul Edildi
**Karar Veren**: Team Lead + Insan Gelistirici
**Ilgili Ajanlar**: Backend, Frontend

### Karar
**Tek satici magaza** (single brand store) modeli kullanilacak. Marketplace degil.

### Alternatifler

| Alternatif | Artilari | Eksileri |
|------------|----------|----------|
| Tek satici | Basit veri modeli, hizli gelistirme | Sinirli olcek |
| Marketplace | Genis olcek, cok satici | Karmasik yonetim, uzun gelistirme |
| Sosyal ticaret | Viral buyume | Ek sosyal ozellik gelistirme |
| Abonelik | Tekrarlayan gelir | Farkli is modeli, MVP'ye uygun degil |

### Gerekce
- MVP icin en hizli gelistirilebilir model
- Tek satici = tek urun katalogu, basit siparis akisi
- Marketplace karmasikligi kisisel proje kapsamini asarı
- Ileriki surumlerde marketplace'e genisletilebilir

---

## ADR-006: Tasarim Yaklaşimi

**Tarih**: 2026-02-09
**Durum**: Kabul Edildi
**Karar Veren**: Team Lead + Insan Gelistirici
**Ilgili Ajanlar**: Designer, Frontend

### Karar
**Modern minimalist** tasarim yaklaşimi kullanilacak. Urun gorselleri on planda, temiz beyaz alan, subtle animasyonlar. Dark mode tam destek.

### Alternatifler

| Alternatif | Artilari | Eksileri |
|------------|----------|----------|
| Modern minimalist | Temiz, profesyonel, moda ile uyumlu | Sade gorunebilir |
| Curetkar/Bold | Dikkat cekici, farkli | Moda icin agresif olabilir |
| Luks/Premium | Sofistike | Koyu tema baslangicta sinirlandirici |
| Renkli/Genc | Eglenceli | Profesyonel gorunumden uzak |

### Gerekce
- Minimalist tasarim, urun fotograflarini on plana cikarir (moda icin kritik)
- Temiz arayuz, kullanici deneyimini iyilestirir
- Portfolio sunumlarinda profesyonel gorunum
- Dark mode ile modern his

---

## Yeni Karar Ekleme

Yeni bir karar eklemek icin:

1. `../communication/decision-log-template.md` sablonunu kullanarak ADR yazin
2. ADR numarasi atanin (siradaki numara)
3. Bu dosyaya indeks girisini ekleyin
4. Team Lead onayi ile durumu "Kabul Edildi" yapin

---

*Bu indeks, tum mimari kararlar icin tek referans noktasidir. Her yeni karar eklendikce guncellenir.*
