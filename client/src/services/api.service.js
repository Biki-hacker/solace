/**
 * Axios instance with Firebase auth interceptor.
 * Automatically attaches the current user's ID token to every request.
 */
import axios from 'axios';
import { getIdToken } from './auth.service';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** Request interceptor — attach Firebase ID token */
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch {
      /* User not authenticated — request will fail at server auth middleware */
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** Response interceptor — unwrap data */
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
