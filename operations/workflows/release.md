# Release (Surum) Is Akisi - Release Workflow

Bu belge, versiyon yonetimi ve release surecini tanimlar.

## Versiyon Politikasi

### Semantic Versioning (SemVer)

```
vMAJOR.MINOR.PATCH

Ornekler:
v1.0.0 - Ilk release
v1.1.0 - Yeni ozellik eklendi
v1.1.1 - Bug duzeltme
v2.0.0 - Uyumsuz degisiklik (breaking change)
```

| Bileşen | Ne Zaman Artar | Ornek |
|---------|----------------|-------|
| **MAJOR** | Geriye uyumsuz API/davranis degisikligi | v1.0 → v2.0 |
| **MINOR** | Geriye uyumlu yeni ozellik | v1.0 → v1.1 |
| **PATCH** | Geriye uyumlu hata duzeltme | v1.0.0 → v1.0.1 |

---

## Release Turleri

### 1. Major Release (vX.0.0)

**Ne zaman**: Buyuk ozellik seti, uyumsuz degisiklikler
**Surec**: Tam test suite + tam kalite kapisi zinciri + insan onayi
**Kademeli dagitim**: Evet (%10 → %50 → %100)

### 2. Minor Release (vX.Y.0)

**Ne zaman**: Yeni ozellikler, iyilestirmeler
**Surec**: Tam test suite + kalite kapisi + insan onayi
**Kademeli dagitim**: Opsiyonel

### 3. Patch Release (vX.Y.Z)

**Ne zaman**: Bug duzeltmeleri, kucuk iyilestirmeler
**Surec**: Etkilenen alan testleri + insan onayi
**Kademeli dagitim**: Hayir (tam dagitim)

### 4. Hotfix Release

**Ne zaman**: Kritik production hatasi
**Surec**: Hizlandirilmis test + acil insan onayi
**Kademeli dagitim**: Hayir (acil tam dagitim)

---

## Release Sureci

### Faz 1: Release Planlama

**Sorumlu**: Team Lead

1. Release kapsamini belirle (hangi ozellikler/duzeltmeler dahil)
2. Versiyon numarasini belirle (SemVer kuralina gore)
3. Release takvimini olustur
4. Release sorumlusunu ata

### Faz 2: Kod Dondurucu (Code Freeze)

**Sorumlu**: Team Lead

1. Yeni ozellik ekleme durdurulur
2. Sadece bug duzeltme ve iyilestirme kabul edilir
3. Release branch olusturulur (gerekirse)

### Faz 3: Release Testi

**Sorumlu**: Tum ajanlar

1. Regresyon testi
2. Smoke test
3. Platform bazli test (iOS + Android)
4. Performans testi
5. Guvenlik taramasi

### Faz 4: Release Hazirlik Kapisi

**Sorumlu**: Team Lead + Insan Gelistirici

Kalite kapisi uygulanir: `quality/release-readiness-gate.md`

### Faz 5: CHANGELOG Guncelleme

**Sorumlu**: Team Lead

### CHANGELOG Formati

```markdown
# Changelog

## [vX.Y.Z] - YYYY-AA-GG

### Eklenenler (Added)
- {Yeni ozellik 1}
- {Yeni ozellik 2}

### Degistirildi (Changed)
- {Degistirilen davranis 1}

### Duzeltildi (Fixed)
- {Duzeltilen hata 1}
- {Duzeltilen hata 2}

### Kaldirildi (Removed)
- {Kaldirilan ozellik 1}

### Guvenlik (Security)
- {Guvenlik guncelleme 1}
```

### Faz 6: Deployment

Deployment sureci icin bkz: `deployment.md`

### Faz 7: Release Sonrasi

**Sorumlu**: Team Lead

1. Release notlarini yayinla
2. `tracking/milestone-tracker.md`'yi guncelle
3. `tracking/sprint-log.md`'ye release bilgisini ekle
4. Takimi bilgilendir
5. Production'i izle (ilk 24 saat yakin takip)
6. Sorun cikarsa hotfix surecini basalat

---

## Hotfix Sureci

Kritik production hatalarinda hizlandirilmis surec:

```
1. Bug raporlama (Seviye: Kritik)
2. Team Lead: Hotfix gerekliligi onayla
3. Insan Gelistirici: Acil onay
4. Ilgili ajan: Hata duzeltme
5. Team Lead: Kod inceleme (hizlandirilmis)
6. Minimal test (etkilenen alan)
7. Production deploy
8. Dogrulama
9. Post-mortem analizi
```

---

## Release Kontrol Listesi

```markdown
## Release Kontrol Listesi: v{X.Y.Z}

**Tarih**: {YYYY-AA-GG}
**Release Sorumlusu**: {Isim}

### Hazirlik
- [ ] Versiyon numarasi belirlendi
- [ ] CHANGELOG guncellendi
- [ ] Release kapsamı onaylandi

### Kalite
- [ ] Release hazirlik kapisi gecildi
- [ ] Tum testler gecti
- [ ] Manuel test tamamlandi

### Deployment
- [ ] Staging testi basarili
- [ ] Database migration hazir
- [ ] Rollback plani var
- [ ] Insan gelistirici onayi alindi

### Yayinlama
- [ ] Production deploy yapildi
- [ ] Health check basarili
- [ ] Monitoring aktif
- [ ] Release notlari yayinlandi

### Takip
- [ ] Ilk 24 saat izleme
- [ ] Crash raporlari kontrol edildi
- [ ] Performans metrikleri normal
```

## Referanslar

- Deployment sureci: `deployment.md`
- Release hazirlik kapisi: `../quality/release-readiness-gate.md`
- Sprint kaydi: `../tracking/sprint-log.md`
- Kilometre tasi takibi: `../tracking/milestone-tracker.md`

---

*Bu surec, tum release islemlerinde takip edilir.*
