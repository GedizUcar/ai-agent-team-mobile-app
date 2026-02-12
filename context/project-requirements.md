# Proje Gereksinimleri - Product Requirements Document (PRD)

Bu belge, Stilora mobil uygulamasinin urun gereksinimlerini tanimlar. Her ozellik gelistirme sureci bu belgeden beslenir.

## Proje Bilgileri

| Alan | Deger |
|------|-------|
| **Proje Adi** | Stilora |
| **Tanim** | Modern minimalist moda e-ticaret mobil uygulamasi |
| **Model** | Tek satici magaza (single brand store) |
| **Kategori** | Moda / Giyim (kiyafet, aksesuar, ayakkabi) |
| **Platform** | iOS, Android (React Native) |
| **Hedef Kitle** | B2C - bireysel kullanicilar |
| **Arayuz Dili** | Ingilizce |
| **Proje Turu** | Kisisel proje / Portfolio |
| **Baslangic Tarihi** | 2026-02-09 |
| **Hedef MVP Release** | - |

## Vizyon ve Hedefler

### Vizyon
Stilora, modern ve minimalist bir alisveris deneyimi sunan tek markali moda e-ticaret uygulamasidir. Urun odakli temiz tasarimi, hizli performansi ve sorunsuz alisveris akisiyla one cikar.

### Temel Hedefler
1. Temiz ve hizli bir alisveris deneyimi sunmak
2. Modern mobil uygulama gelistirme pratiklerini showcase etmek (portfolio)
3. End-to-end bir e-ticaret akisi olusturmak (auth → urun → sepet → siparis)

### Basari Metrikleri
| Metrik | Hedef | Olcum Yontemi |
|--------|-------|---------------|
| Uygulama baslatma suresi | < 3 saniye | Cold start olcumu |
| Siparis tamamlama akisi | < 5 adim | Kullanici akis analizi |
| Test coverage | > %70 | Jest coverage raporu |
| Lighthouse/performans skoru | > 90 | Performance monitoring |

## Kullanici Profilleri (Personas)

### Persona 1: Ayşe - Trend Takipcisi
- **Yas**: 22-30
- **Meslek**: Universite ogrencisi / genc profesyonel
- **Teknoloji Becerisi**: Yuksek
- **Motivasyonu**: Trend urunleri hizlica bulmak ve satin almak
- **Sikinti Noktalari**: Karisik arayuzler, yavas yuklenen sayfalar, karmasik odeme surecleri

### Persona 2: Mehmet - Pratik Alısverişçi
- **Yas**: 28-40
- **Meslek**: Calissan profesyonel
- **Teknoloji Becerisi**: Orta
- **Motivasyonu**: Ihtiyaci olan urunleri hizli ve kolay sekilde satin almak
- **Sikinti Noktalari**: Cok fazla adim gerektiren alisveris surecleri, karmasik navigasyon

## Ozellik Gruplari

### MVP (Minimum Viable Product)

Ilk surumde olmazsa olmaz ozellikler:

| # | Ozellik | Oncelik | Durum |
|---|---------|---------|-------|
| F-001 | Kullanici kayit ve giris (email/sifre) | P0 | Planlanmis |
| F-002 | Kullanici profil yonetimi | P0 | Planlanmis |
| F-003 | Urun listeleme (kategori bazli grid) | P0 | Planlanmis |
| F-004 | Urun detay sayfasi (foto, beden, renk, fiyat) | P0 | Planlanmis |
| F-005 | Alisveris sepeti | P0 | Planlanmis |
| F-006 | Siparis olusturma (adres + onay) | P0 | Planlanmis |
| F-007 | Ana sayfa (one cikan urunler, kategoriler) | P0 | Planlanmis |
| F-008 | Dark mode destegi | P0 | Planlanmis |

### Post-MVP (v1.1)

| # | Ozellik | Oncelik | Hedef Surum |
|---|---------|---------|-------------|
| F-010 | Push bildirimler (kampanya, siparis durumu) | P1 | v1.1 |
| F-011 | Sosyal medya urun paylasimi | P1 | v1.1 |
| F-012 | Urun arama ve filtreleme | P1 | v1.1 |
| F-013 | Favoriler / Istek listesi | P1 | v1.1 |
| F-014 | Siparis takibi | P1 | v1.1 |

### Post-MVP (v1.2+)

| # | Ozellik | Oncelik | Hedef Surum |
|---|---------|---------|-------------|
| F-020 | Google / Apple ile giris (OAuth) | P2 | v1.2 |
| F-021 | Urun degerlendirme ve yorum | P2 | v1.2 |
| F-022 | Odeme entegrasyonu (Stripe/iyzico) | P2 | v1.2 |
| F-023 | Adres yonetimi (birden fazla adres) | P2 | v1.2 |
| F-024 | Kupon / indirim kodu | P3 | v2.0 |

### Oncelik Tanimlari

| Seviye | Anlami |
|--------|--------|
| **P0** | MVP icin zorunlu, release engelleyici |
| **P1** | Onemli, MVP sonrasi ilk iterasyonda |
| **P2** | Arzu edilen, kaynak durumuna bagli |
| **P3** | Gelecekte degerlendirilebilir |

## MVP Ekran Listesi

| # | Ekran | Aciklama |
|---|-------|----------|
| S-001 | Splash / Onboarding | Uygulama acilis ekrani |
| S-002 | Login | Email + sifre ile giris |
| S-003 | Register | Kayit formu |
| S-004 | Forgot Password | Sifre sifirlama |
| S-005 | Home | One cikan urunler, kategoriler, banner |
| S-006 | Product List | Kategori bazli urun grid |
| S-007 | Product Detail | Urun detay (foto galeri, beden, renk, fiyat) |
| S-008 | Cart | Sepet ozeti, miktar, toplam |
| S-009 | Checkout | Adres + siparis ozeti + onay |
| S-010 | Order Confirmation | Siparis basari ekrani |
| S-011 | Profile | Hesap bilgileri, siparislerim |
| S-012 | Settings | Tema (dark mode), bildirimler, cikis |

## Tasarim Yonelimi

- **Stil**: Modern minimalist
- **Odak**: Urun gorselleri on planda, temiz beyaz alan
- **Renk**: Mevcut design token sistemi kullanilacak (primary: #2196F3)
- **Tipografi**: Inter (UI) - temiz ve okunaklı
- **Dark Mode**: Tam destek (light/dark/system)
- **Animasyonlar**: Subtle, performans odakli (60 FPS)

## Fonksiyonel Olmayan Gereksinimler

### Performans
- API response suresi (p95): < 200ms
- Uygulama baslatma suresi: < 3 saniye
- Bundle boyutu: < 10 MB
- Animasyonlar: >= 60 FPS

### Guvenlik
- JWT tabanli kimlik dogrulama
- HTTPS zorunlu
- Hassas veri sifreleme
- OWASP Mobile Top 10 uyumu

### Erisebilirlik
- WCAG AA uyumu
- Touch target: min 44x44px
- Renk kontrasti: min 4.5:1
- Screen reader destegi

### Olceklenebilirlik
- Yatay olceklenebilir backend
- CDN ile statik icerik dagitimi
- Database connection pooling

## Teknik Kisitlamalar

Detayli teknik kisitlamalar icin bkz: `technical-constraints.md`

## Ilgili Belgeler

- Kullanici hikayeleri: `user-stories.md`
- Ozellik detaylari: `feature-specs/`
- Teknik kisitlamalar: `technical-constraints.md`
- Terimler sozlugu: `glossary.md`

---

*Bu belge, proje boyunca guncellenir. Degisiklikler icin insan gelistirici onayi gereklidir.*
