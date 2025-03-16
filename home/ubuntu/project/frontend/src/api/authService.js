/**
 * authService.js
 * Service for authentication-related API calls
 */

import apiClient from './apiClient';

const authService = {
  /**
   * Login user with email and password
   * @param {Object} credentials - User credentials
   * @returns {Promise} - API response
   */
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    return response.data;
  },

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - API response
   */
  register: async (userData) => {
    return await apiClient.post('/auth/register', userData);
  },

  /**
   * Logout the current user
   */
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  /**
   * Request password reset
   * @param {Object} email - User email
   * @returns {Promise} - API response
   */
  forgotPassword: async (email) => {
    return await apiClient.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   * @param {Object} resetData - Password reset data
   * @returns {Promise} - API response
   */
  resetPassword: async (resetData) => {
    return await apiClient.post('/auth/reset-password', resetData);
  },

  /**
   * Verify email with token
   * @param {Object} verifyData - Email verification data
   * @returns {Promise} - API response
   */
  verifyEmail: async (verifyData) => {
    return await apiClient.post('/auth/verify-email', verifyData);
  },

  /**
   * Get current user profile
   * @returns {Promise} - API response
   */
  getCurrentUser: async () => {
    return await apiClient.get('/auth/me');
  },

  /**
   * Check if user is authenticated
   * @returns {Boolean} - Authentication status
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  }
};

export default authService;
