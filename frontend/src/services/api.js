import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('slowlycard_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('slowlycard_token');
      localStorage.removeItem('slowlycard_auth');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: async (email, nickname, password) => {
    const response = await api.post('/auth/register', { email, nickname, password });
    return response.data;
  },
  
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// Expansion API calls
export const expansionAPI = {
  getAll: async () => {
    const response = await api.get('/expansions');
    return response.data;
  },
  create: async (expansion) => {
    const response = await api.post('/expansions', expansion);
    return response.data;
  },
  update: async (id, expansion) => {
    const response = await api.put(`/expansions/${id}`, expansion);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/expansions/${id}`);
    return response.data;
  }
};

// Card API calls
export const cardAPI = {
  getAll: async (expansionId = null) => {
    const params = expansionId ? { expansion_id: expansionId } : {};
    const response = await api.get('/cards', { params });
    return response.data;
  },
  
  create: async (cardData) => {
    const response = await api.post('/cards', cardData);
    return response.data;
  },
  
  update: async (id, cardData) => {
    const response = await api.put(`/cards/${id}`, cardData);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/cards/${id}`);
    return response.data;
  },

  getUserCards: async () => {
    const response = await api.get('/user/cards');
    return response.data;
  }
};

// Pack API calls
export const packAPI = {
  open: async (expansionId) => {
    const response = await api.post('/packs/open', { expansion_id: expansionId });
    return response.data;
  }
};

// Admin API calls
export const adminAPI = {
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  
  updateUserAdmin: async (userId, isAdmin) => {
    const response = await api.put(`/admin/users/${userId}`, { is_admin: isAdmin });
    return response.data;
  },
  
  resetUserFoundCards: async (userId) => {
    const response = await api.post(`/admin/users/${userId}/reset_found_cards`);
    return response.data;
  }
};

export default api;