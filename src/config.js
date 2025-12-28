// API Configuration
// Development: Uses Vite proxy (empty string)
// Production: Uses environment variable or falls back to deployed backend
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.trim()
  : import.meta.env.DEV 
    ? '' // Use proxy in development (vite.config.js)
    : 'https://emailbackend-rhmf.onrender.com'; // Production fallback

export default {
  API_BASE_URL,
};

