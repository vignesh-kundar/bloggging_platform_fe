import { API_CONFIG } from '../config/api.config';
import { apiClient } from './apiClient';

export const postsApi = {
  getAll() {
    return apiClient.get(API_CONFIG.ENDPOINTS.POSTS);
  },

  getById(id) {
    return apiClient.get(API_CONFIG.ENDPOINTS.POST_BY_ID(id));
  },

  create(postData) {
    return apiClient.post(API_CONFIG.ENDPOINTS.POSTS, postData);
  },

  delete(id) {
    return apiClient.delete(API_CONFIG.ENDPOINTS.POST_BY_ID(id));
  },

  search(term) {
    return apiClient.get(API_CONFIG.ENDPOINTS.SEARCH_POSTS(term));
  },
};

