const { getDueState } = require('./dueState');

const PRIORITY_WEIGHT = {
  high: 0,
  medium: 1,
  low: 2,
};

function parseQueryFilters(query = {}) {
  return {
    status: query.status || 'all',
    dueState: query.dueState || 'all',
    search: typeof query.search === 'string' ? query.search.trim().toLowerCase() : '',
    sort: query.sort || 'default',
    order: query.order === 'asc' ? 'asc' : 'desc',
  };
}

function filterTasks(tasks, filters) {
  return tasks.filter((task) => {
    if (filters.status === 'active' && task.completed) {
      return false;
    }

    if (filters.status === 'completed' && !task.completed) {
      return false;
    }

    if (filters.dueState !== 'all') {
      const state = getDueState(task.dueDate);
      if (filters.dueState === 'none') {
        if (state !== 'none') {
          return false;
        }
      } else if (state !== filters.dueState) {
        return false;
      }
    }

    if (filters.search) {
      const haystack = `${task.title} ${task.description || ''}`.toLowerCase();
      if (!haystack.includes(filters.search)) {
        return false;
      }
    }

    return true;
  });
}

function compareDueDate(a, b) {
  if (!a && !b) {
    return 0;
  }

  if (!a) {
    return 1;
  }

  if (!b) {
    return -1;
  }

  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
}

function sortDefault(a, b) {
  if (a.completed !== b.completed) {
    return a.completed ? 1 : -1;
  }

  const dueCompare = compareDueDate(a.dueDate, b.dueDate);
  if (dueCompare !== 0) {
    return dueCompare;
  }

  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function sortTasks(tasks, filters) {
  const sorted = [...tasks];

  if (filters.sort === 'default') {
    return sorted.sort(sortDefault);
  }

  if (filters.sort === 'priority') {
    sorted.sort((a, b) => PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]);
  }

  if (filters.sort === 'dueDate') {
    sorted.sort((a, b) => compareDueDate(a.dueDate, b.dueDate));
  }

  if (filters.sort === 'createdAt') {
    sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  if (filters.order === 'desc') {
    sorted.reverse();
  }

  return sorted;
}

module.exports = {
  parseQueryFilters,
  filterTasks,
  sortTasks,
};
