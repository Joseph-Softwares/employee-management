/**
 * config.js
 * Configuration settings for the Employee Management System backend
 */

// Load environment variables from .env file in non-production environments
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    apiPrefix: '/api/v1',
    corsOrigin: process.env.CORS_ORIGIN || '*'
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-for-development-only',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-for-development-only',
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY || '15m',
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || '7d'
  },
  
  // Database configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/employee-management-system',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  
  // Email configuration for password reset and notifications
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    from: process.env.EMAIL_FROM || 'noreply@employee-management-system.com'
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'app.log'
  },
  
  // Rate limiting configuration to prevent abuse
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
};

module.exports = config;