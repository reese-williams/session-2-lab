const ALLOWED_PRIORITIES = ['low', 'medium', 'high'];

function normalizeText(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}

function normalizeTags(tags) {
  if (!tags) {
    return [];
  }

  if (!Array.isArray(tags)) {
    return null;
  }

  const normalizedTags = tags
    .map((tag) => (typeof tag === 'string' ? tag.trim() : ''))
    .filter(Boolean);

  return [...new Set(normalizedTags)];
}

function isValidDateOnly(value) {
  if (!value) {
    return true;
  }

  if (typeof value !== 'string') {
    return false;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validateCreateTask(payload = {}) {
  const title = normalizeText(payload.title);
  const description = payload.description ? String(payload.description).trim() : '';
  const dueDate = payload.dueDate ? String(payload.dueDate).trim() : null;
  const priority = payload.priority ? String(payload.priority).toLowerCase() : 'medium';
  const tags = normalizeTags(payload.tags);

  if (!title) {
    return { error: 'Task title is required' };
  }

  if (!ALLOWED_PRIORITIES.includes(priority)) {
    return { error: 'Priority must be one of: low, medium, high' };
  }

  if (!isValidDateOnly(dueDate)) {
    return { error: 'Due date must be in YYYY-MM-DD format' };
  }

  if (tags === null) {
    return { error: 'Tags must be an array of strings' };
  }

  return {
    value: {
      title,
      description,
      dueDate,
      priority,
      tags,
    },
  };
}

function validateUpdateTask(payload = {}) {
  const updates = {};

  if (Object.prototype.hasOwnProperty.call(payload, 'title')) {
    const title = normalizeText(payload.title);
    if (!title) {
      return { error: 'Task title is required' };
    }
    updates.title = title;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'description')) {
    updates.description = payload.description ? String(payload.description).trim() : '';
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'dueDate')) {
    const dueDate = payload.dueDate ? String(payload.dueDate).trim() : null;
    if (!isValidDateOnly(dueDate)) {
      return { error: 'Due date must be in YYYY-MM-DD format' };
    }
    updates.dueDate = dueDate;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'priority')) {
    const priority = String(payload.priority || '').toLowerCase();
    if (!ALLOWED_PRIORITIES.includes(priority)) {
      return { error: 'Priority must be one of: low, medium, high' };
    }
    updates.priority = priority;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'tags')) {
    const tags = normalizeTags(payload.tags);
    if (tags === null) {
      return { error: 'Tags must be an array of strings' };
    }
    updates.tags = tags;
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'completed')) {
    if (typeof payload.completed !== 'boolean') {
      return { error: 'Completed must be a boolean' };
    }
    updates.completed = payload.completed;
  }

  if (Object.keys(updates).length === 0) {
    return { error: 'At least one valid field is required to update task' };
  }

  return { value: updates };
}

module.exports = {
  ALLOWED_PRIORITIES,
  validateCreateTask,
  validateUpdateTask,
};
