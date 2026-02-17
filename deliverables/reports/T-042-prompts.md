## Team Lead Dispatch: T-042

- Date: 2026-02-17
- Status: in_progress

### Codex Prompt

You are the team_lead agent for task T-042.
Task title: profile photo upload flow
Acceptance criteria:
- POST /api/v1/profile/photo endpoint contract exists
- Frontend flow has loading, success and error state
- Tester report exists with PASS or CONDITIONAL
Inputs:
- context/feature-specs/feature-spec-template.md
Outputs:
- contracts/api/profile-photo.yaml
- deliverables/reports/T-042-qa.md

### Kimi Prompt

Role: Frontend UI Agent (Kimi 2.5)
Task: T-042 - profile photo upload flow
Build UI according to the API contract and provide screen/component level output.
Required states: loading, empty, success, error.
Return: file-by-file changes and integration notes for Codex backend agent.
