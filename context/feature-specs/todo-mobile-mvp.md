# Feature Spec: To-Do List Mobile App (MVP)

## Feature ID
- FEAT-TODO-MVP

## Objective
Minimal ama production-disiplininde bir mobil To-Do uygulamasi gelistirmek.
Amaç: agent orkestrasyonunu dogrulayan net bir pilot feature.

## Scope (In)
- Kullanici kaydi/girisi (email + password)
- To-do CRUD
  - olusturma
  - listeleme
  - guncelleme (title, note, due date)
  - tamamlama/geri alma
  - silme
- Filtreleme
  - all
  - active
  - completed
- Basit profil ekrani (kullanici adi + logout)

## Scope (Out)
- Real-time collaboration
- Push notifications
- Offline-first sync
- Attachments/files

## User Stories
1. Kullanici olarak kayit olup giris yapabilmek istiyorum.
2. Kullanici olarak yeni gorev ekleyebilmek istiyorum.
3. Kullanici olarak gorevlerimi durumuna gore filtrelemek istiyorum.
4. Kullanici olarak gorevimi tamamlandi olarak isaretlemek istiyorum.
5. Kullanici olarak gorevimi silebilmek istiyorum.

## Functional Requirements
- FR-001: Auth endpointleri token tabanli calismali.
- FR-002: Her gorev `user_id` ile iliskili olmali.
- FR-003: Task list API'si filtre parametresi kabul etmeli.
- FR-004: UI loading/empty/error state gostermeli.
- FR-005: QA webhook ile PASS/FAIL sonucu task'a islenmeli.

## Non-Functional Requirements
- API response p95 < 250ms (MVP hedef)
- Kritik akislarda net hata mesaji
- Kod ve kararlar dokumante olmali

## API Surface (Target)
- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- GET `/api/v1/tasks?filter=all|active|completed`
- POST `/api/v1/tasks`
- PATCH `/api/v1/tasks/:id`
- PATCH `/api/v1/tasks/:id/toggle`
- DELETE `/api/v1/tasks/:id`

## Data Model (Target)
- Task
  - id (uuid)
  - user_id (uuid)
  - title (string, required)
  - note (string, optional)
  - is_completed (boolean)
  - due_date (datetime, optional)
  - created_at
  - updated_at

## Acceptance Criteria (Feature)
- [ ] Auth + task CRUD akisi uctan uca calisiyor
- [ ] Filter sekmeleri dogru veri gosteriyor
- [ ] QA sonucu `PASS` veya `CONDITIONAL` olarak raporlandi
- [ ] Hata ve bos liste durumlari UI'da gorunur

## Risks
- n8n cloud <-> local bridge network baglantisi
- Task state uyumsuzlugu (frontend cache invalidation)

## Deliverables
- `contracts/api/todo-mvp.yaml`
- Backend endpoint implementasyonlari
- Mobile ekranlar (Auth, Task List, Task Form, Profile)
- QA raporu (`deliverables/reports/T-046-qa.md`)
