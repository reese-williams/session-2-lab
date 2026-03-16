const request = require('supertest');
const { app, db } = require('../src/app');
const { getDueState } = require('../src/utils/dueState');
const { validateCreateTask } = require('../src/validation/taskValidation');

beforeEach(async () => {
  await request(app).delete('/api/test/reset');
});

// Close the database connection after all tests
afterAll(() => {
  if (db) {
    db.close();
  }
});

describe('Task Validation Helpers', () => {
  it('validates required title', () => {
    const result = validateCreateTask({ title: '   ' });
    expect(result.error).toBe('Task title is required');
  });

  it('computes due states', () => {
    expect(getDueState(null)).toBe('none');
  });
});

describe('API Health', () => {
  it('returns healthy root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
  });

  it('creates and lists todos', async () => {
    const createResponse = await request(app)
      .post('/api/todos')
      .send({ title: 'Write tests', priority: 'high' });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.title).toBe('Write tests');

    const listResponse = await request(app).get('/api/todos');
    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);
  });
});