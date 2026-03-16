# Testing Guidelines

## Purpose
These guidelines define the required testing approach for the TODO app across backend, frontend, and end-to-end workflows.

## Core Principles
- All tests must be isolated and independent.
- Each test must set up its own data and must not rely on execution order or shared state from other tests.
- Setup and teardown hooks are required where applicable so tests pass consistently across repeated runs.
- All new features must include appropriate automated tests.
- Tests should prioritize maintainability, readability, and deterministic behavior.

## Unit Tests
- Use Jest to test individual functions and React components in isolation.
- Unit test files must use the naming convention `*.test.js` or `*.test.ts`.
- Backend unit tests must be placed in `packages/backend/__tests__/`.
- Frontend unit tests must be placed in `packages/frontend/src/__tests__/`.
- Name unit test files to match what they test (for example: `app.test.js` for `app.js`).

## Integration Tests
- Use Jest + Supertest to test backend API endpoints via real HTTP requests.
- Integration tests must be placed in `packages/backend/__tests__/integration/`.
- Integration test files must use the naming convention `*.test.js` or `*.test.ts`.
- Name integration tests based on the API or behavior under test (for example: `todos-api.test.js`).

## End-to-End (E2E) Tests
- Use Playwright as the required framework for browser automation tests.
- E2E tests must be placed in `tests/e2e/`.
- E2E test files must use the naming convention `*.spec.js` or `*.spec.ts`.
- Name E2E tests based on the user journey under test (for example: `todo-workflow.spec.js`).
- Playwright tests must run on one browser only.
- Playwright tests must use the Page Object Model (POM) pattern.
- Limit E2E coverage to 5-8 critical user journeys, focusing on happy paths and key edge cases.

## Port Configuration
- Always use environment variables with sensible defaults for all port configuration.
- Backend standard:
  - `const PORT = process.env.PORT || 3030;`
- Frontend standard:
  - Use React's default port `3000`, overridable via `PORT` environment variable.
- This convention supports CI/CD workflows where ports are assigned dynamically.

## Quality Expectations
- Tests should be fast enough for local development and reliable enough for CI.
- Avoid brittle selectors and implementation-coupled assertions where possible.
- Keep test data, fixtures, and helper utilities organized by test type.
- Update tests whenever behavior changes to keep coverage aligned with product requirements.
