/**
 * TaskFlow Centralized API Client
 * Built using native Fetch API with automatic token injection and error parsing
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Core HTTP Request Wrapper
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('taskflow_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Check for 401 Unauthorized (expired or invalid session)
      if (response.status === 401 && !endpoint.includes('/auth/login')) {
        // Clear expired credentials
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
        // Trigger event or handle expired state
        window.dispatchEvent(new Event('taskflow:session-expired'));
      }

      const errorMessage = data.message || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Authentication
  auth: {
    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),

    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),

    logout: () =>
      request('/auth/logout', {
        method: 'POST'
      }),

    getMe: () =>
      request('/auth/me', {
        method: 'GET'
      })
  },

  // Tasks
  tasks: {
    getAll: (params = {}) => {
      const query = new URLSearchParams();
      if (params.filter && params.filter !== 'all') query.append('filter', params.filter);
      if (params.status && params.status !== 'all') query.append('status', params.status);
      if (params.priority && params.priority !== 'all') query.append('priority', params.priority);
      if (params.category && params.category !== 'all') query.append('category', params.category);
      if (params.search && params.search.trim()) query.append('search', params.search.trim());
      if (params.sort) query.append('sort', params.sort);

      const queryString = query.toString();
      return request(`/tasks${queryString ? `?${queryString}` : ''}`, {
        method: 'GET'
      });
    },

    getStats: () =>
      request('/tasks/stats', {
        method: 'GET'
      }),

    getById: (id) =>
      request(`/tasks/${id}`, {
        method: 'GET'
      }),

    create: (taskData) =>
      request('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
      }),

    update: (id, taskData) =>
      request(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData)
      }),

    updateStatus: (id, status) =>
      request(`/tasks/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),

    delete: (id) =>
      request(`/tasks/${id}`, {
        method: 'DELETE'
      })
  }
};

export default api;
