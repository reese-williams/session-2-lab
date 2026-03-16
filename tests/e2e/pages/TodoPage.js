class TodoPage {
  constructor(page) {
    this.page = page;
    this.titleInput = page.getByLabel('Task title');
    this.addButton = page.getByRole('button', { name: 'Add Task' });
    this.statusSelect = page.getByLabel('Status');
    this.searchInput = page.getByLabel('Search title or description');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.getByText('Task Planner').waitFor();
  }

  async addTask(title) {
    await this.titleInput.fill(title);
    await this.addButton.click();
    await this.page.getByText('Task created successfully').waitFor();
  }

  async openTaskActions(taskTitle) {
    const taskCard = this.page.locator('.MuiCard-root').filter({ hasText: taskTitle }).first();
    await taskCard.waitFor();
    return taskCard;
  }

  async toggleTask(taskTitle) {
    const taskCard = await this.openTaskActions(taskTitle);
    await taskCard.getByRole('checkbox').click();
  }

  async editTaskTitle(oldTitle, newTitle) {
    const taskCard = await this.openTaskActions(oldTitle);
    await taskCard.getByRole('button', { name: 'Edit' }).click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('textbox', { name: 'Title' }).fill(newTitle);
    await dialog.getByRole('button', { name: 'Save' }).click();
    await this.page.getByText('Task updated successfully').waitFor();
  }

  async duplicateTask(taskTitle) {
    const taskCard = await this.openTaskActions(taskTitle);
    await taskCard.getByRole('button', { name: 'Duplicate' }).click();
    await this.page.getByText('Task duplicated successfully').waitFor();
  }

  async deleteTask(taskTitle) {
    const taskCard = await this.openTaskActions(taskTitle);
    await taskCard.getByRole('button', { name: 'Delete' }).click();
    await this.page.getByRole('button', { name: 'Delete' }).last().click();
    await this.page.getByText('Task deleted successfully').waitFor();
  }
}

module.exports = { TodoPage };
