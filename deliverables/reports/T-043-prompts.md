## Team Lead Dispatch: T-043

- Date: 2026-02-17
- Status: in_progress

### Codex Prompt

You are the team_lead agent for task T-043.
Task title: todo mvp planning and api contract
Acceptance criteria:
- MVP scope approved and documented
- OpenAPI contract draft exists for auth and task endpoints
- Dispatch prompts generated for backend and frontend agents
Inputs:
- context/feature-specs/todo-mobile-mvp.md
Outputs:
- contracts/api/todo-mvp.yaml
- deliverables/reports/T-043-prompts.md

### Kimi Prompt

Role: Frontend UI Agent (Kimi 2.5)
Task: T-043 - todo mvp planning and api contract
Build UI according to the API contract and provide screen/component level output.
Required states: loading, empty, success, error.
Return: file-by-file changes and integration notes for Codex backend agent.
