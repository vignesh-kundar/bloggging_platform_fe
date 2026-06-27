/**
 * Centralized API client.
 *
 * - Automatically reads the session token and attaches it as a
 *   Bearer token Authorization header on every outgoing request.
 * - On a 403 response the token is cleared from sessionStorage and
 *   a custom 'auth:expired' DOM event is dispatched so that
 *   AuthContext can react and redirect the user back to the login page.
 */

const TOKEN_KEY = 'bloogigy_auth_token';
const USER_KEY  = 'bloogigy_auth_user';

async function request(url, options = {}) {
  const token = sessionStorage.getItem(TOKEN_KEY);

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    // Allow callers to override / extend headers if truly needed
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });

  // Token expired or revoked — kick the user back to login
  if (response.status === 403) {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event('auth:expired'));
    throw new Error('Your session has expired. Please sign in again.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed (${response.status})`);
  }

  // Some endpoints (e.g. DELETE) return 204 No Content
  const contentType = response.headers.get('content-type') || '';
  if (response.status === 204 || !contentType.includes('application/json')) {
    return null;
  }

  return response.json();
}

export const apiClient = {
  get:    (url)         => request(url, { method: 'GET' }),
  post:   (url, body)   => request(url, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (url, body)   => request(url, { method: 'PUT',    body: JSON.stringify(body) }),
  patch:  (url, body)   => request(url, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: (url)         => request(url, { method: 'DELETE' }),
};
