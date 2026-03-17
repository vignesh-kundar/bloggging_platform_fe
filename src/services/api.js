const API_BASE_URL = '/api/v1';

export const api = {
  async getPosts(term = '') {
    const url = term 
      ? `${API_BASE_URL}/posts?term=${encodeURIComponent(term)}`
      : `${API_BASE_URL}/posts`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch posts');
    return response.json();
  },

  async getPostById(id) {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`);
    if (!response.ok) throw new Error('Failed to fetch post');
    return response.json();
  },

  async createPost(postData) {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create post');
    }
    return response.json();
  },

  async deletePost(id) {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete post');
    return true;
  },

  async checkHealth() {
    const response = await fetch('/ping');
    if (!response.ok) throw new Error('Backend is unreachable');
    return response.json();
  }
};
