# Sorun Yukseltme Yollari - Escalation Paths

Bu belge, ajanların karsilastigi sorunlari ne zaman ve nasil yukseltmesi gerektigini tanimlar.

## Yukseltme Seviyeleri

```
Seviye 0: Ajan kendi basina cozer
    ↓ (cozemezse)
Seviye 1: Team Lead'e yukselt
    ↓ (Team Lead cozemezse)
Seviye 2: Insan Gelistiriciye yukselt
    ↓ (acil/kritik durum)
Seviye 3: Acil Mudahale
```

---

## Seviye 0 - Ajan Cozumu

Ajanin kendi basina cozebilecegi durumlar:

- Minor kod hatalari
- Stil ince ayarlari
- Dokumantasyon guncellemeleri
- Bilinen pattern'leri uygulama
- Test duzeltmeleri

**Beklenen aksyon**: Ajan sorunu cozer, cozumu gorev kaydina yazar.

---

## Seviye 1 - Team Lead Yukseltme

### Ne Zaman Yukseltilir?

| Durum | Ornek |
|-------|-------|
| **Teknik karar gerekli** | Yeni kutuphane secimi, mimari degisiklik |
| **Ajanlar arasi catisma** | Farkli cozum yaklasimlari, API tasarim anlaşmazligi |
| **Bagimlılık engeli** | Baska bir ajanin ciktisi bekleniyor |
| **Standart disi durum** | Mevcut standartlarin kapsamadigidurum |
| **Performans sorunu** | Hedeflenen metriklere ulasilamiyor |
| **Kapsam genislemesi** | Gorev tanimi disina cikan gereksinimler |

### Yukseltme Formati

```markdown
## Yukseltme: {Konu Basligi}

**Tarih**: {YYYY-AA-GG}
**Gonderen**: {Ajan adi}
**Seviye**: 1 (Team Lead)
**Aciliyet**: Dusuk / Orta / Yuksek / Kritik

### Sorun Tanimi
{Sorunun acik ve kisa tanimi}

### Denenen Cozumler
1. {Ne denendi} → {Sonuc}
2. {Ne denendi} → {Sonuc}

### Olasi Cozum Onerileri
1. {Oneri 1}: {Artilari / Eksileri}
2. {Oneri 2}: {Artilari / Eksileri}

### Etki
- Etkilenen ozellik/gorev: {aciklama}
- Engellenen is: {varsa}
- Tahmini gecikme: {varsa}
```

### Team Lead Beklenen Aksyonlari

1. Sorunu degerlendir
2. Gerekirse etkilenen diger ajanlara danIS
3. Karar al ve yonlendir
4. Karari `tracking/decision-log.md`'ye kaydet (onemli ise ADR olarak)
5. Gorev panosunu guncelle

---

## Seviye 2 - Insan Gelistirici Yukseltme

### Ne Zaman Yukseltilir?

| Durum | Ornek |
|-------|-------|
| **Kritik mimari karar** | Tum sistemi etkileyen tasarim degisikligi |
| **Guvenlik endisesi** | Potansiyel guvenlik acigi, veri sizintisi riski |
| **Butce/kaynak karari** | Ucuncu parti servis, lisans gerektiren arac |
| **Is gereksinimleri belirsiz** | Urun gereksinimleri net degil |
| **Team Lead cozum bulamadi** | Seviye 1'de cozulemeyen teknik sorun |
| **Etik/yasal endise** | Veri gizliligi, KVKK uyumu |

### Yukseltme Formati

```markdown
## Yukseltme: {Konu Basligi}

**Tarih**: {YYYY-AA-GG}
**Gonderen**: Team Lead
**Seviye**: 2 (Insan Gelistirici)
**Aciliyet**: Dusuk / Orta / Yuksek / Kritik

### Baglam
{Sorunun arka plani ve nasil buraya gelindigi}

### Sorun
{Net sorun tanimi}

### Team Lead Degerlendirmesi
{Team Lead'in analizi ve onerileri}

### Karar Gerektiren Noktalar
1. {Karar 1}: {Secenekler}
2. {Karar 2}: {Secenekler}

### Etki Analizi
- Zaman etkisi: {varsa gecikme}
- Teknik etki: {etkilenen bilesenler}
- Maliyet etkisi: {varsa ek maliyet}
```

---

## Seviye 3 - Acil Mudahale

### Ne Zaman Uygulanir?

- Production'da kritik hata (sistem coktu)
- Guvenlik ihlali tespit edildi
- Veri kaybi riski
- Yasal/regülatorik zorunluluk

### Protokol

```
1. Hemen Team Lead'i bilgilendir
2. Team Lead: Insan Gelistiriciyi acil bilgilendir
3. Tum aktif calismalari durdur
4. Sorunu izole et (hasari sinirla)
5. Acil duzeltme (hotfix) planla
6. Duzeltme sonrasi root cause analizi yap
7. Onleyici tedbirler belirle
```

---

## Aciliyet Tanimlari

| Aciliyet | Tanim | Beklenen Yanit Suresi |
|----------|-------|----------------------|
| **Dusuk** | Isi engelmiyor, sonraki iterasyonda cozulebilir | 1-2 iterasyon |
| **Orta** | Isi yavaslatiyor, mevcut iterasyonda cozulmeli | Ayni iterasyon |
| **Yuksek** | Isi engelliyor, hemen cozulmeli | Ayni gun |
| **Kritik** | Sistem/guvenlik riski, acil mudahale | Aninda |

## Yukseltme Akis Semasi

```
Ajan sorunla karsilasir
        |
  Kendi cozebilir mi?
   /            \
 Evet           Hayir
  |               |
Coz ve kaydet   Team Lead'e yukselt (Seviye 1)
                    |
              TL cozebilir mi?
               /          \
             Evet         Hayir
              |             |
          Coz ve kaydet   Insan Gelistiriciye yukselt (Seviye 2)
                              |
                        Karar al ve ilet
                              |
                          Kayit olustur (ADR)
```

## Referanslar

- Karar kaydi sablonu: `decision-log-template.md`
- Gorev panosu: `../hub/task-board.md`
- Karar kaydi indeksi: `../tracking/decision-log.md`

---

*Bu yukseltme protokolu, sorunlarin zamaninda ve dogru seviyede ele alinmasini saglar.*
