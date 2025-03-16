/**
 * messageService.js
 * Service for message-related API calls
 */

import apiClient from './apiClient';

const messageService = {
  /**
   * Get all messages for current user
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getMyMessages: async (params = {}) => {
    return await apiClient.get('/messages', { params });
  },

  /**
   * Get message by ID
   * @param {String} id - Message ID
   * @returns {Promise} - API response
   */
  getMessageById: async (id) => {
    return await apiClient.get(`/messages/${id}`);
  },

  /**
   * Send a new message
   * @param {Object} messageData - Message data
   * @returns {Promise} - API response
   */
  sendMessage: async (messageData) => {
    return await apiClient.post('/messages', messageData);
  },

  /**
   * Mark message as read
   * @param {String} id - Message ID
   * @returns {Promise} - API response
   */
  markAsRead: async (id) => {
    return await apiClient.patch(`/messages/${id}/read`);
  },

  /**
   * Delete a message
   * @param {String} id - Message ID
   * @returns {Promise} - API response
   */
  deleteMessage: async (id) => {
    return await apiClient.delete(`/messages/${id}`);
  },

  /**
   * Get conversation with specific user
   * @param {String} userId - User ID
   * @param {Object} params - Query parameters
   * @returns {Promise} - API response
   */
  getConversation: async (userId, params = {}) => {
    return await apiClient.get(`/messages/conversation/${userId}`, { params });
  },

  /**
   * Get unread message count
   * @returns {Promise} - API response
   */
  getUnreadCount: async () => {
    return await apiClient.get('/messages/unread/count');
  }
};

export default messageService;
