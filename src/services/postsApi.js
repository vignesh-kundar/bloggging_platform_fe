import { API_CONFIG } from '../config/api.config';
import { apiClient } from './apiClient';

function buildUrl(page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE, term = '') {
  const params = new URLSearchParams({ pageNumber: page, pageSize: size });
  if (term) params.set('term', term);
  return `${API_CONFIG.ENDPOINTS.POSTS}?${params}`;
}

export const postsApi = {
  getAll(page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE) {
    return apiClient.get(buildUrl(page, size));
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

  search(term, page = 0, size = API_CONFIG.DEFAULT_PAGE_SIZE) {
    return apiClient.get(buildUrl(page, size, term));
  },
};

