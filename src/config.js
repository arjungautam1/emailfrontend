// API Configuration
// Use environment variable if set, otherwise use deployed backend URL
// For local development, create .env file with: VITE_API_URL=http://localhost:8000
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://emailbackend-rhmf.onrender.com').trim();

export default {
  API_BASE_URL,
};

