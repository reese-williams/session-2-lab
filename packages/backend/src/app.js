const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { validateCreateTask, validateUpdateTask } = require('./validation/taskValidation');
const { parseQueryFilters, filterTasks, sortTasks } = require('./utils/taskQuery');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const databasePath = process.env.NODE_ENV === 'test'
  ? ':memory:'
  : path.join(__dirname, '..', 'data', 'todos.db');

if (databasePath !== ':memory:') {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
}

const db = new Database(databasePath);

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    priority TEXT NOT NULL DEFAULT 'medium',
    tags TEXT NOT NULL DEFAULT '[]',
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const insertTaskStmt = db.prepare(`
  INSERT INTO tasks (title, description, due_date, priority, tags, completed)
  VALUES (@title, @description, @dueDate, @priority, @tags, @completed)
`);

function toTaskResponse(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    dueDate: row.due_date,
    priority: row.priority,
    tags: JSON.parse(row.tags || '[]'),
    completed: Boolean(row.completed),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function getTaskById(id) {
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  return toTaskResponse(row);
}

function getAllTasks() {
  const rows = db.prepare('SELECT * FROM tasks').all();
  return rows.map(toTaskResponse);
}

function normalizeId(rawId) {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
}

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running' });
});

app.get('/api/todos', (req, res) => {
  try {
    const filters = parseQueryFilters(req.query);
    const tasks = getAllTasks();
    const filteredTasks = filterTasks(tasks, filters);
    const sortedTasks = sortTasks(filteredTasks, filters);

    res.status(200).json(sortedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/todos', (req, res) => {
  try {
    const validation = validateCreateTask(req.body);
    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const taskData = validation.value;
    const now = new Date().toISOString();
    const result = insertTaskStmt.run({
      ...taskData,
      tags: JSON.stringify(taskData.tags),
      completed: 0,
      createdAt: now,
      updatedAt: now,
    });
    const id = result.lastInsertRowid;

    const newTask = getTaskById(id);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.patch('/api/todos/:id(\\d+)', (req, res) => {
  try {
    const id = normalizeId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = getTaskById(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const validation = validateUpdateTask(req.body);
    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const updates = validation.value;
    const fields = [];
    const params = { id };

    if (Object.prototype.hasOwnProperty.call(updates, 'title')) {
      fields.push('title = @title');
      params.title = updates.title;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'description')) {
      fields.push('description = @description');
      params.description = updates.description;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'dueDate')) {
      fields.push('due_date = @dueDate');
      params.dueDate = updates.dueDate;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'priority')) {
      fields.push('priority = @priority');
      params.priority = updates.priority;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'tags')) {
      fields.push('tags = @tags');
      params.tags = JSON.stringify(updates.tags);
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'completed')) {
      fields.push('completed = @completed');
      params.completed = updates.completed ? 1 : 0;
    }

    fields.push('updated_at = @updatedAt');
    params.updatedAt = new Date().toISOString();

    db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = @id`).run(params);

    const updatedTask = getTaskById(id);
    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/api/todos/:id(\\d+)', (req, res) => {
  try {
    const id = normalizeId(req.params.id);

    if (!id) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = getTaskById(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);

    return res.status(200).json({ message: 'Task deleted successfully', id });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.post('/api/todos/:id(\\d+)/duplicate', (req, res) => {
  try {
    const id = normalizeId(req.params.id);
    if (!id) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const original = getTaskById(id);
    if (!original) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const result = insertTaskStmt.run({
      title: `${original.title} (Copy)`,
      description: original.description,
      dueDate: original.dueDate,
      priority: original.priority,
      tags: JSON.stringify(original.tags),
      completed: 0,
    });

    const duplicatedTask = getTaskById(result.lastInsertRowid);
    return res.status(201).json(duplicatedTask);
  } catch (error) {
    console.error('Error duplicating task:', error);
    return res.status(500).json({ error: 'Failed to duplicate task' });
  }
});

app.post('/api/todos/bulk/complete-visible', (req, res) => {
  try {
    const sourceFilters = req.body && req.body.filters ? req.body.filters : req.body || {};
    const filters = parseQueryFilters(sourceFilters);
    const visibleTasks = sortTasks(filterTasks(getAllTasks(), filters), filters);
    const taskIds = visibleTasks.filter((task) => !task.completed).map((task) => task.id);

    if (taskIds.length === 0) {
      return res.status(200).json({ updatedCount: 0 });
    }

    const placeholders = taskIds.map(() => '?').join(',');
    db.prepare(
      `UPDATE tasks SET completed = 1, updated_at = ? WHERE id IN (${placeholders})`
    ).run(new Date().toISOString(), ...taskIds);

    return res.status(200).json({ updatedCount: taskIds.length });
  } catch (error) {
    console.error('Error completing visible tasks:', error);
    return res.status(500).json({ error: 'Failed to complete visible tasks' });
  }
});

app.delete('/api/todos/completed', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM tasks WHERE completed = 1').run();

    return res.status(200).json({ deletedCount: result.changes });
  } catch (error) {
    console.error('Error clearing completed tasks:', error);
    return res.status(500).json({ error: 'Failed to clear completed tasks' });
  }
});

if (process.env.NODE_ENV === 'test') {
  app.delete('/api/test/reset', (req, res) => {
    db.prepare('DELETE FROM tasks').run();
    res.status(200).json({ status: 'reset' });
  });
}
module.exports = {
  app,
  db,
  getTaskById,
  getAllTasks,
};