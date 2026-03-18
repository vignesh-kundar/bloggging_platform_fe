const API_BASE_URL = 'http://127.0.0.1:8080/api/v1';

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    POSTS: `${API_BASE_URL}/posts`,
    POST_BY_ID: (id) => `${API_BASE_URL}/posts/${id}`,
    SEARCH_POSTS: (term) => `${API_BASE_URL}/posts?term=${encodeURIComponent(term)}`,
  }
};
