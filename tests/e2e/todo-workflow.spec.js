const { test, expect } = require('@playwright/test');
const { TodoPage } = require('./pages/TodoPage');

function uniqueTitle(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

test('creates a task', async ({ page }) => {
  const todoPage = new TodoPage(page);
  const title = uniqueTitle('create');

  await todoPage.goto();
  await todoPage.addTask(title);

  await expect(page.getByText(title)).toBeVisible();
});

test('toggles task completion', async ({ page }) => {
  const todoPage = new TodoPage(page);
  const title = uniqueTitle('toggle');

  await todoPage.goto();
  await todoPage.addTask(title);
  await todoPage.toggleTask(title);

  await expect(page.getByText('Task updated successfully')).toBeVisible();
});

test('edits an existing task', async ({ page }) => {
  const todoPage = new TodoPage(page);
  const title = uniqueTitle('edit');
  const updatedTitle = `${title}-updated`;

  await todoPage.goto();
  await todoPage.addTask(title);
  await todoPage.editTaskTitle(title, updatedTitle);

  await expect(page.getByText(updatedTitle)).toBeVisible();
});

test('duplicates an existing task', async ({ page }) => {
  const todoPage = new TodoPage(page);
  const title = uniqueTitle('duplicate');

  await todoPage.goto();
  await todoPage.addTask(title);
  await todoPage.duplicateTask(title);

  await expect(page.getByText(`${title} (Copy)`)).toBeVisible();
});

test('deletes a task and filters completed', async ({ page }) => {
  const todoPage = new TodoPage(page);
  const title = uniqueTitle('delete');

  await todoPage.goto();
  await todoPage.addTask(title);
  await todoPage.deleteTask(title);

  await expect(page.getByText(title)).toHaveCount(0);
});
