import { API_CONFIG } from '../config/api.config';

const getAuthHeader = () => {
  const token = sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const postsApi = {
  async getAll() {
    const response = await fetch(API_CONFIG.ENDPOINTS.POSTS, {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch posts');
    }
    return response.json();
  },

  async getById(id) {
    const response = await fetch(API_CONFIG.ENDPOINTS.POST_BY_ID(id), {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch post');
    }
    return response.json();
  },

  async create(postData) {
    const response = await fetch(API_CONFIG.ENDPOINTS.POSTS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to create post');
    }
    return response.json();
  },

  async delete(id) {
    const response = await fetch(API_CONFIG.ENDPOINTS.POST_BY_ID(id), {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to delete post');
    }
    return true;
  },

  async search(term) {
    const response = await fetch(API_CONFIG.ENDPOINTS.SEARCH_POSTS(term), {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to search posts');
    }
    return response.json();
  }
};
