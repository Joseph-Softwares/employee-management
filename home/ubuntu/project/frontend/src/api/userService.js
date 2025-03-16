/**
 * userService.js
 * Service for user-related API calls
 */

import apiClient from './apiClient';

const userService = {
  /**
   * Get all users (admin only)
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getAllUsers: async (params = {}) => {
    return await apiClient.get('/admin/users', { params });
  },

  /**
   * Get user by ID
   * @param {String} id - User ID
   * @returns {Promise} - API response
   */
  getUserById: async (id) => {
    return await apiClient.get(`/employees/${id}`);
  },

  /**
   * Update user profile
   * @param {String} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise} - API response
   */
  updateUser: async (id, userData) => {
    return await apiClient.put(`/employees/${id}`, userData);
  },

  /**
   * Update current user's profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} - API response
   */
  updateProfile: async (userData) => {
    return await apiClient.put('/employees/profile', userData);
  },

  /**
   * Change password
   * @param {Object} passwordData - Password change data
   * @returns {Promise} - API response
   */
  changePassword: async (passwordData) => {
    return await apiClient.post('/auth/change-password', passwordData);
  },

  /**
   * Get user statistics (admin only)
   * @returns {Promise} - API response
   */
  getUserStats: async () => {
    return await apiClient.get('/admin/stats/users');
  },

  /**
   * Get department users
   * @param {String} departmentId - Department ID
   * @returns {Promise} - API response
   */
  getDepartmentUsers: async (departmentId) => {
    return await apiClient.get(`/employees/department/${departmentId}`);
  }
};

export default userService;
