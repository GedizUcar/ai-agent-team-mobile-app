# Komponent Tasarim Sablonu

Bu sablon, her yeni UI komponenti tanimlanirken kullanilir.

---

## [Komponent Adi]

### Genel Bakis
- **Tanim**: [Komponentin ne isi gordugunun kisa aciklamasi]
- **Kullanim Alani**: [Nerede kullanilacagi]
- **Kategori**: [Button / Input / Card / Navigation / Feedback / Layout]

### Varyantlar

| Varyant | Aciklama | Kullanim |
|---------|----------|----------|
| Primary | [Aciklama] | [Ne zaman kullanilir] |
| Secondary | [Aciklama] | [Ne zaman kullanilir] |
| ... | ... | ... |

### Boyutlar

| Boyut | Yukseklik | Padding | Font Size |
|-------|-----------|---------|-----------|
| Small | [px] | [px] | [px] |
| Medium | [px] | [px] | [px] |
| Large | [px] | [px] | [px] |

### Durumlar (States)

```
Default:   [Varsayilan gorunum]
Hover:     [Uzerine gelindiginde]
Active:    [Basildiginda]
Focused:   [Odaklandiginda]
Disabled:  [Devre disi]
Loading:   [Yukleniyor]
Error:     [Hata durumu]
```

### Gorsel Tanim

```
+----------------------------------+
|                                  |
|     [ASCII art cizimi]           |
|                                  |
+----------------------------------+
```

### Ozellikler (Props)

| Prop | Tip | Varsayilan | Aciklama |
|------|-----|------------|----------|
| variant | string | 'primary' | Komponent varyanti |
| size | string | 'medium' | Boyut |
| disabled | boolean | false | Devre disi durumu |
| ... | ... | ... | ... |

### Kullanim Ornegi

```
[Kullanim kodu veya aciklamasi]
```

### Erisilebilirlik (A11y)

- [ ] Klavye navigasyonu destegi
- [ ] ARIA etiketleri
- [ ] Renk kontrast orani (minimum 4.5:1)
- [ ] Focus gostergesi
- [ ] Screen reader uyumlulugu

### Notlar

- [Onemli tasarim kararlari]
- [Bilinen kisitlamalar]
- [Gelecek iyilestirmeler]

---

*Her komponent bu formati takip etmelidir.*
