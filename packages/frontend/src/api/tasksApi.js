const BASE_URL = '/api/todos';

function buildQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    let message = 'Request failed';

    try {
      const errorPayload = await response.json();
      message = errorPayload.error || message;
    } catch (error) {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function fetchTasks(filters) {
  return request(buildQuery(filters));
}

export function createTask(payload) {
  return request(BASE_URL, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateTask(id, payload) {
  return request(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function deleteTask(id) {
  return request(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
}

export function duplicateTask(id) {
  return request(`${BASE_URL}/${id}/duplicate`, {
    method: 'POST',
  });
}

export function clearCompleted() {
  return request(`${BASE_URL}/completed`, {
    method: 'DELETE',
  });
}

export function completeVisible(filters) {
  return request(`${BASE_URL}/bulk/complete-visible`, {
    method: 'POST',
    body: JSON.stringify({ filters }),
  });
}
