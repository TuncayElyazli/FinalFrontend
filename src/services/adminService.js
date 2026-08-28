import api from './api';

const ADMIN_BASE = '/api/v1/admin';

const adminService = {
  // ── Dashboard ──
  getDashboardStats: () => api.get(`${ADMIN_BASE}/dashboard`),

  // ── Movies CRUD ──
  movies: {
    getAll: () => api.get(`${ADMIN_BASE}/movies`),
    getById: (id) => api.get(`${ADMIN_BASE}/movies/${id}`),
    create: (data) => api.post(`${ADMIN_BASE}/movies`, data),
    update: (id, data) => api.put(`${ADMIN_BASE}/movies/${id}`, data),
    delete: (id) => api.delete(`${ADMIN_BASE}/movies/${id}`),
  },

  // ── Screenings CRUD ──
  screenings: {
    getAll: () => api.get(`${ADMIN_BASE}/screenings`),
    getById: (id) => api.get(`${ADMIN_BASE}/screenings/${id}`),
    create: (data) => api.post(`${ADMIN_BASE}/screenings`, data),
    update: (id, data) => api.put(`${ADMIN_BASE}/screenings/${id}`, data),
    delete: (id) => api.delete(`${ADMIN_BASE}/screenings/${id}`),
  },

  // ── Users Management ──
  users: {
    getAll: () => api.get(`${ADMIN_BASE}/users`),
    toggleRole: (userId, role) =>
      api.patch(`${ADMIN_BASE}/users/${userId}/role`, { role }),
  },
};

export default adminService;
