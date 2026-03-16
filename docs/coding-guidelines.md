# Coding Guidelines

## Purpose
This document defines the coding style and quality principles for the TODO app codebase. The goal is to keep code readable, maintainable, and consistent across backend and frontend packages.

## Style and Formatting
Use a consistent formatting style throughout the project and avoid introducing local exceptions without strong reasons. Keep functions focused, names descriptive, and control flow easy to follow.

Prefer small, composable units over large multi-purpose modules. Code should be written for the next contributor to understand quickly, not just for the compiler to accept.

Follow these baseline rules:
- Keep indentation, spacing, and line breaks consistent with surrounding code.
- Prefer meaningful names over abbreviations.
- Avoid deeply nested logic when guard clauses can simplify readability.
- Keep files cohesive: each file should have a clear responsibility.

## Import Organization
Imports should be organized in a predictable order to reduce merge noise and improve readability.

Use this order when possible:
- External packages first.
- Internal modules next.
- Relative imports last.

Additional import rules:
- Remove unused imports promptly.
- Avoid circular dependencies.
- Prefer explicit imports over broad wildcard-style imports.
- Group related imports together and keep ordering stable.

## Linting and Static Quality Gates
Linting is required and should be treated as a quality gate, not an optional suggestion. Run lint checks before commits and ensure warnings are understood and resolved when practical.

General expectations:
- Keep the codebase warning-free where feasible.
- Do not disable lint rules unless there is a documented, justified reason.
- Favor lint-compliant patterns that improve readability and reliability.

## DRY and Reuse Principles
Apply the DRY principle thoughtfully: remove unnecessary duplication while preserving clarity.

Guidelines for reuse:
- Extract repeated logic into shared utilities, hooks, or helper functions.
- Prefer reusable UI components for repeated frontend patterns.
- Centralize constants and configuration values that appear in multiple places.
- Avoid premature abstraction; duplicate once if needed, then extract when patterns are stable.

## Reliability and Maintainability
Code should be easy to change safely.

Maintainability practices:
- Keep function and component responsibilities narrow.
- Handle errors explicitly and fail with useful messages.
- Avoid hidden side effects and implicit state changes.
- Write code that is easy to test in isolation.
- Add comments only when the reasoning is not obvious from the code itself.

## Backend and Frontend Consistency
Even though backend and frontend have different concerns, core quality standards should match.

Cross-cutting expectations:
- Use consistent naming conventions for similar concepts.
- Keep API contracts explicit and validated.
- Separate domain logic from transport or presentation concerns.
- Avoid leaking infrastructure details into business logic.

## Review and Continuous Improvement
Code reviews should reinforce these guidelines. Review feedback should prioritize correctness, readability, testability, and long-term maintainability.

When conventions become unclear or outdated, update this document so the team has one reliable source of truth.
