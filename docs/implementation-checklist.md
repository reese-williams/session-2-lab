# TODO App Expansion Implementation Checklist

This checklist converts the functional, UI, testing, and coding guidelines into an execution sequence.

## 1) Data Contract (Backend + Frontend Shared)

### 1.1 Task model
- [ ] Define a canonical `Task` shape used by API and UI.
- [ ] Include fields:
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
- [ ] Keep response payloads consistent (`Task` object for create/update/fetch one, `Task[]` for list).
- [ ] Keep error payloads consistent: `{ error: string, details?: object }`.

## 2) Backend Implementation

### 2.1 Persistence + schema
Target files:
- `packages/backend/src/app.js`
- `packages/backend/src/index.js`

Tasks:
- [ ] Replace in-memory DB with file-backed SQLite for restart persistence.
- [ ] Add `tasks` table with all required columns.
- [ ] Add migration/init SQL that is idempotent (`CREATE TABLE IF NOT EXISTS`).
- [ ] Ensure server port follows `const PORT = process.env.PORT || 3030;`.

### 2.2 API endpoints
Target files:
- `packages/backend/src/app.js`

Tasks:
- [ ] `GET /api/todos`
  - Query params:
    - `status=all|active|completed`
    - `dueState=all|overdue|today|upcoming|none`
    - `search=<text>` (title + description)
    - `sort=default|dueDate|priority|createdAt`
    - `order=asc|desc` (for non-default sort)
- [ ] `POST /api/todos`
  - Request: `{ title, description?, dueDate?, priority?, tags? }`
  - Validate title required.
- [ ] `PATCH /api/todos/:id`
  - Allow updates for title/details and complete toggle.
  - Always bump `updatedAt`.
- [ ] `DELETE /api/todos/:id`
- [ ] `POST /api/todos/:id/duplicate`
- [ ] `POST /api/todos/bulk/complete-visible`
  - Request should accept active filter context (status/dueState/search).
- [ ] `DELETE /api/todos/completed`

### 2.3 Validation and business logic
Target files (recommended to create):
- `packages/backend/src/validation/taskValidation.js`
- `packages/backend/src/utils/taskQuery.js`
- `packages/backend/src/utils/dueState.js`

Tasks:
- [ ] Validate title, dueDate, priority, tags.
- [ ] Centralize due-state calculation (`overdue`, `today`, `upcoming`, `none`).
- [ ] Implement default sort exactly:
  1. incomplete first
  2. earliest due date first (null dates last)
  3. newest created first
- [ ] Implement manual sort overrides.

## 3) Frontend Implementation

### 3.1 UI foundation with MUI
Target files:
- `packages/frontend/src/App.js`
- `packages/frontend/src/App.css`
- `packages/frontend/src/index.css`
- `packages/frontend/src/index.js`

Tasks:
- [ ] Install and configure MUI dependencies.
- [ ] Define theme palette per UI guidelines:
  - primary `#2563EB`
  - secondary `#0F766E`
  - success `#16A34A`
  - warning `#D97706`
  - error `#DC2626`
  - neutral backgrounds/text as specified
- [ ] Apply light-first theme and typography roles (`h4`, `h6`, `body1`, `body2`).
- [ ] Use 8px spacing rhythm.

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
- [ ] Keep `App.js` orchestration-focused.
- [ ] Move fetch logic into API module.
- [ ] Keep form state and list/filter state predictable and testable.

### 3.3 Feature slices (UI + API integration)
Tasks:
- [ ] Create task (required title validation)
- [ ] View list
- [ ] Edit task title/details
- [ ] Toggle complete/active
- [ ] Delete task
- [ ] Set due date, priority, tags
- [ ] Filter by status
- [ ] Filter by due-state
- [ ] Search title + description
- [ ] Manual sort controls
- [ ] Clear completed
- [ ] Mark all visible completed
- [ ] Duplicate task
- [ ] Persist behavior verified across refresh and browser restart

### 3.4 Accessibility + feedback
Tasks:
- [ ] Keyboard-only completion of all core actions.
- [ ] Visible focus indicators on all interactive controls.
- [ ] Inline validation messaging for required fields.
- [ ] Snackbar success/error messages after create/edit/delete.
- [ ] Confirmation dialog for destructive bulk actions.
- [ ] Completed tasks are visually distinct beyond color alone.

## 4) Testing Plan

### 4.1 Backend tests
Target files:
- `packages/backend/__tests__/app.test.js`
- `packages/backend/__tests__/integration/todos-api.test.js` (new)

Tasks:
- [ ] Unit coverage for validation and due-state helpers.
- [ ] Integration coverage for all TODO endpoints and key error cases.
- [ ] Ensure test isolation and deterministic setup/teardown.

### 4.2 Frontend tests
Target files:
- `packages/frontend/src/__tests__/App.test.js`
- `packages/frontend/src/__tests__/TaskForm.test.js` (new)
- `packages/frontend/src/__tests__/TaskList.test.js` (new)
- `packages/frontend/src/__tests__/FilterBar.test.js` (new)

Tasks:
- [ ] Update existing tests from "items" behavior to TODO behavior.
- [ ] Add tests for create/edit/complete/delete.
- [ ] Add tests for search/filter/sort.
- [ ] Add tests for bulk actions and snackbar/dialog flows.

### 4.3 E2E tests (Playwright)
Target files:
- `tests/e2e/todo-workflow.spec.js` (new)
- `tests/e2e/pages/TodoPage.js` (new)

Tasks:
- [ ] Add 5-8 critical journey tests only.
- [ ] Use one browser.
- [ ] Use Page Object Model.
- [ ] Ensure test independence and no order coupling.

## 5) Suggested Execution Order (Incremental)

### Milestone A: Core CRUD
- [ ] Backend schema + CRUD endpoints
- [ ] Frontend create/list/delete/complete
- [ ] Basic backend + frontend tests for CRUD

### Milestone B: Task metadata
- [ ] Description, due date, priority, tags support
- [ ] Validation and display improvements
- [ ] Add/extend tests

### Milestone C: Organize and search
- [ ] Default sort and manual sort controls
- [ ] Status + due-state filters
- [ ] Search by title/description
- [ ] Add/extend tests

### Milestone D: Productivity actions
- [ ] Duplicate task
- [ ] Clear completed
- [ ] Mark visible tasks complete
- [ ] Add/extend tests

### Milestone E: UX hardening + E2E
- [ ] Accessibility pass (keyboard/focus/labels)
- [ ] Snackbar/dialog feedback behavior
- [ ] Responsive behavior checks
- [ ] Add Playwright suite

## 6) Definition of Done
- [ ] Every requirement in `docs/functional-requirements.md` is implemented.
- [ ] UI behavior and styling align to `docs/ui-guidelines.md`.
- [ ] Tests follow `docs/testing-guidelines.md` and pass in CI/local.
- [ ] Code organization and quality align to `docs/coding-guidelines.md`.
- [ ] Root scripts run cleanly: `npm test`, `npm run test:integration`, `npm run test:e2e`, `npm run test:all`.
