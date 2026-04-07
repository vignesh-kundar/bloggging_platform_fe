// For local development, use the same hostname to avoid CORS issues
// Frontend: localhost:5173 (Vite) or localhost:3000
// Backend: localhost:8080
const BASE_URL = `http://127.0.0.1:8080`

const API_BASE_URL = `${BASE_URL}/api/v1`
const AUTH_BASE_URL = `${BASE_URL}/api/auth`

export const API_CONFIG = {
  BASE_URL,
  API_BASE_URL,
  AUTH_BASE_URL,
  POSTS_ENDPOINT: '/posts',
  ENDPOINTS: {
    POSTS: `${API_BASE_URL}/posts`,
    POST_BY_ID: (id) => `${API_BASE_URL}/posts/${id}`,
    SEARCH_POSTS: (term) => `${API_BASE_URL}/posts?term=${encodeURIComponent(term)}`,
    LOGIN: `${AUTH_BASE_URL}/login`,
    REGISTER: `${AUTH_BASE_URL}/register`,
  },
  METHODS: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
  }
};
