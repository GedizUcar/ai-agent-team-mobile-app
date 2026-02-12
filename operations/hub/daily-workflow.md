# Gunluk Is Akisi Protokolu - Daily Workflow

Bu belge, her gunun nasil baslatilacagini, yonetilecegini ve tamamlanacagini tanimlar.

## Gunluk Iterasyon Yapisi

```
Gun Baslanıgici → Calisma → Inceleme → Gun Sonu
    (15 dk)       (Ana)     (Devam)    (15 dk)
```

**Temel kural**: Her gun tek bir ajan, tek bir alan uzerinde calisir.

---

## Gun Baslangici

**Sorumlu**: Team Lead

### Adimlar

1. **Durumu kontrol et**
   - `hub/agent-status.md` → Ajanların musaitligi
   - `hub/task-board.md` → Acik gorevler ve durumlari
   - `tracking/sprint-log.md` → Onceki gunun kaydi

2. **Bugunku hedefi belirle**
   - Hangi ajan calisacak?
   - Hangi gorev/ozellik uzerinde?
   - Beklenen cikti ne?

3. **Gunluk brifing ozeti olustur**

```markdown
## Gunluk Brifing - {YYYY-AA-GG}

### Onceki Gun Ozeti
- {Tamamlanan isler}
- {Devam eden isler}
- {Engeller}

### Bugunun Hedefi
- **Aktif Ajan**: {Ajan adi}
- **Gorev**: {Gorev aciklamasi}
- **Beklenen Cikti**: {Ne teslim edilecek}

### Engeller ve Riskler
- {Varsa engeller}

### Insan Gelistirici Icin Bilgi
- {Onay bekleyen konular}
- {Karar gereken noktalar}
```

---

## Calisma Fazı

### Aktif Ajan Icin

1. **Gorevi al**: `hub/task-board.md`'den atanan gorevi oku
2. **Durumu guncelle**: Gorev durumunu "Yapiliyor" yap
3. **Referanslari oku**: Ilgili standartlar, spesifikasyonlar
4. **Calis**: Gorevi tamamla
5. **Engel durumunda**: `communication/escalation-paths.md` protokolunu takip et

### Team Lead Icin

1. Aktif ajanin ilerlemesini takip et
2. Sorulara yanit ver
3. Engelleri gider
4. Kalite kontrol yap (cikti geldikce)

---

## Gun Sonu

**Sorumlu**: Team Lead

### Adimlar

1. **Ilerleme degerlendirmesi**
   - Hedef tamamlandi mi?
   - Tamamlanmadiysa neden?
   - Sonraki gun icin plan ne?

2. **Kayitlari guncelle**
   - `hub/task-board.md` → Gorev durumlarini guncelle
   - `hub/agent-status.md` → Ajan durumlarini guncelle
   - `tracking/sprint-log.md` → Gunluk kaydi ekle

3. **Gun sonu ozeti olustur**

```markdown
## Gun Sonu Ozeti - {YYYY-AA-GG}

### Tamamlanan Isler
- {Is 1}: {Durum/sonuc}
- {Is 2}: {Durum/sonuc}

### Devam Eden Isler
- {Is 1}: {Kalan is}

### Engeller
- {Engel 1}: {Durum}

### Yarin Icin Plan
- **Aktif Ajan**: {Ajan adi}
- **Gorev**: {Gorev aciklamasi}

### Insan Gelistirici Aksyonlari
- [ ] {Onay/karar gereken konu 1}
- [ ] {Onay/karar gereken konu 2}
```

---

## Ozel Durumlar

### Ajan Degisikligi (Gun Icerisinde)

Nadiren gerekli, sadece su durumlarda:
- Mevcut ajan beklemede (bagimlılık)
- Acil baska alanda is cikti
- Team Lead karari ile

Degisiklik yapilirsa:
1. Mevcut ajanin isini kaydet
2. `hub/agent-status.md`'yi guncelle
3. Yeni ajana brifing ver

### Insan Gelistirici Onayi Gerektiginde

1. Team Lead onay talebini gun sonu ozetine ekler
2. Insan gelistirici onayi verene kadar ilgili gorev "Onay Bekliyor" durumunda kalir
3. Onay geldiginde gorev devam eder

### Engellenen Gorev

1. Engeli belirle ve kaydET
2. Baska bir gorev uzerinde calisilabilir mi degerlendir
3. Yukseltme gerekiyorsa `communication/escalation-paths.md` protokolunu takip et

---

## Gunluk Kontrol Listesi

### Gun Baslangici (Team Lead)
- [ ] Agent status kontrol edildi
- [ ] Task board incelendi
- [ ] Bugunun hedefi belirlendi
- [ ] Aktif ajan gorevi aldi
- [ ] Gunluk brifing yazildi

### Gun Sonu (Team Lead)
- [ ] Ilerleme degeerlendirildi
- [ ] Task board guncellendi
- [ ] Sprint log guncellendi
- [ ] Agent status guncellendi
- [ ] Gun sonu ozeti yazildi
- [ ] Yarin icin plan belirlendi

## Referanslar

- Gorev panosu: `task-board.md`
- Ajan durumu: `agent-status.md`
- Sprint kaydi: `../tracking/sprint-log.md`
- Sprint planlama: `sprint-planning.md`

---

*Bu protokol her gun uygulanir. Tutarlilik, projenin basarisi icin kritiktir.*
