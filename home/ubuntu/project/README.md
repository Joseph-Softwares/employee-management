# Employee Management System

A comprehensive system for managing employees, tasks, departments, and communications within an organization.

## Project Structure

The project is organized into backend and frontend components:

### Backend

- **controllers/** - API endpoint handlers
- **routes/** - API route definitions
- **models/** - MongoDB data models
- **middleware/** - Express middleware (authentication, etc.)
- **utils/** - Utility functions
- **config/** - Configuration files
- **tests/** - Test files

### Frontend

- **src/**
  - **components/** - Reusable UI components
  - **layouts/** - Page layout components
  - **pages/** - Page components
  - **redux/** - Redux state management
  - **api/** - API service files
  - **utils/** - Utility functions
  - **styles/** - CSS/styling files

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the project root with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/employee-management-system
   JWT_SECRET=your-secret-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_EXPIRY=7d
   CORS_ORIGIN=http://localhost:3000
   ```

### Running the Application

#### Development Mode

1. Start the backend server:
   ```
   npm run dev
   ```
2. In a separate terminal, start the frontend development server:
   ```
   cd frontend
   npm start
   ```

#### Production Mode

1. Build the frontend:
   ```
   cd frontend
   npm run build
   ```
2. Start the production server:
   ```
   NODE_ENV=production npm start
   ```

## API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/verify-email` - Verify email
- `GET /api/v1/auth/me` - Get current user profile

### Employees

- `GET /api/v1/employees` - Get all employees
- `GET /api/v1/employees/:id` - Get employee by ID
- `PUT /api/v1/employees/profile` - Update current user's profile
- `GET /api/v1/employees/department/:departmentId` - Get department users

### Tasks

- `GET /api/v1/tasks` - Get all tasks
- `GET /api/v1/tasks/:id` - Get task by ID
- `POST /api/v1/tasks` - Create a new task
- `PUT /api/v1/tasks/:id` - Update task
- `DELETE /api/v1/tasks/:id` - Delete task
- `POST /api/v1/tasks/:id/assign` - Assign task to user
- `PATCH /api/v1/tasks/:id/status` - Update task status
- `GET /api/v1/tasks/me` - Get tasks assigned to current user

### Messages

- `GET /api/v1/messages` - Get all messages for current user
- `GET /api/v1/messages/:id` - Get message by ID
- `POST /api/v1/messages` - Send a new message
- `PATCH /api/v1/messages/:id/read` - Mark message as read
- `DELETE /api/v1/messages/:id` - Delete message
- `GET /api/v1/messages/conversation/:userId` - Get conversation with specific user
- `GET /api/v1/messages/unread/count` - Get unread message count

### Admin

- `GET /api/v1/admin/users` - Get all users (admin only)
- `POST /api/v1/admin/users` - Create a new user (admin only)
- `PUT /api/v1/admin/users/:id` - Update user (admin only)
- `DELETE /api/v1/admin/users/:id` - Delete user (admin only)
- `GET /api/v1/admin/departments` - Get all departments (admin only)
- `POST /api/v1/admin/departments` - Create a new department (admin only)
- `DELETE /api/v1/admin/departments/:id` - Delete department (admin only)
- `GET /api/v1/admin/stats` - Get system statistics (admin only)

## Deployment

This project includes multiple deployment options to suit different environments and requirements. For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md) and [DEPLOYMENT_README.md](DEPLOYMENT_README.md).

### Quick Deployment Options

#### Local Deployment

```bash
# Run the local deployment script
./deploy-local.sh

# OR use Docker for local deployment (includes MongoDB)
./run-local-docker.sh
```

#### Heroku Deployment

```bash
# Run the Heroku deployment script
./deploy-heroku.sh [optional-app-name]
```

#### AWS EC2 Deployment

```bash
# Run the AWS deployment script
./deploy-aws.sh
```

#### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# For local development with Docker
docker-compose -f docker-compose.local.yml up -d
```

#### Kubernetes Deployment

```bash
# Deploy to Kubernetes
./deploy-kubernetes.sh --domain your-domain.com
```

### Additional Deployment Tools

- **setup-mongodb-atlas.js**: Script to test MongoDB Atlas connection
- **setup-ssl.sh**: Script to set up SSL with Let's Encrypt
- **setup-monitoring.sh**: Script to set up monitoring tools
- **backup-mongodb.sh**: Script to backup MongoDB database

### Prerequisites for Deployment

1. MongoDB Atlas account or other MongoDB hosting
2. Node.js hosting platform (Heroku, AWS, DigitalOcean, etc.)

### General Deployment Steps

1. Set up MongoDB database:
   - Create a MongoDB Atlas cluster or set up a MongoDB server
   - Configure network access and database user
   - Get the connection string

2. Configure environment variables for production:
   - Set `NODE_ENV=production`
   - Set `MONGODB_URI` to your MongoDB connection string
   - Set secure values for JWT secrets
   - Configure CORS settings for your domain

3. Build the frontend:
   ```
   cd frontend
   npm run build
   ```

4. Deploy to your hosting platform using one of the provided scripts

## CI/CD Pipeline

This repository includes GitHub Actions workflows for continuous integration and deployment:

- Automated testing on push and pull requests
- Automated deployment to Heroku when merging to main branch

## Security Considerations

- JWT tokens are used for authentication
- Password hashing is implemented
- Rate limiting is configured to prevent abuse
- CORS is configured to restrict access
- Helmet is used for security headers
