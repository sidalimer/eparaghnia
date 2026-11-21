import axios from 'axios';
import { demoAdapter } from './demo';

// NEXT_PUBLIC_DEMO=1 : données d'exemple, sans serveur ni base de données.
const demo = process.env.NEXT_PUBLIC_DEMO === '1';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  ...(demo ? { adapter: demoAdapter } : {})
});

// Injecte automatiquement le token dans chaque requête si dispo
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
