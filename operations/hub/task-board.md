# Gorev Panosu - Task Board (Kanban)

Bu belge, tum aktif gorevlerin durumunu takip eder. Her gorev baslangicinda ve bitisinde guncellenir.

---

## Aktif Sprint: Sprint 2

**Sprint Hedefi**: M2 - Authentication Sistemi
**Tarih Araligi**: 2026-02-11

---

## Backlog (Bekleyen)

Henuz sprint'e alinmamis gorevler.

| ID | Gorev | Tur | Oncelik | Atanan | Hikaye |
|----|-------|-----|---------|--------|--------|
| | | | | | |

---

## Planlanmis (To Do)

Bu sprint icinde yapilacak, henuz baslanmamis gorevler.

| ID | Gorev | Tur | Oncelik | Atanan | Hikaye |
|----|-------|-----|---------|--------|--------|
| | | | | | |

---

## Yapiliyor (In Progress)

Su anda aktif olarak calisilan gorevler.

| ID | Gorev | Tur | Atanan | Baslama | Notlar |
|----|-------|-----|--------|---------|--------|
| | | | | | |

---

## Inceleniyor (In Review)

Tamamlandi, kalite kapisi incelemesi bekleniyor.

| ID | Gorev | Tur | Teslim Eden | Inceleyen | Kalite Kapisi |
|----|-------|-----|-------------|-----------|---------------|
| | | | | | |

---

## Onay Bekliyor (Awaiting Approval)

Insan gelistirici onayi bekleniyor.

| ID | Gorev | Tur | Onay Gereken Konu | Tarih |
|----|-------|-----|-------------------|-------|
| | | | | |

---

## Tamamlandi (Done)

Bu sprintte tamamlanan gorevler.

| ID | Gorev | Tur | Tamamlayan | Tarih | Sprint |
|----|-------|-----|-----------|-------|--------|
| T-001 | Backend projesi kurulumu (Express + TS + ESLint) | TASK | Backend | 2026-02-09 | Sprint 1 |
| T-002 | Prisma schema + temel DB modelleri | TASK | Backend | 2026-02-09 | Sprint 1 |
| T-003 | Frontend RN projesi + TypeScript + ESLint/Prettier | TASK | Frontend | 2026-02-09 | Sprint 1 |
| T-004 | Tab Navigator kurulumu (Home, Products, Cart, Profile) | TASK | Frontend | 2026-02-09 | Sprint 1 |
| T-005 | Dark mode tema altyapisi (light/dark/system) | TASK | Frontend | 2026-02-09 | Sprint 1 |
| T-006 | Zustand store temelleri (auth, cart, settings) | TASK | Frontend | 2026-02-09 | Sprint 1 |
| T-007 | Axios + React Query konfigurasyonu | TASK | Frontend | 2026-02-09 | Sprint 1 |
| T-008 | JWT utilities + password hashing + auth middleware | TASK | Backend | 2026-02-11 | Sprint 2 |
| T-009 | Auth Zod validation schemalari | TASK | Backend | 2026-02-11 | Sprint 2 |
| T-010 | Auth service (register, login, logout, refresh, forgot/reset pw) | TASK | Backend | 2026-02-11 | Sprint 2 |
| T-011 | Auth controller + routes (7 endpoint) | TASK | Backend | 2026-02-11 | Sprint 2 |
| T-012 | AuthNavigator + RootNavigator (auth/main switch) | TASK | Frontend | 2026-02-11 | Sprint 2 |
| T-013 | Input ve Button reusable komponentleri | TASK | Frontend | 2026-02-11 | Sprint 2 |
| T-014 | Auth API service fonksiyonlari | TASK | Frontend | 2026-02-11 | Sprint 2 |
| T-015 | Login, Register, ForgotPassword ekranlari | FEAT | Frontend | 2026-02-11 | Sprint 2 |

---

## Engellendi (Blocked)

Bir engel nedeniyle ilerleyemeyen gorevler.

| ID | Gorev | Engel Nedeni | Engeli Giderecek | Durum |
|----|-------|-------------|-----------------|-------|
| | | | | |

---

## Gorev Tanimlari

### Tur Kodlari

| Kod | Anlami |
|-----|--------|
| **FEAT** | Yeni ozellik |
| **BUG** | Hata duzeltme |
| **TASK** | Teknik gorev |
| **DOC** | Dokumantasyon |
| **REFACTOR** | Yeniden duzenleme |
| **TEST** | Test yazimi |

### Oncelik Seviyeleri

| Seviye | Anlami |
|--------|--------|
| **P0** | Acil, hemen yapilmali |
| **P1** | Onemli, bu sprint icinde |
| **P2** | Normal, planlanmis |
| **P3** | Dusuk, zaman kaldikca |

### Durum Akisi

```
Backlog → Planlanmis → Yapiliyor → Inceleniyor → Onay Bekliyor → Tamamlandi
                           |            |
                      Engellendi    Geri Dondu
```

## Kullanim Kurallari

1. **Gorev baslangicinda**: Durumu "Yapiliyor"ya tasi, `agent-status.md`'yi guncelle
2. **Gorev bitisinde**: Durumu "Inceleniyor"ya tasi, inceleme istegi olustur
3. **Inceleme sonrasi**: Onaylandi → "Tamamlandi" / Degisiklik gerekli → "Yapiliyor"ya geri
4. **Engel durumunda**: Durumu "Engellendi"ye tasi, engel nedenini yaz
5. **Her gun sonu**: Team Lead tum durumları gozden gecirir

---

*Bu pano, projenin canli durumunu gosterir. Guncel tutulmasi kritiktir.*
