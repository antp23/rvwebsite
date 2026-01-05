import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (credentials) => api.post('/auth/login', credentials);
export const getMe = () => api.get('/auth/me');

// Dashboard
export const getDashboard = () => api.get('/dashboard');

// Plans
export const getPlans = () => api.get('/plans');
export const getPlan = (id) => api.get(`/plans/${id}`);
export const activatePlan = (id) => api.put(`/plans/${id}/activate`);

// Logs
export const createLog = (data) => api.post('/logs', data);
export const getLogs = (params) => api.get('/logs', { params });
export const updateLog = (id, data) => api.put(`/logs/${id}`, data);
export const getTodayWorkout = () => api.get('/logs/today');

// Routines
export const getRoutines = () => api.get('/routines');
export const createRoutine = (formData) => {
  return api.post('/routines', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const updateRoutine = (id, data) => api.put(`/routines/${id}`, data);
export const deleteRoutine = (id) => api.delete(`/routines/${id}`);

// Calendar & Export
export const getCalendar = (params) => api.get('/export/calendar', { params });
export const exportLogs = (params) => {
  return api.get('/export', {
    params,
    responseType: 'blob',
  });
};

export default api;
