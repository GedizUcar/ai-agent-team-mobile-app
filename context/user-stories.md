# Kullanici Hikayeleri - User Stories (Stilora)

Bu belge, Stilora moda e-ticaret uygulamasi icin tanimlanan kullanici hikayelerini icerir.

## Hikaye Formati

```
[US-XXX] Baslik
Bir {kullanici rolu} olarak,
{hedef/istek} istiyorum,
boylece {fayda/deger} elde edeyim.

Kabul Kriterleri:
- [ ] Kriter 1
- [ ] Kriter 2
```

## Oncelik ve Durum Tanimlari

**Oncelik**: P0 (MVP zorunlu) | P1 (Onemli) | P2 (Arzu edilen) | P3 (Gelecek)
**Durum**: Backlog | Planlanmis | Gelistiriliyor | Inceleniyor | Tamamlandi

---

## Kimlik Dogrulama (Authentication)

### [US-001] Kullanici Kaydi
Bir yeni kullanici olarak,
email ve sifre ile hesap olusturmak istiyorum,
boylece Stilora'da alisveris yapmaya baslayabileyim.

**Oncelik**: P0 | **Durum**: Backlog | **Sprint**: -

**Kabul Kriterleri:**
- [ ] Email, sifre, ad ve soyad alanlari mevcut
- [ ] Email format dogrulamasi yapilir
- [ ] Sifre en az 8 karakter, buyuk/kucuk harf, rakam ve ozel karakter icerir
- [ ] Ayni email ile birden fazla kayit yapilamaz
- [ ] Basarili kayit sonrasi access ve refresh token dondurulur
- [ ] Email dogrulama maili gonderilir
- [ ] Hata durumlarinda kullaniciya anlasilir mesaj gosterilir

**Teknik Notlar:**
- Endpoint: `POST /api/v1/auth/register`
- Sifre bcrypt ile hashlenir (12 salt rounds)
- Response formati: standart API response

---

### [US-002] Kullanici Girisi
Bir kayitli kullanici olarak,
email ve sifre ile giris yapmak istiyorum,
boylece hesabima erisip alisveris yapabileyim.

**Oncelik**: P0 | **Durum**: Backlog | **Sprint**: -

**Kabul Kriterleri:**
- [ ] Email ve sifre alanlari mevcut
- [ ] Basarili giris sonrasi access ve refresh token dondurulur
- [ ] Yanlis sifre girildiginde genel hata mesaji gosterilir (guvenlik)
- [ ] 5 basarisiz denemeden sonra hesap 30 dakika kilitlenir
- [ ] "Beni hatirla" secenegi mevcut
- [ ] Giris sonrasi Home ekranina yonlendirilir

**Teknik Notlar:**
- Endpoint: `POST /api/v1/auth/login`
- Rate limiting: 5 deneme / 15 dakika
- Token sureleri: access 1 saat, refresh 14 gun

---

### [US-003] Token Yenileme
Bir giris yapmis kullanici olarak,
oturumum otomatik olarak yenilenmesini istiyorum,
boylece alisveris sirasinda surekli tekrar giris yapmak zorunda kalmayayim.

**Oncelik**: P0 | **Durum**: Backlog | **Sprint**: -

**Kabul Kriterleri:**
- [ ] Access token suresi dolmadan once otomatik yenilenir
- [ ] Refresh token gecerliyse yeni access token alinir
- [ ] Refresh token gecersizse kullanici login ekranina yonlendirilir
- [ ] Islem kullanici fark etmeden arka planda gerceklesir

**Teknik Notlar:**
- Endpoint: `POST /api/v1/auth/refresh`
- Axios interceptor ile otomatik yenileme

---

### [US-004] Cikis Yapma
Bir giris yapmis kullanici olarak,
guvenli bir sekilde cikis yapmak istiyorum,
boylece hesabim guvenli kalsin.

**Oncelik**: P0 | **Durum**: Backlog | **Sprint**: -

**Kabul Kriterleri:**
- [ ] Cikis butonu Settings ekraninda mevcut
- [ ] Cikis yapildiginda tum tokenlar gecersiz kilinir
- [ ] Lokal depolanan kullanici verisi ve sepet temizlenir
- [ ] Login ekranina yonlendirilir
- [ ] Onay dialog gosterilir

**Teknik Notlar:**
- Endpoint: `POST /api/v1/auth/logout`
- AsyncStorage temizlenir
- Zustand store sifirlanir (auth + cart)

---

### [US-005] Sifre Sifirlama
Bir kullanici olarak,
sifremi unuttugumda sifirlamak istiyorum,
boylece hesabima tekrar erisebilim.

**Oncelik**: P0 | **Durum**: Backlog | **Sprint**: -

**Kabul Kriterleri:**
- [ ] "Forgot Password" linki login ekraninda mevcut
- [ ] Email adresi girildikten sonra sifirlama maili gonderilir
- [ ] Sifirlama linki 1 saat gecerli
- [ ] Yeni sifre, sifre gereksinimlerini karsilamali
- [ ] Basarili sifirlamada tum aktif oturumlar sonlandirilir
- [ ] Basari/hata mesajlari gosterilir

**Teknik Notlar:**
- Endpoints: `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`

---

## Ana Sayfa (Home)

### [US-020] Ana Sayfa Goruntuleme
Bir kullanici olarak,
uygulamayi actigimda one cikan urunleri ve kategorileri gormek istiyorum,
boylece hizlica ilgimi ceken urunlere ulasabileyim.

**Oncelik**: P0 | **Durum**: Backlog | **Sprint**: -

**Kabul Kriterleri:**
- [ ] Promotional banner/carousel ust kisimda gosterilir
- [ ] Kategori listesi yatay scroll ile gosterilir (Kadin, Erkek, Aksesuar, Ayakkabi, vb.)
- [ ] "Featured Products" bolumu ile one cikan urunler grid olarak listelenir
- [ ] "New Arrivals" bolumu ile yeni urunler listelenir
- [ ] Pull-to-refresh ile icerik yenilenebilir
- [ ] Skeleton loader ile yukleme durumu gosterilir
- [ ] Dark mode'da dogru gorunur

**Teknik Notlar:**
- Endpoint: `GET /api/v1/home` (aggregated home data)
- React Query ile cache (5 dk stale time)
- FlatList/ScrollView ile performansli scroll

---

## Urun Listeleme (Product List)

### [US-030] Kategoriye Gore Urun Listeleme
Bir kullanici olarak,
bir kategoriye tikladigimda o kategorideki urunleri gormek istiyorum,
boylece aradisim tarzdaki urunlere kolayca goz atabileleyim.

**Oncelik**: P0 | **Durum**: Backlog | **Sprint**: -

**Kabul Kriterleri:**
- [ ] Urunler 2'li grid layoutda gosterilir
- [ ] Her urun kartinda: foto, isim, fiyat gosterilir
- [ ] Indirimli urunlerde eski fiyat cizili, yeni fiyat vurgulu gosterilir
- [ ] Infinite scroll ile sayfalama (pagination) calişır
- [ ] Ekran basta iken kategori basligi gosterilir
- [ ] Bos kategori icin empty state gosterilir
- [ ] Skeleton loader ile yukleme durumu
- [ ] Urun kartina tiklayinca Product Detail ekranina gidilir

**Teknik Notlar:**
- Endpoint: `GET /api/v1/products?category={categoryId}&page={n}&limit=20`
- React Query ile infinite query
- FlatList numColumns={2}

---

## Urun Detay (Product Detail)

### [US-040] Urun Detay Goruntuleme
Bir kullanici olarak,
bir urune tikladigimda detaylarini gormek istiyorum,
boylece satin alma karari verebilim.

**Oncelik**: P0 | **Durum**: Backlog | **Sprint**: -

**Kabul Kriterleri:**
- [ ] Urun foto galerisi (swipeable carousel) gosterilir
- [ ] Urun adi, fiyati, aciklamasi gosterilir
- [ ] Beden secimi yapilabilir (S, M, L, XL, vb.)
- [ ] Renk secimi yapilabilir (renk daireleri)
- [ ] "Add to Cart" butonu belirgin sekilde gosterilir
- [ ] Stok durumu gosterilir (In Stock / Out of Stock)
- [ ] Stokta yoksa "Add to Cart" disable olur
- [ ] Sayfayi asagi kaydirinca urun detay aciklamasi gosterilir

**Teknik Notlar:**
- Endpoint: `GET /api/v1/products/{productId}`
- Image caching (react-native-fast-image veya benzeri)

---

### [US-041] Sepete Urun Ekleme
Bir kullanici olarak,
urun detay sayfasindan beden ve renk secip sepete eklemek istiyorum,
boylece alisverisime devam edebilim.

**Oncelik**: P0 | **Durum**: Backlog | **Sprint**: -

**Kabul Kriterleri:**
- [ ] Beden secilmeden "Add to Cart" uyari gosterir
- [ ] Basarili ekleme sonrasi toast/snackbar ile onay gosterilir
- [ ] Tab bar'daki Cart ikonunda badge (adet sayisi) guncellenir
- [ ] Ayni urun+beden+renk tekrar eklenirse miktar arttirilir
- [ ] Animasyonlu geri bildirim verilir

**Teknik Notlar:**
- Zustand cart store ile lokal state
- Backend sync: `POST /api/v1/cart/items`
- Optimistic update

---

## Alisveris Sepeti (Cart)

### [US-050] Sepet Goruntuleme
Bir kullanici olarak,
sepetimi goruntulemek istiyorum,
boylece ne alacagimi ve toplam tutari gorebilim.

**Oncelik**: P0 | **Durum**: Backlog | **Sprint**: -

**Kabul Kriterleri:**
- [ ] Sepetteki tum urunler listelenir (foto, isim, beden, renk, fiyat, miktar)
- [ ] Her urun icin miktar artirma/azaltma butonlari mevcut
- [ ] Her urun icin silme (remove) butonu mevcut
- [ ] Alt kisimda: Subtotal, Shipping, Total gosterilir
- [ ] "Proceed to Checkout" butonu mevcut
- [ ] Bos sepet icin empty state gosterilir ("Your cart is empty" + "Start Shopping" butonu)
- [ ] Swipe-to-delete destegi

**Teknik Notlar:**
- Zustand cart store
- Backend sync: `GET /api/v1/cart`, `PATCH /api/v1/cart/items/{itemId}`, `DELETE /api/v1/cart/items/{itemId}`

---

### [US-051] Sepet Miktar Guncelleme
Bir kullanici olarak,
sepetteki bir urunun miktarini degistirmek istiyorum,
boylece istedigim adette satin alabilim.

**Oncelik**: P0 | **Durum**: Backlog | **Sprint**: -

**Kabul Kriterleri:**
- [ ] +/- butonlari ile miktar degisir
- [ ] Minimum miktar 1 (1'den asagi dusurulemez, bunun yerine silme onay dialog cıkar)
- [ ] Maksimum miktar stok adetine bagli
- [ ] Miktar degisince toplam fiyat aninda guncellenir
- [ ] Backend ile senkronize edilir

**Teknik Notlar:**
- Optimistic update + debounce (500ms) ile backend sync

---

## Siparis (Checkout & Order)

### [US-060] Siparis Olusturma
Bir kullanici olarak,
sepettekileri siparis vermek istiyorum,
boylece urunleri satin alabilim.

**Oncelik**: P0 | **Durum**: Backlog | **Sprint**: -

**Kabul Kriterleri:**
- [ ] Checkout ekraninda teslimat adresi formu mevcut (ad, adres, sehir, posta kodu, telefon)
- [ ] Siparis ozeti gosterilir (urunler, adetler, fiyatlar)
- [ ] Toplam tutar (subtotal + shipping) gosterilir
- [ ] "Place Order" butonu ile siparis onaylanir
- [ ] Form validasyonu yapilir (zorunlu alanlar)
- [ ] Basarili siparis sonrasi Order Confirmation ekranina yonlendirilir
- [ ] Basarili siparis sonrasi sepet temizlenir

**Teknik Notlar:**
- Endpoint: `POST /api/v1/orders`
- React Hook Form ile form yonetimi
- Not: MVP'de gercek odeme entegrasyonu yok, mock payment

---

### [US-061] Siparis Onay Ekrani
Bir kullanici olarak,
siparisim basarili oldugunda onay gormek istiyorum,
boylece siparisimin alındigından emin olabilim.

**Oncelik**: P0 | **Durum**: Backlog | **Sprint**: -

**Kabul Kriterleri:**
- [ ] Basari ikonu/animasyonu gosterilir
- [ ] Siparis numarasi gosterilir
- [ ] "Continue Shopping" butonu Home'a yonlendirir
- [ ] "View Orders" butonu profil/siparislerim'e yonlendirir

---

## Profil Yonetimi

### [US-010] Profil Goruntuleme
Bir kullanici olarak,
profil bilgilerimi goruntulemek istiyorum,
boylece hesap bilgilerimi kontrol edebilim.

**Oncelik**: P0 | **Durum**: Backlog | **Sprint**: -

**Kabul Kriterleri:**
- [ ] Profil ekraninda ad, soyad, email, avatar gosterilir
- [ ] "My Orders" bolumu ile siparis gecmisi listesi gosterilir
- [ ] "Settings" linkı ayarlar ekranina yonlendirir
- [ ] Profil bilgileri API'den cekilir
- [ ] Yukleme durumu (loading) gosterilir

**Teknik Notlar:**
- Endpoint: `GET /api/v1/auth/me`
- Endpoint: `GET /api/v1/orders` (siparis listesi)

---

### [US-011] Profil Duzenleme
Bir kullanici olarak,
profil bilgilerimi guncellemek istiyorum,
boylece bilgilerim guncel kalsin.

**Oncelik**: P0 | **Durum**: Backlog | **Sprint**: -

**Kabul Kriterleri:**
- [ ] Ad, soyad, telefon alanlari duzenlenebilir
- [ ] Avatar yukleme/degistirme mumkun
- [ ] Degisiklikler kaydedildiginde basari mesaji gosterilir
- [ ] Form dogrulamasi yapilir
- [ ] Kaydedilmemis degisiklik varsa cikarken uyari gosterilir

---

## Ayarlar (Settings)

### [US-070] Tema Degistirme (Dark Mode)
Bir kullanici olarak,
uygulama temasini light/dark/system olarak degistirmek istiyorum,
boylece tercih ettigim gorunumde kullanabileyim.

**Oncelik**: P0 | **Durum**: Backlog | **Sprint**: -

**Kabul Kriterleri:**
- [ ] Settings ekraninda tema secenegi mevcut (Light / Dark / System)
- [ ] Secim aninda tema degisir
- [ ] Tercih AsyncStorage'da saklanir
- [ ] Uygulama yeniden acildiginda tercih korunur
- [ ] Tum ekranlar dark mode'da dogru gorunur

**Teknik Notlar:**
- Zustand settings store ile persist
- React Native Appearance API ile system theme

---

## Post-MVP Hikayeleri

### [US-006] Sosyal Giris (Google)
**Oncelik**: P2 | **Durum**: Backlog | **Sprint**: -
*Detaylar v1.2 planlamasinda belirlenecek.*

### [US-007] Sosyal Giris (Apple)
**Oncelik**: P2 | **Durum**: Backlog | **Sprint**: -
*Detaylar v1.2 planlamasinda belirlenecek.*

### [US-012] Sifre Degistirme
**Oncelik**: P1 | **Durum**: Backlog | **Sprint**: -
*Detaylar v1.1 planlamasinda belirlenecek.*

### [US-080] Urun Arama ve Filtreleme
**Oncelik**: P1 | **Durum**: Backlog | **Sprint**: -
*Detaylar v1.1 planlamasinda belirlenecek.*

### [US-081] Favoriler / Istek Listesi
**Oncelik**: P1 | **Durum**: Backlog | **Sprint**: -
*Detaylar v1.1 planlamasinda belirlenecek.*

### [US-082] Siparis Takibi
**Oncelik**: P1 | **Durum**: Backlog | **Sprint**: -
*Detaylar v1.1 planlamasinda belirlenecek.*

### [US-083] Push Bildirimler
**Oncelik**: P1 | **Durum**: Backlog | **Sprint**: -
*Detaylar v1.1 planlamasinda belirlenecek.*

### [US-084] Sosyal Medya Urun Paylasimi
**Oncelik**: P1 | **Durum**: Backlog | **Sprint**: -
*Detaylar v1.1 planlamasinda belirlenecek.*

---

## Ozet Tablosu

### MVP (P0)

| ID | Baslik | Grup | Durum | Sprint |
|----|--------|------|-------|--------|
| US-001 | Kullanici Kaydi | Auth | Tamamlandi | Sprint 2 |
| US-002 | Kullanici Girisi | Auth | Tamamlandi | Sprint 2 |
| US-003 | Token Yenileme | Auth | Tamamlandi | Sprint 2 |
| US-004 | Cikis Yapma | Auth | Tamamlandi | Sprint 2 |
| US-005 | Sifre Sifirlama | Auth | Tamamlandi | Sprint 2 |
| US-010 | Profil Goruntuleme | Profil | Tamamlandi | Sprint 5 |
| US-011 | Profil Duzenleme | Profil | Tamamlandi | Sprint 5 |
| US-020 | Ana Sayfa | Home | Tamamlandi | Sprint 3 |
| US-030 | Urun Listeleme | Urun | Tamamlandi | Sprint 3 |
| US-040 | Urun Detay | Urun | Tamamlandi | Sprint 3 |
| US-041 | Sepete Urun Ekleme | Urun | Tamamlandi | Sprint 4 |
| US-050 | Sepet Goruntuleme | Sepet | Tamamlandi | Sprint 4 |
| US-051 | Sepet Miktar Guncelleme | Sepet | Tamamlandi | Sprint 4 |
| US-060 | Siparis Olusturma | Siparis | Tamamlandi | Sprint 4 |
| US-061 | Siparis Onay Ekrani | Siparis | Tamamlandi | Sprint 4 |
| US-070 | Tema Degistirme (Dark Mode) | Ayarlar | Tamamlandi | Sprint 5 |

### Post-MVP (P1/P2)

| ID | Baslik | Oncelik | Hedef |
|----|--------|---------|-------|
| US-012 | Sifre Degistirme | P1 | v1.1 |
| US-080 | Urun Arama ve Filtreleme | P1 | v1.1 |
| US-081 | Favoriler / Istek Listesi | P1 | v1.1 |
| US-082 | Siparis Takibi | P1 | v1.1 |
| US-083 | Push Bildirimler | P1 | v1.1 |
| US-084 | Sosyal Medya Paylasimi | P1 | v1.1 |
| US-006 | Sosyal Giris (Google) | P2 | v1.2 |
| US-007 | Sosyal Giris (Apple) | P2 | v1.2 |

---

*Yeni hikayeler eklendikce ozet tablosu guncellenir. Oncelik degisiklikleri icin Team Lead onayi gereklidir.*
