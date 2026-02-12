# Teslimat Protokolleri - Handoff Protocols

Bu belge, ajanlar arasi teslimat sureclerini, beklenen cikti formatlarini ve kabul kriterlerini tanimlar.

## Genel Ilkeler

1. Her teslimat, teslim alan ajan icin **dogrudan kullanilabilir** olmalidir
2. Teslimat sirasinda **acik olmayan noktalar** belirtilmeli
3. Her teslimat, ilgili **kalite kapisindan** gecmis olmalidir
4. Teslimat bilgisi `hub/task-board.md` uzerinde guncellenir

---

## 1. Designer → Frontend Teslimat

### Teslimat Paketinin Icerigi

| Oge | Format | Zorunlu |
|-----|--------|---------|
| Wireframe'ler | Markdown (ASCII art / tablolar) | Evet |
| Mockup aciklamalari | Markdown (detayli gorsel tanimlar) | Evet |
| Design token'lar | Referans: `templates/design/design-tokens.md` | Evet |
| Komponent spesifikasyonlari | Markdown (olculer, renkler, davranislar) | Evet |
| Animasyon spesifikasyonlari | Duration, easing, property | Gerektiginde |
| Asset listesi | Dosya adlari ve formatlar | Gerektiginde |
| Responsive notlari | Breakpoint bazli farklar | Evet |

### Komponent Spesifikasyonu Formati

```markdown
## Komponent: {KomponentAdi}

### Gorunum
- Genislik: {deger}px / %100
- Yukseklik: {deger}px / auto
- Padding: {deger}px
- Background: {renk kodu}
- Border: {kalinlik}px {stil} {renk}
- Border radius: {deger}px
- Shadow: {shadow token}

### Tipografi
- Font: {font ailesi}
- Boyut: {deger}px
- Agirlik: {deger}
- Renk: {renk kodu}
- Line-height: {deger}px

### Durumlar
- Default: {aciklama}
- Pressed/Active: {aciklama}
- Disabled: {aciklama}
- Loading: {aciklama}
- Error: {aciklama}

### Animasyon
- Trigger: {ne zaman}
- Duration: {sure}ms
- Easing: {easing fonksiyonu}
- Property: {animate edilen ozellik}
```

### Kalite Kapisi

Teslimat oncesi `quality/design-review-gate.md` kontrol listesinin gecilmis olmasi gerekir.

### Kabul Kriterleri (Frontend icin)

- [ ] Tum ekranlar icin wireframe/mockup mevcut
- [ ] Design token referanslari kullanilmis (hardcoded deger yok)
- [ ] Tum etkilesim durumlari (state) tanimlanmis
- [ ] Responsive davranis aciklanmis
- [ ] Erisebilirlik gereksinimleri belirtilmis

---

## 2. Backend → Frontend Teslimat

### Teslimat Paketinin Icerigi

| Oge | Format | Zorunlu |
|-----|--------|---------|
| API endpoint listesi | Tablo (URL, metod, aciklama) | Evet |
| Request/Response ornekleri | JSON ornekleri | Evet |
| Error kodlari | Tablo (kod, mesaj, HTTP status) | Evet |
| Auth gereksinimleri | Endpoint bazli auth bilgisi | Evet |
| Rate limit bilgisi | Tablo (endpoint, limit, pencere) | Evet |
| TypeScript tip tanimlari | `.d.ts` veya interface tanimlari | Evet |
| Swagger/OpenAPI spec | YAML/JSON | Gerektiginde |

### API Endpoint Dokumantasyon Formati

```markdown
## Endpoint: {HTTP_METOD} /api/v1/{resource}

### Aciklama
{Endpoint'in ne ise yaradiginin kisa aciklamasi}

### Authentication
- Gerekli: Evet / Hayir
- Roller: {Gerekli roller}

### Request

**Headers:**
| Header | Deger | Zorunlu |
|--------|-------|---------|
| Authorization | Bearer {token} | Evet |
| Content-Type | application/json | Evet |

**Body:**
```json
{
  "field1": "string (zorunlu)",
  "field2": "number (opsiyonel)"
}
```

### Response

**Basari (200/201):**
```json
{
  "success": true,
  "data": { ... }
}
```

**Hata (4xx/5xx):**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Hata mesaji"
  }
}
```

### Rate Limit
- Limit: {sayi}/saat
- Window: {sure}
```

### Kalite Kapisi

Teslimat oncesi `quality/backend-review-gate.md` kontrol listesinin gecilmis olmasi gerekir.

### Kabul Kriterleri (Frontend icin)

- [ ] Tum endpoint'ler dokuumente edilmis
- [ ] Request/Response ornekleri mevcut
- [ ] Hata senaryolari ve kodlari acik
- [ ] Auth gereksinimleri endpoint bazinda belirtilmis
- [ ] TypeScript tipleri kullanilabilir durumda

---

## 3. Frontend → Backend Teslimat (Geri Bildirim)

### Ne Zaman Gerekir?

- API tasariminda degisiklik onerileri
- Performans sorunlari
- Eksik endpoint ihtiyaclari
- Veri formati degisiklik talepleri

### Geri Bildirim Formati

```markdown
## Geri Bildirim: {Konu}

**Gonderen**: Frontend Ajani
**Tarih**: {YYYY-AA-GG}
**Oncelik**: Dusuk / Orta / Yuksek / Kritik

### Mevcut Durum
{Simdi nasil calisiyor}

### Istenen Degisiklik
{Ne degismeli}

### Gerekce
{Neden gerekli}

### Etki Analizi
- Frontend etkilenen dosyalar: {liste}
- Tahmini etki: {kucuk/orta/buyuk}
```

---

## 4. Team Lead → Tum Ajanlar (Gorev Atama)

### Gorev Atama Formati

```markdown
## Gorev: {Gorev Basligi}

**Atanan Ajan**: {Designer / Frontend / Backend}
**Oncelik**: P0 / P1 / P2 / P3
**Ilgili Hikaye**: US-{XXX}
**Sprint**: Sprint {N}

### Kapsam
{Ne yapilmasi gerektiginin acik tarifi}

### Kabul Kriterleri
- [ ] {Kriter 1}
- [ ] {Kriter 2}

### Bagimlıliklar
- {Baska bir gorev veya teslimata bagimlılık}

### Referanslar
- {Ilgili dosya yollari}

### Beklenen Teslimat
- Format: {Beklenen cikti formati}
- Kalite Kapisi: {Uygulanacak kalite kapisi}
```

---

## Teslimat Sureci

```
1. Ajan: Gorev tamamlandi, teslimat paketi hazir
2. Ajan: task-board.md'de gorev durumunu "Inceleniyor" yap
3. Team Lead: Ilgili kalite kapisini uygula
4. Team Lead: GECTI → Teslim al, sonraki ajana ilet
           KOSULLU GECTI → Minor duzeltmeler istendi
           KALDI → Ajan tekrar calışır
5. Alan ajan: Teslimat paketini kontrol et
6. Alan ajan: Kabul kriterleri karsilanmissa ise basla
           Eksik varsa → Geri bildirim gonder
```

## Referanslar

- Gorev panosu: `../hub/task-board.md`
- Kalite kapilari: `../quality/`
- Yukseltme yollari: `escalation-paths.md`

---

*Bu protokoller, ajanlar arasi tum teslimatlarda uygulanir.*
