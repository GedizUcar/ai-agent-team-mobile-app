# Bug Duzeltme Is Akisi - Bug Fix Workflow

Bu belge, hata (bug) raporlama, triaj, duzeltme ve dogrulama surecini tanimlar.

## Genel Bakis

```
Raporlama → Triaj → Atama → Duzeltme → Inceleme → Dogrulama → Kapatis
    |          |       |        |          |          |           |
  Herhangi   Team    Team   Ilgili     Team Lead   Raporlayan  Team Lead
  bir ajan   Lead    Lead    Ajan                    + TL
```

---

## Faz 1: Bug Raporlama

**Sorumlu**: Hatanin tespit eden ajan veya insan gelistirici

### Bug Raporu Formati

```markdown
## Bug Raporu: {Kisa baslik}

**ID**: BUG-{XXX}
**Raporlayan**: {Ajan adi / Insan Gelistirici}
**Tarih**: {YYYY-AA-GG}
**Ciddiyet**: Kritik / Yuksek / Orta / Dusuk
**Platform**: iOS / Android / Her ikisi
**Etkilenen Ozellik**: {Ozellik adi}

### Aciklama
{Hatanin detayli aciklamasi}

### Yeniden Uretme Adimlari
1. {Adim 1}
2. {Adim 2}
3. {Adim 3}

### Beklenen Davranis
{Ne olmasi gerekiyordu}

### Gerceklesen Davranis
{Ne oldu}

### Ekran Goruntusu / Log
{Varsa hata mesaji, ekran goruntusu, stack trace}

### Ortam
- Cihaz: {model}
- OS: {versiyon}
- Uygulama versiyonu: {versiyon}
```

---

## Faz 2: Triaj

**Sorumlu**: Team Lead

### Triaj Kontrol Listesi

1. [ ] Bug raporu eksiksiz mi?
2. [ ] Tekrar edilebilir mi?
3. [ ] Daha once raporlanmis mi? (duplicate kontrolu)
4. [ ] Ciddiyet dogru belirlenims mi?
5. [ ] Oncelik atanmis mi?

### Ciddiyet Tanimlari

| Ciddiyet | Tanim | Ornek |
|----------|-------|-------|
| **Kritik** | Sistem kullanılamaz, veri kaybi riski | Uygulama crash, giris yapilamiyor |
| **Yuksek** | Onemli ozellik calışmiyor, workaround yok | Siparis verilemiyor, profil yuklenmiyor |
| **Orta** | Ozellik kisitli calisiyor, workaround var | Filtreleme calismiyor ama arama calisiyor |
| **Dusuk** | Kozmetik sorun, kullanici etkisi minimal | Yanlis renk, hafif hizalama sorunu |

### Oncelik Atamasi

| Ciddiyet + Etki | Oncelik |
|-----------------|---------|
| Kritik, genis etki | P0 - Hemen duzelt |
| Yuksek, cok kullanici etkili | P0 - Bu sprint icinde |
| Orta, sinirli etki | P1 - Sonraki sprint |
| Dusuk, minimal etki | P2 - Backlog |

---

## Faz 3: Atama

**Sorumlu**: Team Lead

### Atama Matrisi

| Bug Alani | Atanacak Ajan |
|-----------|---------------|
| UI gorunum / stil sorunu | Designer (analiz) → Frontend (duzeltme) |
| Komponent davranisi | Frontend |
| API hatasi | Backend |
| Veritabani sorunu | Backend |
| Auth/guvenlik sorunu | Backend |
| Performans sorunu | Alana gore (Frontend veya Backend) |
| Entegrasyon sorunu | Frontend + Backend (birlikte) |

### Atama Sonrasi

1. `hub/task-board.md`'ye bug gorevini ekle
2. Atanan ajana gorevi ilet
3. Bug durumunu "Atandi" olarak guncelle

---

## Faz 4: Duzeltme

**Sorumlu**: Atanan ajan

### Duzeltme Adimlari

1. Bug'i lokal ortamda yeniden uret
2. Root cause (kok neden) analizi yap
3. Duzeltme stratejisini belirle
4. Kodu duzelt
5. Duzeltmenin regresyona neden olmadigini dogrula
6. Ilgili test yaz (bug'in tekrar olusmasini engelleyen)
7. Degisiklikleri belgele

### Duzeltme Kaydi Formati

```markdown
## Duzeltme: BUG-{XXX}

**Duzelten**: {Ajan adi}
**Tarih**: {YYYY-AA-GG}

### Root Cause
{Hatanin kok nedeni}

### Cozum
{Uygulanan cozum}

### Degisen Dosyalar
- {dosya 1}: {ne degisti}
- {dosya 2}: {ne degisti}

### Eklenen Testler
- {test 1}: {ne test ediyor}

### Regresyon Etkisi
{Baska islevleri etkileme durumu}
```

---

## Faz 5: Inceleme

**Sorumlu**: Team Lead

### Inceleme Kontrol Listesi

- [ ] Root cause dogru tanimlanmis
- [ ] Cozum kok nedeni gideriyor (semptom degil)
- [ ] Kod kalitesi standartlara uygun
- [ ] Test eklenmis (bug tekrar olusmasin)
- [ ] Regresyon riski degerlendirilmis
- [ ] Gereksiz degisiklik yapilmamis (minimal duzeltme)

---

## Faz 6: Dogrulama

**Sorumlu**: Raporlayan + Team Lead

### Dogrulama Adimlari

1. [ ] Bug orijinal senaryoda tekrar uretilmiyor
2. [ ] Edge case'ler kontrol edildi
3. [ ] Ilgili alanda regresyon yok
4. [ ] Tum platformlarda test edildi (iOS + Android)

---

## Faz 7: Kapatis

**Sorumlu**: Team Lead

### Kapatis Adimlari

1. Bug durumunu "Kapandi" olarak guncelle
2. `hub/task-board.md`'yi guncelle
3. `tracking/sprint-log.md`'ye kaydet
4. Eger sistemik bir sorun ise, ilgili standartlari guncelle

---

## Bug Durumu Akisi

```
Yeni → Triaj → Atandi → Duzeltiliyor → Inceleniyor → Dogrulaniyor → Kapandi
                  |                         |              |
                  └── Reddedildi       Geri Dondu      Tekrar Acildi
                     (gecersiz/tekrar)  (duzeltme       (dogrulama
                                        yetersiz)       basarisiz)
```

## Referanslar

- Gorev panosu: `../hub/task-board.md`
- Sprint kaydi: `../tracking/sprint-log.md`
- Kod inceleme: `code-review.md`
- Yukseltme yollari: `../communication/escalation-paths.md`

---

*Bu is akisi, tum bug raporlarinda basindan sonuna kadar takip edilir.*
