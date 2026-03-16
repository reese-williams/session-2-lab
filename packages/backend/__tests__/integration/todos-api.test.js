const request = require('supertest');
const { app } = require('../../src/app');

async function createTask(overrides = {}) {
  const payload = {
    title: 'Test Task',
    description: 'Task description',
    dueDate: '2030-01-01',
    priority: 'medium',
    tags: ['work'],
    ...overrides,
  };

  const response = await request(app).post('/api/todos').send(payload);
  expect(response.status).toBe(201);
  return response.body;
}

beforeEach(async () => {
  await request(app).delete('/api/test/reset');
});

describe('TODO API integration', () => {
  it('creates, updates, and deletes a task', async () => {
    const created = await createTask({ title: 'Integration task' });

    const updateResponse = await request(app)
      .patch(`/api/todos/${created.id}`)
      .send({ title: 'Updated task', completed: true, tags: ['home', 'urgent'] });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.title).toBe('Updated task');
    expect(updateResponse.body.completed).toBe(true);
    expect(updateResponse.body.tags).toEqual(['home', 'urgent']);

    const deleteResponse = await request(app).delete(`/api/todos/${created.id}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toEqual({ message: 'Task deleted successfully', id: created.id });
  });

  it('filters by completed status', async () => {
    const active = await createTask({ title: 'Active task' });
    await createTask({ title: 'Completed task' });

    await request(app).patch(`/api/todos/${active.id}`).send({ completed: true });

    const completedResponse = await request(app).get('/api/todos?status=completed');
    expect(completedResponse.status).toBe(200);
    expect(completedResponse.body.every((task) => task.completed)).toBe(true);
  });

  it('duplicates tasks', async () => {
    const created = await createTask({ title: 'Original' });

    const duplicateResponse = await request(app).post(`/api/todos/${created.id}/duplicate`);
    expect(duplicateResponse.status).toBe(201);
    expect(duplicateResponse.body.title).toBe('Original (Copy)');
    expect(duplicateResponse.body.completed).toBe(false);
  });

  it('marks visible tasks as completed in bulk', async () => {
    await createTask({ title: 'Alpha task' });
    await createTask({ title: 'Beta task' });

    const bulkResponse = await request(app)
      .post('/api/todos/bulk/complete-visible')
      .send({ filters: { status: 'active', search: 'task' } });

    expect(bulkResponse.status).toBe(200);
    expect(bulkResponse.body.updatedCount).toBe(2);

    const activeResponse = await request(app).get('/api/todos?status=active');
    expect(activeResponse.body).toHaveLength(0);
  });

  it('clears completed tasks', async () => {
    const task = await createTask({ title: 'Complete me' });
    await request(app).patch(`/api/todos/${task.id}`).send({ completed: true });

    const clearResponse = await request(app).delete('/api/todos/completed');
    expect(clearResponse.status).toBe(200);
    expect(clearResponse.body.deletedCount).toBe(1);
  });

  it('returns validation errors for bad payloads', async () => {
    const response = await request(app).post('/api/todos').send({ title: '' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Task title is required');
  });
});
