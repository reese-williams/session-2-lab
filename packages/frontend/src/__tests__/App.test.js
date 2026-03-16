import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// Mock server to intercept API requests
const server = setupServer(
  rest.get('/api/todos', (req, res, ctx) => {
    const status = req.url.searchParams.get('status') || 'all';
    const tasks = [
      {
        id: 1,
        title: 'Plan sprint',
        description: 'Prepare backlog',
        dueDate: '2030-01-01',
        priority: 'high',
        tags: ['work'],
        completed: false,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        title: 'Pay bills',
        description: '',
        dueDate: null,
        priority: 'low',
        tags: ['home'],
        completed: true,
        createdAt: '2026-01-02T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      },
    ];

    if (status === 'completed') {
      return res(ctx.status(200), ctx.json(tasks.filter((task) => task.completed)));
    }

    return res(
      ctx.status(200),
      ctx.json(tasks)
    );
  }),
  rest.post('/api/todos', async (req, res, ctx) => {
    const body = await req.json();

    if (!body.title || body.title.trim() === '') {
      return res(
        ctx.status(400),
        ctx.json({ error: 'Task title is required' })
      );
    }

    return res(
      ctx.status(201),
      ctx.json({
        id: 3,
        title: body.title,
        description: body.description || '',
        dueDate: body.dueDate || null,
        priority: body.priority || 'medium',
        tags: body.tags || [],
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
  }),
  rest.patch('/api/todos/:id', async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(200),
      ctx.json({
        id: Number(req.params.id),
        title: body.title || 'Plan sprint',
        description: body.description || '',
        dueDate: body.dueDate || null,
        priority: body.priority || 'medium',
        tags: body.tags || [],
        completed: Boolean(body.completed),
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: new Date().toISOString(),
      })
    );
  }),
  rest.post('/api/todos/:id/duplicate', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: 4,
        title: 'Plan sprint (Copy)',
        description: 'Prepare backlog',
        dueDate: '2030-01-01',
        priority: 'high',
        tags: ['work'],
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
  }),
  rest.delete('/api/todos/:id', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ message: 'Task deleted successfully', id: Number(req.params.id) }));
  }),
  rest.post('/api/todos/bulk/complete-visible', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ updatedCount: 1 }));
  }),
  rest.delete('/api/todos/completed', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ deletedCount: 1 }));
  })
);

// Setup and teardown for the mock server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders page title and task list', async () => {
    render(<App />);

    expect(screen.getByText('Task Planner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Plan sprint')).toBeInTheDocument();
      expect(screen.getByText('Pay bills')).toBeInTheDocument();
    });
  });

  test('creates a task', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = await screen.findByRole('textbox', { name: /task title/i });
    await user.type(input, 'New Task');
    await user.click(screen.getByRole('button', { name: 'Add Task' }));

    await waitFor(() => {
      expect(screen.getByText('Task created successfully')).toBeInTheDocument();
    });
  });

  test('filters completed tasks', async () => {
    const user = userEvent.setup();
    render(<App />);

    const statusSelect = await screen.findByRole('combobox', { name: /status/i });
    await user.click(statusSelect);
    await user.click(screen.getByRole('option', { name: 'Completed' }));

    await waitFor(() => {
      expect(screen.getByText('Pay bills')).toBeInTheDocument();
    });
  });

  test('handles backend failure with feedback', async () => {
    server.use(
      rest.get('/api/todos', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Backend unavailable' }));
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch tasks: Backend unavailable')).toBeInTheDocument();
    });
  });

  test('shows empty state for no tasks', async () => {
    server.use(
      rest.get('/api/todos', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('No tasks match your current filters.')).toBeInTheDocument();
    });
  });
});