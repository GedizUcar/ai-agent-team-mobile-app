# Mimari Karar Kaydi (ADR) Sablonu

Bu sablon, projede alinan onemli teknik ve mimari kararlarin dokumante edilmesi icin kullanilir.

---

## ADR-{NUMARA}: {KARAR BASLIGI}

**Tarih**: YYYY-AA-GG
**Durum**: Teklif | Kabul Edildi | Reddedildi | Kaldirildi | Degistirildi
**Karar Veren**: {Ajan adi veya insan gelistirici}
**Ilgili Ajanlar**: {Etkilenen ajanlar}

### Baglam

Kararin alinmasini gerektiren durumu aciklayın. Hangi problem cozulmeye calisildi?

```
Ornek:
Uygulamanin state yonetimi icin bir kutuphane secilmesi gerekiyordu.
Birden fazla secenek degerlendirildı.
```

### Karar

Alinan karari net bir sekilde belirtin.

```
Ornek:
Global state yonetimi icin Zustand kullanilacak.
```

### Alternatifler

Degerlendirilen alternatifleri listeleyin.

| Alternatif | Artilari | Eksileri |
|------------|----------|----------|
| {Secenek 1} | ... | ... |
| {Secenek 2} | ... | ... |
| {Secenek 3} | ... | ... |

### Gerekce

Kararin neden alindigini aciklayın.

```
Ornek:
- Hafif kutuphane (~1KB)
- Redux'a gore daha basit API
- TypeScript ile dogal entegrasyon
- AsyncStorage persist middleware destegi
```

### Sonuclar

Bu kararin projeye etkileri nelerdir?

**Olumlu etkiler:**
- ...

**Olumsuz etkiler / Riskler:**
- ...

**Takip edilmesi gerekenler:**
- ...

### Referanslar

- {Ilgili dosya veya belge linkleri}
- {Harici kaynaklar}

---

## Kullanim Talimatlari

1. Bu sablonu kopyalayin
2. `{NUMARA}` yerine siradaki ADR numarasini yazin (bkz: `../tracking/decision-log.md`)
3. Tum bolumleri doldurun
4. Team Lead onayindan sonra durumu "Kabul Edildi" olarak guncelleyin
5. `../tracking/decision-log.md` dosyasina indeks girisini ekleyin

### Ne Zaman ADR Olusturulur?

- Yeni teknoloji veya kutuphane secimi
- Mimari desen degisikligi
- Veritabani sema kararlari
- API tasarim degisiklikleri
- Guvenlik stratejisi kararlari
- Performans optimizasyon yaklasimlari
- Mevcut kararlarin degistirilmesi

### ADR Durumlari

| Durum | Aciklama |
|-------|----------|
| **Teklif** | Karar teklif edildi, henuz onaylanmadi |
| **Kabul Edildi** | Team Lead ve/veya insan gelistirici tarafindan onaylandi |
| **Reddedildi** | Degerlendirildi fakat kabul edilmedi |
| **Kaldirildi** | Artik gecerli degil, yeni bir ADR ile degistirildi |
| **Degistirildi** | Kismi degisiklik yapildi, yeni ADR ile guncellendi |

---

*Her onemli teknik karar bu sablon kullanilarak kayit altina alinir.*
