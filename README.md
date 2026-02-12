# AI Agent Team - Mobile App Development

## Proje Vizyonu

Bu proje, yapay zeka destekli bir yazilim gelistirme takimi tarafindan yonetilen profesyonel bir mobil uygulama gelistirme surecidir. Her bir AI ajani, kendi uzmanlik alaninda gorev alarak, insan gelisitiriciyle birlikte iteratif ve kontrollü bir sekilde projeyi ilerletir.

## Takim Yapisi

| Ajan | Rol | Durum |
|------|-----|-------|
| Team Lead | Proje yonetimi, koordinasyon, kalite kontrol | Aktif |
| Designer | UI/UX tasarim, wireframe, mockup | Aktif |
| Frontend | Mobil arayuz gelistirme (React Native) | Aktif |
| Backend | API ve veritabani gelistirme (Node.js + PostgreSQL) | Aktif |

## Klasor Yapisi

```
ai-agent-team-mobile-app/
├── agents/              # AI ajan rol tanimlari ve talimatlari
│   ├── team_lead/       # Takim lideri ajani
│   ├── designer/        # Tasarimci ajani
│   ├── frontend/        # Frontend ajani
│   └── backend/         # Backend ajani
├── context/             # Proje baglami ve gereksinimler
│   ├── project-requirements.md   # Urun gereksinimleri
│   ├── user-stories.md           # Kullanici hikayesi backlog
│   ├── feature-specs/            # Ozellik bazli spesifikasyonlar
│   ├── technical-constraints.md  # Teknik kisitlamalar ve kararlar
│   └── glossary.md               # Turkce↔Ingilizce terimler sozlugu
├── operations/          # Operasyon merkezi - koordinasyon altyapisi
│   ├── hub/             # Gunluk koordinasyon (gorev panosu, sprint, ajan durumu)
│   ├── workflows/       # Surec tanimlari (ozellik, bug, review, deploy, release)
│   ├── communication/   # Ajan iletisim protokolleri (handoff, escalation, ADR)
│   ├── quality/         # Kalite kapilari (tasarim, frontend, backend, entegrasyon, release)
│   └── tracking/        # Ilerleme takibi (sprint kaydi, kilometre tasi, karar kaydi)
├── templates/           # Kod ve dokuman sablonlari
│   ├── design/          # Tasarim sablonlari ve standartlari
│   ├── frontend/        # Frontend sablonlari ve standartlari
│   └── backend/         # Backend sablonlari ve standartlari
├── data/                # Veri dosyalari ve mock data
├── deliverables/        # Tamamlanan ciktilar
├── tests/               # Test dosyalari
└── README.md            # Bu dosya
```

## Calisma Prensibi

1. **Iteratif Gelistirme**: Her gun tek bir ajan ve tek bir bolum uzerinde calisilir
2. **Onay Mekanizmasi**: Her asamanin sonunda insan gelistiriciden onay alinir
3. **Dokumantasyon**: Tum kararlar ve ilerlemeler dokumante edilir
4. **Kalite Kontrol**: Team Lead tum ciktilari denetler

## Mevcut Asama

**Gun 1**: Proje iskeleti ve Team Lead ajan kurulumu (Tamamlandi)
**Gun 2**: Designer ajani kurulumu ve tasarim standartlari (Tamamlandi)
**Gun 3**: Frontend ajani kurulumu ve gelistirme standartlari (Tamamlandi)
**Gun 4**: Backend ajani kurulumu ve API/DB standartlari (Tamamlandi)
**Gun 5**: Operasyon merkezi kurulumu (Tamamlandi)

## Operasyon Merkezi

Proje koordinasyonu, is akislari ve kalite kontrol surecleri `operations/` dizininde tanimlanmistir. Detayli navigasyon icin: `operations/README.md`

---

*Bu proje, AI-insan isbirligi ile gelistirilmektedir.*
