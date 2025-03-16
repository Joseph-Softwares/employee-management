/**
 * taskService.js
 * Service for task-related API calls
 */

import apiClient from './apiClient';

const taskService = {
  /**
   * Get all tasks
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getAllTasks: async (params = {}) => {
    return await apiClient.get('/tasks', { params });
  },

  /**
   * Get task by ID
   * @param {String} id - Task ID
   * @returns {Promise} - API response
   */
  getTaskById: async (id) => {
    return await apiClient.get(`/tasks/${id}`);
  },

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @returns {Promise} - API response
   */
  createTask: async (taskData) => {
    return await apiClient.post('/tasks', taskData);
  },

  /**
   * Update an existing task
   * @param {String} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise} - API response
   */
  updateTask: async (id, taskData) => {
    return await apiClient.put(`/tasks/${id}`, taskData);
  },

  /**
   * Delete a task
   * @param {String} id - Task ID
   * @returns {Promise} - API response
   */
  deleteTask: async (id) => {
    return await apiClient.delete(`/tasks/${id}`);
  },

  /**
   * Assign task to user
   * @param {String} taskId - Task ID
   * @param {String} userId - User ID
   * @returns {Promise} - API response
   */
  assignTask: async (taskId, userId) => {
    return await apiClient.post(`/tasks/${taskId}/assign`, { userId });
  },

  /**
   * Update task status
   * @param {String} taskId - Task ID
   * @param {String} status - New status
   * @returns {Promise} - API response
   */
  updateTaskStatus: async (taskId, status) => {
    return await apiClient.patch(`/tasks/${taskId}/status`, { status });
  },

  /**
   * Get tasks assigned to current user
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getMyTasks: async (params = {}) => {
    return await apiClient.get('/tasks/me', { params });
  }
};

export default taskService;
