# TODO App Functional Requirements

## Core Task Management
- The user can create a new task with a required title.
- The user can view all existing tasks in a task list.
- The user can edit a task title.
- The user can mark a task as completed.
- The user can mark a completed task as active again.
- The user can delete a task.

## Task Details
- The user can add an optional description to a task.
- The user can add an optional due date to a task.
- The user can assign an optional priority level to a task (low, medium, high).
- The user can add one or more optional tags to a task.

## Task Organization and Ordering
- Tasks are sorted by default in this order: incomplete before completed, then earliest due date first, then newest created first.
- The user can manually change the sort order (for example by due date, priority, or creation date).
- The user can filter tasks by status (all, active, completed).
- The user can filter tasks by due date state (overdue, due today, upcoming, no due date).
- The user can search tasks by title and description text.

## Bulk and Productivity Actions
- The user can clear all completed tasks in one action.
- The user can mark all visible tasks as completed in one action.
- The user can duplicate an existing task.

## Data Persistence and Reliability
- Task data persists after page refresh and browser restart.
- The app validates required fields and prevents saving an empty task title.
- The app stores each task with a unique identifier.
- The app records creation and last-updated timestamps for each task.

## Accessibility and Feedback
- The user can complete all core task actions using keyboard-only navigation.
- The app provides clear success or error feedback after create, edit, and delete actions.
- Completed tasks are visually distinguishable from active tasks.
