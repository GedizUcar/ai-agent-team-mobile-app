# Kilometre Tasi Takibi - Milestone Tracker (Stilora)

Bu belge, Stilora projesinin ust duzey kilometre taslarini ve ilerleme durumunu gosterir.

---

## Kilometre Taslari

### M0: Proje Altyapi Kurulumu
**Durum**: ✅ Tamamlandi
**Tamamlanma Tarihi**: 2026-02-09

**Kapsam:**
- [x] Proje iskeleti olusturma
- [x] Team Lead ajan kurulumu
- [x] Designer ajan kurulumu
- [x] Frontend ajan kurulumu ve standartlari
- [x] Backend ajan kurulumu ve standartlari
- [x] Tasarim tokenlari ve standartlari
- [x] API ve veritabani standartlari
- [x] Auth stratejisi
- [x] Operasyon merkezi kurulumu
- [x] Proje kesfi (Stilora - moda e-ticaret)
- [x] PRD ve kullanici hikayeleri

---

### M1: Proje Scaffolding (Iskele)
**Durum**: ✅ Tamamlandi
**Tamamlanma Tarihi**: 2026-02-09

**Kapsam:**
- [x] Frontend React Native projesi olusturma (TypeScript strict)
- [x] Backend Node.js/Express projesi olusturma
- [x] Veritabani kurulumu (PostgreSQL + Prisma schema)
- [x] Temel klasor yapilari (frontend src/, backend src/)
- [x] ESLint, Prettier, TypeScript konfigurasyonu
- [x] Temel navigasyon yapisi (Tab Navigator: Home, Products, Cart, Profile)
- [x] Dark mode tema altyapisi (light/dark/system)
- [x] Axios + React Query konfigurasyonu
- [x] Zustand store temelleri (auth, cart, settings)

**Bagimlıliklar**: M0 (Tamamlandi)

---

### M2: Authentication Sistemi
**Durum**: ✅ Tamamlandi
**Tamamlanma Tarihi**: 2026-02-11

**Kapsam:**
- [x] Auth ekranlari tasarimi (Login, Register, Forgot Password)
- [x] Auth API endpoint'leri (register, login, logout, refresh, forgot/reset password)
- [x] User veritabani modeli (Prisma) - lockout ve reset token alanlari eklendi
- [x] JWT middleware ve token yonetimi
- [x] Auth ekranlari frontend implementasyonu
- [x] Auth state yonetimi (Zustand + AsyncStorage persist)
- [x] Token yenileme (Axios interceptor)
- [x] Guvenlik onlemleri (hesap kilitleme: 5 basarisiz deneme -> 30 dk kilit, token rotation)
- [ ] Auth akisi E2E testi (gelecek sprint'e ertelendi)

**Bagimlıliklar**: M1 (Tamamlandi)
**Ilgili Hikayeler**: US-001, US-002, US-003, US-004, US-005

---

### M3: Urun Katalogu
**Durum**: ⏳ Planlanmis
**Hedef Tarih**: -

**Kapsam:**
- [ ] Home ekrani tasarimi (banner, kategoriler, featured products)
- [ ] Product veritabani modelleri (Product, Category, ProductImage, ProductVariant)
- [ ] Urun API endpoint'leri (list, detail, categories, home aggregation)
- [ ] Home ekrani frontend implementasyonu
- [ ] Product List ekrani (kategori bazli grid, infinite scroll)
- [ ] Product Detail ekrani (foto galeri, beden/renk secimi)
- [ ] Mock/seed data olusturma (moda urunleri)

**Bagimlıliklar**: M2
**Ilgili Hikayeler**: US-020, US-030, US-040

---

### M4: Sepet ve Siparis
**Durum**: ⏳ Planlanmis
**Hedef Tarih**: -

**Kapsam:**
- [ ] Cart ve Order veritabani modelleri
- [ ] Cart API endpoint'leri (get, add item, update quantity, remove item)
- [ ] Order API endpoint'leri (create, list, detail)
- [ ] Sepete ekleme islevi (Product Detail → Cart)
- [ ] Cart ekrani (liste, miktar guncelleme, silme, toplam)
- [ ] Checkout ekrani (adres formu + siparis ozeti)
- [ ] Order Confirmation ekrani
- [ ] Cart badge (Tab bar'da adet gostergesi)

**Bagimlıliklar**: M3
**Ilgili Hikayeler**: US-041, US-050, US-051, US-060, US-061

---

### M5: Profil, Ayarlar ve Dark Mode
**Durum**: ⏳ Planlanmis
**Hedef Tarih**: -

**Kapsam:**
- [ ] Profile ekrani (kullanici bilgileri + siparis gecmisi)
- [ ] Profile edit ekrani
- [ ] Settings ekrani (tema, bildirimler, cikis)
- [ ] Dark mode tam implementasyon (tum ekranlar)
- [ ] Siparis gecmisi listeleme

**Bagimlıliklar**: M4
**Ilgili Hikayeler**: US-010, US-011, US-070

---

### M-Release: Stilora MVP Release (v1.0.0)
**Durum**: ⏳ Planlanmis
**Hedef Tarih**: -

**On Kosullar:**
- [x] M1 tamamlandi (Scaffolding)
- [ ] M2 tamamlandi (Auth)
- [ ] M3 tamamlandi (Urun Katalogu)
- [ ] M4 tamamlandi (Sepet ve Siparis)
- [ ] M5 tamamlandi (Profil ve Ayarlar)
- [ ] Tum kalite kapilari gecildi
- [ ] Release hazirlik kapisi gecildi
- [ ] Full regression test
- [ ] App Store / Play Store hazirligi (opsiyonel, portfolio icin gerekli degil)

---

## Durum Ikonlari

| Ikon | Anlami |
|------|--------|
| ✅ | Tamamlandi |
| 🔄 | Devam Ediyor |
| ⏳ | Planlanmis |
| ⚠️ | Risk Altinda |
| ❌ | Iptal Edildi |

## Ilerleme Ozeti

| Kilometre Tasi | Durum | Ilerleme |
|----------------|-------|----------|
| M0: Altyapi + Kesif | ✅ Tamamlandi | %100 |
| M1: Scaffolding | ✅ Tamamlandi | %100 |
| M2: Auth | ✅ Tamamlandi | %100 |
| M3: Urun Katalogu | ⏳ Planlanmis | %0 |
| M4: Sepet ve Siparis | ⏳ Planlanmis | %0 |
| M5: Profil ve Ayarlar | ⏳ Planlanmis | %0 |
| MVP Release (v1.0.0) | ⏳ Planlanmis | %0 |

---

*Bu belge, her kilometre tasi tamamlandiginda veya durumu degistiginde guncellenir.*
