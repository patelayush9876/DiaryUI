import axios from 'axios';
import { tokenStorage } from '../utils/token';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Refresh token logic
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const refreshData =
          refreshResponse.data &&
          typeof refreshResponse.data === 'object' &&
          'data' in refreshResponse.data
            ? refreshResponse.data.data
            : refreshResponse.data;

        const newAccessToken = refreshData?.accessToken;
        const newRefreshToken = refreshData?.refreshToken;

        if (newAccessToken) {
          tokenStorage.setTokens(newAccessToken, newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return API(originalRequest);
        }
      } catch (refreshError) {
        tokenStorage.removeToken();
        // window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
