# Ajan Durumu - Agent Status

Bu belge, tum ajanlarin guncel durumunu ve musaitligini gosterir.

---

## Durum Tablosu

| Ajan | Durum | Mevcut Gorev | Son Guncelleme |
|------|-------|-------------|----------------|
| **Team Lead** | Aktif | Sprint 5 kalite kontrol | 2026-02-14 |
| **Designer** | Musait | - | 2026-02-14 |
| **Frontend** | Musait | Sprint 5 gorevleri tamamlandi | 2026-02-14 |
| **Backend** | Musait | Sprint 5 gorevleri tamamlandi | 2026-02-14 |

---

## Durum Tanimlari

| Durum | Anlami | Renk |
|-------|--------|------|
| **Aktif** | Suanda bir gorev uzerinde calisiyor | Yesil |
| **Musait** | Gorev almaya hazir | Mavi |
| **Beklemede** | Bir bagimlılik veya onay bekliyor | Sari |
| **Engellendi** | Bir sorun nedeniyle ilerleyemiyor | Kirmizi |

---

## Ajan Detaylari

### Team Lead

- **Rol**: Koordinasyon, kalite kontrol, gorev atamasi
- **Durum**: Aktif
- **Mevcut Gorev**: Tum ajanlari koordine etme
- **Musaitlik**: Her zaman (koordinasyon rolu)
- **Tamamlanan Isler**: Proje iskeleti, ajan kurulumlari
- **Sonraki Beklenen Is**: Ilk sprint planlama

### Designer

- **Rol**: UI/UX tasarim, wireframe, mockup
- **Durum**: Musait
- **Mevcut Gorev**: -
- **Musaitlik**: Gorev almaya hazir
- **Tamamlanan Isler**: Tasarim tokenlari, wireframe standartlari, komponent sablonlari
- **Sonraki Beklenen Is**: Ilk ozellik icin wireframe/mockup

### Frontend

- **Rol**: React Native UI gelistirme
- **Durum**: Musait
- **Mevcut Gorev**: -
- **Musaitlik**: Gorev almaya hazir
- **Tamamlanan Isler**: Komponent standartlari, state yonetimi, teknoloji kararlari
- **Sonraki Beklenen Is**: Proje iskeleti olusturma (scaffolding)

### Backend

- **Rol**: API ve veritabani gelistirme
- **Durum**: Musait
- **Mevcut Gorev**: -
- **Musaitlik**: Gorev almaya hazir
- **Tamamlanan Isler**: API standartlari, DB standartlari, auth stratejisi
- **Sonraki Beklenen Is**: Proje iskeleti olusturma (scaffolding)

---

## Guncelleme Kurallari

1. **Gorev basinda**: Ajan durumunu "Aktif" yap, mevcut gorevi yaz
2. **Gorev bitisinde**: Ajan durumunu "Musait" yap, tamamlanan isleri guncelle
3. **Engel durumunda**: Ajan durumunu "Engellendi" yap, nedenini yaz
4. **Gun sonunda**: Team Lead tum durumları kontrol eder

## Referanslar

- Gorev panosu: `task-board.md`
- Gunluk is akisi: `daily-workflow.md`
- Sprint planlama: `sprint-planning.md`

---

*Bu dosya, her gorev degisikliginde guncellenir.*
