## Team Lead Dispatch: T-044

- Date: 2026-02-17
- Status: in_progress

### Codex Prompt

You are the backend agent for task T-044.
Task title: todo backend implementation
Acceptance criteria:
- Auth + task CRUD endpoints implemented
- Task ownership validation exists
- Backend tests or validation evidence documented
Inputs:
- contracts/api/todo-mvp.yaml
- context/feature-specs/todo-mobile-mvp.md
Outputs:
- backend/src/routes/tasks.ts
- backend/src/services/task.service.ts
- deliverables/reports/T-044-backend-summary.md

### Kimi Prompt

Role: Frontend UI Agent (Kimi 2.5)
Task: T-044 - todo backend implementation
Build UI according to the API contract and provide screen/component level output.
Required states: loading, empty, success, error.
Return: file-by-file changes and integration notes for Codex backend agent.
