# Tasarim Inceleme Kapisi - Design Review Gate

Bu kontrol listesi, Designer ajaninin ciktilari bir sonraki faza (Frontend gelistirme) gecmeden once tamamlanmasi gereken kriterleri icerir.

## Kapsam

Bu kalite kapisi asagidaki teslimatlar icin uygulanir:
- Wireframe'ler
- Mockup'lar
- Prototipler
- Tasarim tokenlari
- Komponent tasarimlari

## Inceleme Sorumlusu

**Birincil**: Team Lead
**Ikincil**: Insan Gelistirici (kritik ekranlar icin)

---

## Kontrol Listesi

### 1. Tasarim Sistemi Uyumu

- [ ] Renk paleti `templates/design/design-tokens.md` ile uyumlu
- [ ] Tipografi olcekleri design token'lara uygun
- [ ] 8px grid bosluk sistemi kullanilmis
- [ ] Border radius degerleri standartlara uygun
- [ ] Golge (shadow) degerleri standartlara uygun

### 2. Gorsel Hiyerarsi

- [ ] Bilgi hiyerarsisi net ve anlasilir
- [ ] Baslik seviyeleri dogru kullanilmis (H1, H2, H3)
- [ ] Icerik bloklari mantiksal sirada
- [ ] Beyaz alan (whitespace) dengeli kullanilmis
- [ ] Gorsel agirlik merkezi uygun

### 3. Mobil Uygunluk

- [ ] Touch target minimum 44x44px
- [ ] Butonlar arasi minimum 8px bosluk
- [ ] Form elemanlari minimum 48px yukseklik
- [ ] Kucuk ekran (320px) icin optimize edilmis
- [ ] Buyuk ekran (tablet 768px+) icin uyumlu
- [ ] Keyboard acildiginda icerik gorunurlugu saglanmis

### 4. Erisebilirlik (Accessibility)

- [ ] Renk kontrasti minimum 4.5:1 (WCAG AA)
- [ ] Renk koru kullanicilari icin alternatif gostergeler
- [ ] Metin boyutlari okunabilir (minimum 12px)
- [ ] Etkileşimli alanlarin gorsel geri bildirimi var
- [ ] Focus state'ler tanimlanmis

### 5. Kullanici Deneyimi (UX)

- [ ] Kullanici akisi mantikli ve kisa
- [ ] Geri donus yollari mevcut (back, close)
- [ ] Hata durumlari tasarlanmis
- [ ] Bos durum (empty state) tasarlanmis
- [ ] Yukleme durumu (loading state) tasarlanmis
- [ ] Basari geri bildirimi tasarlanmis

### 6. Tutarlilik

- [ ] Tum ekranlarda ayni gorsel dil
- [ ] Buton stilleri tutarli
- [ ] Form eleman stilleri tutarli
- [ ] Navigasyon yapisi tutarli
- [ ] Ikon stili tutarli (outline/filled)

### 7. Teslimat Tamamligi

- [ ] Tum gerekli ekranlar tasarlanmis
- [ ] Responsive varyantlar (mobile, tablet) hazir
- [ ] Etkilesim durumlari (hover, pressed, disabled) tanimli
- [ ] Design token dosyasi guncel
- [ ] Komponent spesifikasyonlari yazilmis

### 8. Frontend Handoff Hazırligi

- [ ] Olcumler piksel degerlerinde belirtilmis
- [ ] Renkler HEX/RGB formatinda
- [ ] Font bilgileri (aile, boyut, agirlik) acik
- [ ] Asset dosyalari optimize edilmis
- [ ] Animasyon suresi ve easing tanimli

## Inceleme Sonucu

| Sonuc | Aciklama |
|-------|----------|
| **GECTI** | Tum kriterler karsilandi, Frontend faza gecilebilir |
| **KOSULLU GECTI** | Minor sorunlar var, duzeltme sirasinda Frontend baslayabilir |
| **KALDI** | Kritik sorunlar var, yeniden tasarim gerekli |

### Inceleme Kaydi

```
Tarih: {YYYY-AA-GG}
Inceleyen: {Ajan/kisi adi}
Sonuc: GECTI / KOSULLU GECTI / KALDI
Notlar: {Varsa duzeltme gereken noktalar}
```

## Referanslar

- Tasarim tokenlari: `../../templates/design/design-tokens.md`
- Wireframe standartlari: `../../templates/design/wireframe-standards.md`
- Komponent tasarim sablonu: `../../templates/design/component-template.md`
- Handoff protokolu: `../communication/handoff-protocols.md`

---

*Bu kalite kapisi, her tasarim teslimatinda Team Lead tarafindan uygulanir.*
