import axios from 'axios';

const BASE_URL = 'http://localhost:9080/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and refresh tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401, not a retry yet, and not the login/refresh endpoint
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call the refresh token endpoint
        const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        // Save new tokens
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Update original request headers and retry
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed or expired. Force logout.
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(new Event('auth-expired')); // Broadcast event to UI
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
