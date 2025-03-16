/**
 * adminController.js
 * Controller for admin-related operations
 */

const mongoose = require('mongoose');
const UserModel = require('../models/userModel');
const DepartmentModel = require('../models/departmentModel');
const TaskModel = require('../models/taskModel');

/**
 * Get all users (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = {};
    
    // Apply filters if provided
    if (req.query.role) {
      filter.role = req.query.role;
    }
    
    if (req.query.department) {
      filter.department = req.query.department;
    }
    
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Get users with pagination
    const users = await UserModel.find(filter)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    // Get total count for pagination
    const total = await UserModel.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get user by ID (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error in getUserById:', error);
    
    // Check if error is due to invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Create new user (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      department,
      position,
      phoneNumber
    } = req.body;
    
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create new user
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'employee',
      department,
      position,
      phoneNumber,
      createdBy: req.user.id
    });
    
    // Remove password from response
    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Error in createUser:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Update user (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      role,
      department,
      position,
      phoneNumber,
      status
    } = req.body;
    
    // Find user by ID
    let user = await UserModel.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await UserModel.findOne({ email });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }
    
    // Update user
    user = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        email: email || user.email,
        role: role || user.role,
        department: department || user.department,
        position: position || user.position,
        phoneNumber: phoneNumber || user.phoneNumber,
        status: status || user.status,
        updatedBy: req.user.id,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error in updateUser:', error);
    
    // Check if error is due to invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Delete user (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if user exists
    const user = await UserModel.findById(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Delete user
    const deleted = await UserModel.deleteById(id);
    
    // Update tasks assigned to this user
    await TaskModel.updateMany(
      { assignedTo: id },
      { assignedTo: null, status: 'unassigned' }
    );
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteUser:', error);
    
    // Check if error is due to invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get all departments (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await DepartmentModel.find();
    
    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    });
  } catch (error) {
    console.error('Error in getAllDepartments:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Create department (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createDepartment = async (req, res) => {
  try {
    const { name, description, manager } = req.body;
    
    // Check if department already exists
    const existingDepartment = await DepartmentModel.findOne({ name });
    
    if (existingDepartment) {
      return res.status(400).json({
        success: false,
        message: 'Department with this name already exists'
      });
    }
    
    // Create department
    const department = await DepartmentModel.create({
      name,
      description,
      manager,
      createdBy: req.user.id
    });
    
    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department
    });
  } catch (error) {
    console.error('Error in createDepartment:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Delete department (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteDepartment = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Check if department exists
    const department = await DepartmentModel.findById(id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }
    
    // Delete department
    const deleted = await DepartmentModel.deleteById(id);
    
    res.status(200).json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteDepartment:', error);
    
    // Check if error is due to invalid ID format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid department ID format'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

/**
 * Get system statistics (admin only)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getSystemStats = async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await UserModel.countDocuments();
    const activeUsers = await UserModel.countDocuments({ status: 'active' });
    const inactiveUsers = await UserModel.countDocuments({ status: 'inactive' });
    const adminUsers = await UserModel.countDocuments({ role: 'admin' });
    const employeeUsers = await UserModel.countDocuments({ role: 'employee' });
    const managerUsers = await UserModel.countDocuments({ role: 'manager' });
    
    // Get task statistics
    const totalTasks = await TaskModel.countDocuments();
    const completedTasks = await TaskModel.countDocuments({ status: 'completed' });
    const pendingTasks = await TaskModel.countDocuments({ status: 'in-progress' });
    const unassignedTasks = await TaskModel.countDocuments({ status: 'unassigned' });
    
    // Get department statistics
    const totalDepartments = await DepartmentModel.countDocuments();
    
    // Get recent activities
    const recentUsers = await UserModel.find()
      .select('firstName lastName email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const recentTasks = await TaskModel.find()
      .select('title status priority createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: inactiveUsers,
          admins: adminUsers,
          employees: employeeUsers,
          managers: managerUsers
        },
        tasks: {
          total: totalTasks,
          completed: completedTasks,
          pending: pendingTasks,
          unassigned: unassignedTasks,
          completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
        },
        departments: {
          total: totalDepartments
        },
        recent: {
          users: recentUsers,
          tasks: recentTasks
        }
      }
    });
  } catch (error) {
    console.error('Error in getSystemStats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
