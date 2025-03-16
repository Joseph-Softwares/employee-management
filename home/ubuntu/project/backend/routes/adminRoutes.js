/**
 * adminRoutes.js
 * Routes for administrative functions in the Employee Management System
 */

const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Import admin controller
const adminController = require('../controllers/adminController');

// Ensure all admin routes require admin role
router.use(authenticate, authorize(['admin']));

/**
 * @route   GET /api/v1/admin/users
 * @desc    Get all users with pagination and filtering
 * @access  Private (Admin)
 */
router.get('/users', adminController.getAllUsers);

/**
 * @route   POST /api/v1/admin/users
 * @desc    Create a new user
 * @access  Private (Admin)
 */
router.post('/users', adminController.createUser);

/**
 * @route   PUT /api/v1/admin/users/:id
 * @desc    Update user by ID
 * @access  Private (Admin)
 */
router.put('/users/:id', adminController.updateUser);

/**
 * @route   DELETE /api/v1/admin/users/:id
 * @desc    Delete user by ID
 * @access  Private (Admin)
 */
router.delete('/users/:id', adminController.deleteUser);

/**
 * @route   GET /api/v1/admin/departments
 * @desc    Get all departments
 * @access  Private (Admin)
 */
router.get('/departments', adminController.getAllDepartments);

/**
 * @route   POST /api/v1/admin/departments
 * @desc    Create a new department
 * @access  Private (Admin)
 */
router.post('/departments', adminController.createDepartment);

/**
 * @route   DELETE /api/v1/admin/departments/:id
 * @desc    Delete department by ID
 * @access  Private (Admin)
 */
router.delete('/departments/:id', adminController.deleteDepartment);

/**
 * @route   GET /api/v1/admin/stats
 * @desc    Get system statistics
 * @access  Private (Admin)
 */
router.get('/stats', adminController.getSystemStats);

module.exports = router;
