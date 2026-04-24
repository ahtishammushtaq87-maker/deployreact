import axios from 'axios';

const api = axios.create({
  withCredentials: false, // Use Bearer tokens, not cookies
});

// Dynamically resolve base URL and inject Bearer token on every request
api.interceptors.request.use((config) => {
  const savedUrl = localStorage.getItem('novapay_api_url');
  const defaultUrl = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.154:5002/api';
  // Normalize URL — Android keyboards can auto-capitalize HTTP:// which WebView rejects
  config.baseURL = (savedUrl || defaultUrl).trim().toLowerCase();

  const token = localStorage.getItem('novapay_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

export default api;
