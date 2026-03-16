# TODO App Expansion Implementation Checklist

This checklist converts the functional, UI, testing, and coding guidelines into an execution sequence.

## 1) Data Contract (Backend + Frontend Shared)

### 1.1 Task model
- [x] Define a canonical `Task` shape used by API and UI.
- [x] Include fields:
  - `id` (number, unique)
  - `title` (string, required, non-empty after trim)
  - `description` (string, optional)
  - `dueDate` (string ISO date or `null`)
  - `priority` (`low` | `medium` | `high`)
  - `tags` (array of strings)
  - `completed` (boolean)
  - `createdAt` (timestamp)
  - `updatedAt` (timestamp)

### 1.2 API response envelope
- [x] Keep response payloads consistent (`Task` object for create/update/fetch one, `Task[]` for list).
- [x] Keep error payloads consistent: `{ error: string, details?: object }`.

## 2) Backend Implementation

### 2.1 Persistence + schema
Target files:
- `packages/backend/src/app.js`
- `packages/backend/src/index.js`

Tasks:
- [x] Replace in-memory DB with file-backed SQLite for restart persistence.
- [x] Add `tasks` table with all required columns.
- [x] Add migration/init SQL that is idempotent (`CREATE TABLE IF NOT EXISTS`).
- [x] Ensure server port follows `const PORT = process.env.PORT || 3030;`.

### 2.2 API endpoints
Target files:
- `packages/backend/src/app.js`

Tasks:
- [x] `GET /api/todos`
  - Query params:
    - `status=all|active|completed`
    - `dueState=all|overdue|today|upcoming|none`
    - `search=<text>` (title + description)
    - `sort=default|dueDate|priority|createdAt`
    - `order=asc|desc` (for non-default sort)
- [x] `POST /api/todos`
  - Request: `{ title, description?, dueDate?, priority?, tags? }`
  - Validate title required.
- [x] `PATCH /api/todos/:id`
  - Allow updates for title/details and complete toggle.
  - Always bump `updatedAt`.
- [x] `DELETE /api/todos/:id`
- [x] `POST /api/todos/:id/duplicate`
- [x] `POST /api/todos/bulk/complete-visible`
  - Request should accept active filter context (status/dueState/search).
- [x] `DELETE /api/todos/completed`

### 2.3 Validation and business logic
Target files (recommended to create):
- `packages/backend/src/validation/taskValidation.js`
- `packages/backend/src/utils/taskQuery.js`
- `packages/backend/src/utils/dueState.js`

Tasks:
- [x] Validate title, dueDate, priority, tags.
- [x] Centralize due-state calculation (`overdue`, `today`, `upcoming`, `none`).
- [x] Implement default sort exactly:
  1. incomplete first
  2. earliest due date first (null dates last)
  3. newest created first
- [x] Implement manual sort overrides.

## 3) Frontend Implementation

### 3.1 UI foundation with MUI
Target files:
- `packages/frontend/src/App.js`
- `packages/frontend/src/App.css`
- `packages/frontend/src/index.css`
- `packages/frontend/src/index.js`

Tasks:
- [x] Install and configure MUI dependencies.
- [x] Define theme palette per UI guidelines:
  - primary `#2563EB`
  - secondary `#0F766E`
  - success `#16A34A`
  - warning `#D97706`
  - error `#DC2626`
  - neutral backgrounds/text as specified
- [x] Apply light-first theme and typography roles (`h4`, `h6`, `body1`, `body2`).
- [x] Use 8px spacing rhythm.

### 3.2 Component decomposition
Target files (recommended to create):
- `packages/frontend/src/components/TaskForm.js`
- `packages/frontend/src/components/TaskList.js`
- `packages/frontend/src/components/TaskItem.js`
- `packages/frontend/src/components/FilterBar.js`
- `packages/frontend/src/components/SortControl.js`
- `packages/frontend/src/components/BulkActions.js`
- `packages/frontend/src/components/ConfirmDialog.js`
- `packages/frontend/src/components/FeedbackSnackbar.js`
- `packages/frontend/src/api/tasksApi.js`

Tasks:
- [x] Keep `App.js` orchestration-focused.
- [x] Move fetch logic into API module.
- [x] Keep form state and list/filter state predictable and testable.

### 3.3 Feature slices (UI + API integration)
Tasks:
- [x] Create task (required title validation)
- [x] View list
- [x] Edit task title/details
- [x] Toggle complete/active
- [x] Delete task
- [x] Set due date, priority, tags
- [x] Filter by status
- [x] Filter by due-state
- [x] Search title + description
- [x] Manual sort controls
- [x] Clear completed
- [x] Mark all visible completed
- [x] Duplicate task
- [x] Persist behavior verified across refresh and browser restart

### 3.4 Accessibility + feedback
Tasks:
- [x] Keyboard-only completion of all core actions.
- [x] Visible focus indicators on all interactive controls.
- [x] Inline validation messaging for required fields.
- [x] Snackbar success/error messages after create/edit/delete.
- [x] Confirmation dialog for destructive bulk actions.
- [x] Completed tasks are visually distinct beyond color alone.

## 4) Testing Plan

### 4.1 Backend tests
Target files:
- `packages/backend/__tests__/app.test.js`
- `packages/backend/__tests__/integration/todos-api.test.js` (new)

Tasks:
- [x] Unit coverage for validation and due-state helpers.
- [x] Integration coverage for all TODO endpoints and key error cases.
- [x] Ensure test isolation and deterministic setup/teardown.

### 4.2 Frontend tests
Target files:
- `packages/frontend/src/__tests__/App.test.js`
- `packages/frontend/src/__tests__/TaskForm.test.js` (new)
- `packages/frontend/src/__tests__/TaskList.test.js` (new)
- `packages/frontend/src/__tests__/FilterBar.test.js` (new)

Tasks:
- [x] Update existing tests from "items" behavior to TODO behavior.
- [x] Add tests for create/edit/complete/delete.
- [x] Add tests for search/filter/sort.
- [x] Add tests for bulk actions and snackbar/dialog flows.

### 4.3 E2E tests (Playwright)
Target files:
- `tests/e2e/todo-workflow.spec.js` (new)
- `tests/e2e/pages/TodoPage.js` (new)

Tasks:
- [x] Add 5-8 critical journey tests only.
- [x] Use one browser.
- [x] Use Page Object Model.
- [x] Ensure test independence and no order coupling.

## 5) Suggested Execution Order (Incremental)

### Milestone A: Core CRUD
- [x] Backend schema + CRUD endpoints
- [x] Frontend create/list/delete/complete
- [x] Basic backend + frontend tests for CRUD

### Milestone B: Task metadata
- [x] Description, due date, priority, tags support
- [x] Validation and display improvements
- [x] Add/extend tests

### Milestone C: Organize and search
- [x] Default sort and manual sort controls
- [x] Status + due-state filters
- [x] Search by title/description
- [x] Add/extend tests

### Milestone D: Productivity actions
- [x] Duplicate task
- [x] Clear completed
- [x] Mark visible tasks complete
- [x] Add/extend tests

### Milestone E: UX hardening + E2E
- [x] Accessibility pass (keyboard/focus/labels)
- [x] Snackbar/dialog feedback behavior
- [x] Responsive behavior checks
- [x] Add Playwright suite

## 6) Definition of Done
- [x] Every requirement in `docs/functional-requirements.md` is implemented.
- [x] UI behavior and styling align to `docs/ui-guidelines.md`.
- [x] Tests follow `docs/testing-guidelines.md` and pass in CI/local.
- [x] Code organization and quality align to `docs/coding-guidelines.md`.
- [x] Root scripts run cleanly: `npm test`, `npm run test:integration`, `npm run test:e2e`, `npm run test:all`.
