/**
 * index.js
 * Main entry point for the Employee Management System application
 */

// Import required modules
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const config = require('./backend/config/config');

// Import routes
const authRoutes = require('./backend/routes/authRoutes');
const employeeRoutes = require('./backend/routes/employeeRoutes');
const taskRoutes = require('./backend/routes/taskRoutes');
const messageRoutes = require('./backend/routes/messageRoutes');
const adminRoutes = require('./backend/routes/adminRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect(config.database.uri, config.database.options)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Apply middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: config.server.corsOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request body
app.use(morgan('dev')); // HTTP request logger

// API routes
const apiPrefix = config.server.apiPrefix;
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/employees`, employeeRoutes);
app.use(`${apiPrefix}/tasks`, taskRoutes);
app.use(`${apiPrefix}/messages`, messageRoutes);
app.use(`${apiPrefix}/admin`, adminRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('frontend/build'));

  // Serve the index.html file for any route not handled by the API
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.server.env
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Employee Management System API',
    version: '1.0.0',
    documentation: `${req.protocol}://${req.get('host')}${apiPrefix}/docs`
  });
});

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: config.server.env === 'development' ? err : {}
  });
});

// Start the server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`Server running in ${config.server.env} mode on port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}${apiPrefix}`);
});

module.exports = app; // Export for testing
