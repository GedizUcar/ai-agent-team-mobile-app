# Operations Center - Operasyon Merkezi

Bu klasor, AI ajan takiminin koordinasyonu, is akislari ve kalite kontrolu icin gerekli tum surecleri icerir.

## Klasor Yapisi

```
operations/
├── README.md                          # Bu dosya - navigasyon rehberi
├── hub/                               # Gunluk koordinasyon
│   ├── daily-workflow.md              # Gunluk iterasyon protokolu
│   ├── sprint-planning.md             # Sprint planlama sablonu
│   ├── task-board.md                  # Kanban gorev panosu
│   └── agent-status.md               # Ajan durumu ve musaitligi
├── workflows/                         # Surec tanimlari
│   ├── feature-development.md         # Tasarim→Backend→Frontend→Entegrasyon
│   ├── bug-fix.md                     # Bug triaj ve cozum sureci
│   ├── code-review.md                 # Inceleme matrisi ve kontrol listeleri
│   ├── deployment.md                  # Build/test/deploy pipeline
│   └── release.md                     # Versiyonlama ve release sureci
├── communication/                     # Ajan iletisim protokolleri
│   ├── handoff-protocols.md           # Ajanlar arasi teslimat spesifikasyonlari
│   ├── escalation-paths.md            # Sorun yukseltme yollari
│   └── decision-log-template.md       # ADR (Architecture Decision Record) sablonu
├── quality/                           # Faz gecis kontrol listeleri
│   ├── design-review-gate.md          # Tasarim inceleme kapisi
│   ├── frontend-review-gate.md        # Frontend inceleme kapisi
│   ├── backend-review-gate.md         # Backend inceleme kapisi
│   ├── integration-gate.md            # Entegrasyon kapisi
│   └── release-readiness-gate.md      # Release hazirlik kapisi
└── tracking/                          # Ilerleme takibi
    ├── sprint-log.md                  # Sprint aktivite kaydi
    ├── milestone-tracker.md           # Ust duzey kilometre tasi takibi
    └── decision-log.md                # ADR indeksi
```

## Hizli Erisim

### Gunluk Isler
- **Yeni gune baslarken**: `hub/daily-workflow.md`
- **Gorev durumu**: `hub/task-board.md`
- **Ajan musaitligi**: `hub/agent-status.md`

### Surec Baslangici
- **Yeni ozellik gelistirme**: `workflows/feature-development.md`
- **Bug duzeltme**: `workflows/bug-fix.md`
- **Kod inceleme**: `workflows/code-review.md`
- **Deployment**: `workflows/deployment.md`

### Kalite Kontrol
- **Tasarim ciktisi teslimi**: `quality/design-review-gate.md`
- **Frontend teslimi**: `quality/frontend-review-gate.md`
- **Backend teslimi**: `quality/backend-review-gate.md`
- **Entegrasyon testi**: `quality/integration-gate.md`
- **Release onayi**: `quality/release-readiness-gate.md`

### Koordinasyon
- **Ajan arasi teslimat**: `communication/handoff-protocols.md`
- **Sorun yukseltme**: `communication/escalation-paths.md`
- **Karar kaydi olusturma**: `communication/decision-log-template.md`

### Ilgili Dizinler
- **Proje gereksinimleri**: `../context/`
- **Ajan rolleri**: `../agents/`
- **Teknik standartlar**: `../templates/`
- **Tamamlanan ciktilar**: `../deliverables/`

## Kullanim Ilkeleri

1. **Her is akisi bir surec dosyasina bagli**: Hangi isi yapiyorsaniz, ilgili `workflows/` dosyasini takip edin
2. **Kalite kapilari zorunlu**: Bir fazdan digerine gecmeden once ilgili `quality/` kontrol listesini tamamlayin
3. **Kararlar kayit altinda**: Her onemli karar `communication/decision-log-template.md` kullanilarak `tracking/decision-log.md`'ye eklenir
4. **Gorev panosu guncel tutulur**: `hub/task-board.md` her gorev baslangicinda ve bitisinde guncellenir

---

*Bu operasyon merkezi, AI ajan takiminin verimli ve koordineli calismasini saglar.*
