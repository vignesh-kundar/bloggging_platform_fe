const BASE_URL = 'https://p01--bloggingplatform--d7td8tlbgkrw.code.run'
const API_BASE_URL = `${BASE_URL}/api/v2`
const AUTH_BASE_URL = `${BASE_URL}/api/auth`

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  POSTS_ENDPOINT: '/posts',
  ENDPOINTS: {
    // Auth
    LOGIN: `${AUTH_BASE_URL}/login`,
    REGISTER: `${AUTH_BASE_URL}/register`,
    USER_PROFILE: `${AUTH_BASE_URL}/userprofile`,
    // Posts
    POSTS: `${API_BASE_URL}/posts`,
    POST_BY_ID: (id) => `${API_BASE_URL}/posts/${id}`,
    SEARCH_POSTS: (term) => `${API_BASE_URL}/posts?term=${encodeURIComponent(term)}`,
  },
  METHODS: {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
  }
};
  