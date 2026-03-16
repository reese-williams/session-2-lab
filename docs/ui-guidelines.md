# TODO App UI Guidelines

## Design System and Components
- Use Material UI (MUI) components as the default UI library for consistency and accessibility.
- Prefer MUI primitives (`Container`, `Grid`, `Stack`, `Card`, `Button`, `TextField`, `Checkbox`, `Chip`, `Dialog`, `Snackbar`) before creating custom components.
- Keep component behavior predictable by using standard Material interaction patterns (hover, focus, active, disabled).

## Visual Style
- Use a light-first theme with strong contrast and clear visual hierarchy.
- Define and reuse a single color palette across the app:
  - Primary: `#2563EB` (actions, links, selected states)
  - Secondary: `#0F766E` (supporting accents)
  - Success: `#16A34A` (completed states)
  - Warning: `#D97706` (due soon)
  - Error: `#DC2626` (validation and destructive actions)
  - Neutral backgrounds: `#F8FAFC`, `#E2E8F0`, `#0F172A` for text
- Avoid using color alone to communicate state; always pair with text, icon, or pattern.

## Typography and Spacing
- Use the Material typography scale with clear roles:
  - Page title: `h4`
  - Section headers: `h6`
  - Body: `body1`
  - Metadata/helper text: `body2`
- Use an 8px spacing system for margins, padding, and gaps.
- Keep line length readable and avoid dense layouts, especially in task lists.

## Task List and Interaction Patterns
- Show each task in a clearly separated row or card with checkbox, title, due date, and quick actions.
- Completed tasks must be visually distinct (for example: muted color + strikethrough title).
- Primary action button ("Add Task") should be visually dominant and consistently placed.
- Destructive actions (delete, clear completed) must require clear affordance and confirmation when bulk.
- Ensure touch targets are at least 44x44px for mobile usability.

## Buttons and Inputs
- Use button variants consistently:
  - Primary actions: `contained`
  - Secondary actions: `outlined`
  - Low-emphasis actions: `text`
- Keep button labels action-oriented (for example: "Add Task", "Save", "Delete").
- Forms must show inline validation messages and clear error styling.
- Required fields must be labeled and announced to assistive technologies.

## Feedback and Motion
- Use `Snackbar` for non-blocking success/error feedback after create, edit, and delete actions.
- Use `Dialog` for destructive confirmations and critical decisions.
- Keep motion subtle and meaningful (150-250ms transitions) to support orientation, not decoration.
- Respect reduced-motion preferences by minimizing or disabling non-essential animations.

## Responsive Behavior
- Support mobile, tablet, and desktop layouts.
- On small screens, stack controls vertically and keep primary actions visible without horizontal scrolling.
- Keep the task list performant and legible for long lists.

## Accessibility Requirements
- Meet WCAG 2.1 AA contrast requirements for text and interactive controls.
- Ensure full keyboard navigation for all core flows (add, edit, complete, filter, delete).
- Provide visible focus indicators for all interactive elements.
- Use semantic HTML and ARIA only when needed to improve screen reader clarity.
- Ensure status changes (for example: task completed) are announced accessibly when appropriate.
