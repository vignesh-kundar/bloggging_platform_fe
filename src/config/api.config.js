const API_BASE_URL = `https://p01--bloggingplatform--d7td8tlbgkrw.code.run/api/v1`
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  POSTS_ENDPOINT: '/posts',
  ENDPOINTS: {
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
