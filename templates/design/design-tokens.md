# Design Tokens - Tasarim Degiskenleri

Bu dosya, projenin tum tasarim degerlerini merkezi olarak tanimlar.

## Renkler

### Ana Renkler (Primary)
```
primary-50:   #E3F2FD
primary-100:  #BBDEFB
primary-200:  #90CAF9
primary-300:  #64B5F6
primary-400:  #42A5F5
primary-500:  #2196F3  <- Ana renk
primary-600:  #1E88E5
primary-700:  #1976D2
primary-800:  #1565C0
primary-900:  #0D47A1
```

### Notr Renkler (Neutral)
```
neutral-0:    #FFFFFF  <- Beyaz
neutral-50:   #FAFAFA
neutral-100:  #F5F5F5
neutral-200:  #EEEEEE
neutral-300:  #E0E0E0
neutral-400:  #BDBDBD
neutral-500:  #9E9E9E
neutral-600:  #757575
neutral-700:  #616161
neutral-800:  #424242
neutral-900:  #212121  <- Siyaha yakin
```

### Durum Renkleri (Semantic)
```
success:  #4CAF50  (Basari)
warning:  #FF9800  (Uyari)
error:    #F44336  (Hata)
info:     #2196F3  (Bilgi)
```

## Tipografi

### Font Ailesi
```
font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
font-family-mono: 'JetBrains Mono', 'Fira Code', monospace
```

### Font Boyutlari
```
text-xs:    12px  (line-height: 16px)
text-sm:    14px  (line-height: 20px)
text-base:  16px  (line-height: 24px)
text-lg:    18px  (line-height: 28px)
text-xl:    20px  (line-height: 28px)
text-2xl:   24px  (line-height: 32px)
text-3xl:   28px  (line-height: 36px)
text-4xl:   32px  (line-height: 40px)
```

### Font Agirliklari
```
font-regular:   400
font-medium:    500
font-semibold:  600
font-bold:      700
```

## Bosluklar (Spacing)

8px grid sistemi kullanilir.

```
space-0:   0px
space-1:   4px
space-2:   8px
space-3:   12px
space-4:   16px
space-5:   20px
space-6:   24px
space-7:   28px
space-8:   32px
space-10:  40px
space-12:  48px
space-16:  64px
space-20:  80px
```

## Border Radius

```
radius-none:  0px
radius-sm:    4px
radius-md:    8px
radius-lg:    12px
radius-xl:    16px
radius-2xl:   24px
radius-full:  9999px  (Tam yuvarlak)
```

## Golge (Shadow)

```
shadow-sm:    0 1px 2px rgba(0, 0, 0, 0.05)
shadow-md:    0 4px 6px rgba(0, 0, 0, 0.1)
shadow-lg:    0 10px 15px rgba(0, 0, 0, 0.1)
shadow-xl:    0 20px 25px rgba(0, 0, 0, 0.15)
```

## Breakpoints

```
mobile-sm:   320px
mobile-md:   375px
mobile-lg:   414px
tablet:      768px
desktop:     1024px
```

## Animasyon

```
duration-fast:    150ms
duration-normal:  300ms
duration-slow:    500ms

easing-default:   ease-in-out
easing-bounce:    cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

## Z-Index Katmanlari

```
z-base:       0
z-dropdown:   100
z-sticky:     200
z-overlay:    300
z-modal:      400
z-toast:      500
```

---

*Bu tokenlar tum tasarim ve gelistirme surecinde referans olarak kullanilir.*
