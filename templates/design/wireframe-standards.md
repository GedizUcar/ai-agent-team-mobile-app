# Wireframe ve Mockup Standartlari

Bu belge, mobil uygulama icin wireframe ve mockup olusturma standartlarini tanimlar.

## Wireframe Formati

ASCII art kullanarak wireframe'ler olusturulur. Bu format, hizli iterasyona ve metin tabanli dokumantasyona uygundur.

### Temel Semboller

```
+--+  Cerceve/Container
|  |  Dikey kenar
----  Yatay kenar
[  ]  Buton
(  )  Yuvarlak buton/ikon
<  >  Navigasyon oklari
===   Ayirici cizgi
...   Metin kisaltmasi
###   Gorsel/Resim placeholder
[x]   Checkbox (secili)
[ ]   Checkbox (bos)
(o)   Radio button (secili)
( )   Radio button (bos)
[___] Input alani
```

### Mobil Ekran Sablonu

```
+-----------------------------+
|  [<]    Sayfa Basligi   [=] |  <- Header (44px)
+=============================+
|                             |
|                             |
|     ICERIK ALANI            |  <- Content
|                             |
|                             |
+-----------------------------+
| [Home] [Search] [Profile]   |  <- Tab Bar (50px)
+-----------------------------+
```

## Ornek Wireframe'ler

### Giris Ekrani (Login)
```
+-----------------------------+
|                             |
|          [LOGO]             |
|                             |
|    Hosgeldiniz              |
|                             |
|  Email                      |
|  [_________________________]|
|                             |
|  Sifre                      |
|  [_________________________]|
|                             |
|  [ ] Beni hatirla           |
|                             |
|  [      GIRIS YAP         ] |
|                             |
|  -------- veya --------     |
|                             |
|  (G) Google ile giris       |
|  (A) Apple ile giris        |
|                             |
|  Hesabin yok mu? Kayit Ol   |
+-----------------------------+
```

### Liste Ekrani
```
+-----------------------------+
|  [<]    Urunler        [+]  |
+=============================+
|  [___________] [Filtre]     |  <- Arama + Filtre
+-----------------------------+
|  +-------+                  |
|  | ###   |  Urun Adi 1      |
|  | ###   |  Aciklama...     |
|  +-------+  $99.00    [>]   |
+-----------------------------+
|  +-------+                  |
|  | ###   |  Urun Adi 2      |
|  | ###   |  Aciklama...     |
|  +-------+  $149.00   [>]   |
+-----------------------------+
|  +-------+                  |
|  | ###   |  Urun Adi 3      |
|  | ###   |  Aciklama...     |
|  +-------+  $79.00    [>]   |
+-----------------------------+
| [Home] [Search] [Profile]   |
+-----------------------------+
```

### Detay Ekrani
```
+-----------------------------+
|  [<]    Detay          [*]  |
+=============================+
|  +-------------------------+|
|  |                         ||
|  |      ###########        ||
|  |      ###########        ||
|  |      ###########        ||
|  |                         ||
|  +-------------------------+|
|                             |
|  Urun Adi                   |
|  ========================== |
|                             |
|  $199.00                    |
|  (****) 4.5 (128 degerlend.)|
|                             |
|  Aciklama                   |
|  Lorem ipsum dolor sit      |
|  amet consectetur...        |
|                             |
+-----------------------------+
|  [  SEPETE EKLE  ]          |
+-----------------------------+
```

## Dokumantasyon Formati

Her wireframe asagidaki bilgilerle dokumante edilir:

```markdown
## Ekran: [Ekran Adi]

### Amac
[Bu ekranin ne ise yaradigi]

### Kullanici Hikayesi
"Bir kullanici olarak, [hedef] icin [eylem] yapmak istiyorum"

### Wireframe
[ASCII wireframe]

### Elementler
| Element | Tip | Aksiyon |
|---------|-----|---------|
| [Ad] | [Tip] | [Ne yapar] |

### Navigasyon
- Onceki: [Hangi ekrandan gelir]
- Sonraki: [Hangi ekranlara gider]

### Notlar
- [Onemli tasarim kararlari]
```

## Ekran Akis Diyagrami

```
+----------+     +----------+     +----------+
|  Splash  | --> |  Login   | --> |   Home   |
+----------+     +----------+     +----------+
                      |                |
                      v                v
                 +----------+    +----------+
                 | Register |    |  Detail  |
                 +----------+    +----------+
                                      |
                                      v
                                 +----------+
                                 |   Cart   |
                                 +----------+
```

## Kalite Kontrol Listesi

Her wireframe icin:

- [ ] Tum dokunma hedefleri minimum 44x44px
- [ ] Header yuksekligi tutarli (44-56px)
- [ ] Tab bar yuksekligi tutarli (50px)
- [ ] Icerik padding'i tutarli (16px)
- [ ] Navigasyon acik ve anlasilir
- [ ] Tum durumlar tanimli (bos, yukleniyor, hata)
- [ ] Erisilebilirlik dusunulmus

---

*Bu standartlar tum tasarim calismasinda referans olarak kullanilir.*
