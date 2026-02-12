# Kod Inceleme Is Akisi - Code Review Workflow

Bu belge, kod inceleme surecini, sorumluluk matrisini ve kontrol listelerini tanimlar.

## Genel Ilkeler

1. **Her teslimat** kod incelemesinden gecer
2. **Team Lead** birincil inceleyicidir
3. Inceleme **yapici ve ogretici** olmalidir
4. Sorunlar **onem sirasina** gore onceliklendirilir

---

## Inceleme Sorumluluk Matrisi

| Teslim Eden | Inceleyen | Kalite Kapisi |
|-------------|-----------|---------------|
| Designer | Team Lead | `quality/design-review-gate.md` |
| Frontend | Team Lead | `quality/frontend-review-gate.md` |
| Backend | Team Lead | `quality/backend-review-gate.md` |
| Entegrasyon | Team Lead + Insan Gelistirici | `quality/integration-gate.md` |
| Release | Team Lead + Insan Gelistirici | `quality/release-readiness-gate.md` |

---

## Inceleme Sureci

### 1. Inceleme Istegi

Teslim eden ajan asagidaki bilgileri saglar:

```markdown
## Inceleme Istegi

**Tarih**: {YYYY-AA-GG}
**Gonderen**: {Ajan adi}
**Tur**: Ozellik / Bug Duzeltme / Refactoring / Bakim
**Ilgili Gorev**: {Gorev ID / US-XXX / BUG-XXX}

### Degisiklik Ozeti
{Ne yapildi, neden yapildi - 2-3 cumle}

### Degisen Dosyalar
- {dosya 1}: {ne degisti}
- {dosya 2}: {ne degisti}

### Test Durumu
- Unit testler: Gecti / Yazildi / Guncellendi
- Testler calistirildi mi: Evet / Hayir

### Ozel Dikkat Gereken Noktalar
- {Gozden gecirilmesi gereken alanlar}

### Ilgili Kalite Kapisi
{Uygulanacak kalite kapisi dosyasi}
```

### 2. Inceleme

Team Lead ilgili kalite kapisini uygular ve asagidaki genel kontrolleri de yapar:

#### Genel Inceleme Kontrol Listesi

**Dogrruluk:**
- [ ] Kod beklenen islevseligi sagliyor mu?
- [ ] Edge case'ler ele alinmis mi?
- [ ] Hata durumları dogru yonetiliyor mu?

**Kalite:**
- [ ] Kod okunabilir ve anlasilir mi?
- [ ] Isimlendirme standartlara uygun mu?
- [ ] Gereksiz karmasiklik var mi?
- [ ] DRY prensibi uygulanmis mi?
- [ ] SOLID prensipleri uygulanmis mi (backend)?

**Guvenlik:**
- [ ] Input validation yapilmis mi?
- [ ] SQL injection riski var mi?
- [ ] XSS riski var mi?
- [ ] Hassas veri aciga cikiyor mu?

**Performans:**
- [ ] Gereksiz islem veya hesaplama var mi?
- [ ] N+1 sorgu problemi var mi?
- [ ] Memory leak riski var mi?

**Test:**
- [ ] Yeterli test coverage var mi?
- [ ] Test senaryolari anlamli mi?
- [ ] Edge case testleri var mi?

### 3. Inceleme Sonucu

#### Sorun Oncelik Seviyeleri

| Seviye | Anlami | Eylem |
|--------|--------|-------|
| **Blocker** | Ciddi hata, guvenlik acigi | Duzeltme zorunlu, birlestirme engellenir |
| **Major** | Onemli kalite sorunu | Duzeltme zorunlu |
| **Minor** | Kucuk iyilestirme | Duzeltilmeli, blocker degil |
| **Suggestion** | Oneri, tercihe bagli | Duzeltme opsiyonel |
| **Nitpick** | Cok kucuk, kozmetik | Tamamen opsiyonel |

#### Inceleme Sonuc Formati

```markdown
## Inceleme Sonucu

**Tarih**: {YYYY-AA-GG}
**Inceleyen**: Team Lead
**Karar**: ONAYLI / DEGISIKLIK GEREKLI / REDDEDILDI

### Geri Bildirimler

#### Blocker
- [ ] {Dosya:satir}: {Sorun aciklamasi}

#### Major
- [ ] {Dosya:satir}: {Sorun aciklamasi}

#### Minor
- [ ] {Dosya:satir}: {Sorun aciklamasi}

#### Suggestion
- {Dosya:satir}: {Oneri}

### Genel Degerlendirme
{Genel yorum ve iyi yonler}
```

### 4. Duzeltme ve Tekrar Inceleme

1. Teslim eden ajan, blocker ve major sorunlari duzeltir
2. Duzeltme sonrasi tekrar inceleme istegi gonderir
3. Team Lead sadece duzeltilen noktalari kontrol eder
4. Tum sorunlar giderilince onay verilir

---

## Inceleme Beklentileri

### Inceleyiciden Beklenenler

- **Hizli yanit**: Inceleme isteginden sonra ayni iterasyonda doner
- **Yapici geri bildirim**: "Yanlis" yerine "Sunu deneyelim" yaklasimiyla
- **Acik iletisim**: Neden sorun oldugunu acikla
- **Oncelik belirt**: Her geri bildirimde seviye belirt
- **Iyi yonleri de belirt**: Olumlu noktalar motivasyon saglar

### Teslim Edenden Beklenenler

- **Acik degisiklik ozeti**: Ne yapildi ve neden
- **Self-review**: Gondermeden once kendi inceleme
- **Kucuk teslimatlar**: Buyuk degisiklikler yerine kucuk parcalar
- **Test sonuclari**: Testlerin gectigini belirt
- **Geri bildirime acik**: Tartisma, saldiri degil

---

## Referanslar

- Kalite kapilari: `../quality/`
- Teslimat protokolleri: `../communication/handoff-protocols.md`
- Gorev panosu: `../hub/task-board.md`

---

*Bu surec, tum kod teslimatlarina uygulanir ve surekli iyilestirilir.*
