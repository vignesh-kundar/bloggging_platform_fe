import { API_CONFIG } from '../config/api.config';
import { apiClient } from './apiClient';

export const authApi = {
  async login(email, password) {
    const response = await fetch(API_CONFIG.ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Invalid email or password');
    }
    return response.json();
  },

  async register(name, email, userName, password) {
    const response = await fetch(API_CONFIG.ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, userName, password }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Registration failed');
    }
    return response.json();
  },

  getProfile() {
    return apiClient.get(API_CONFIG.ENDPOINTS.USER_PROFILE);
  },
};
