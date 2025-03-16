# Deployment Guide for Employee Management System

This repository has been configured with multiple deployment options to suit different environments and requirements.

## Quick Start

Choose one of the following deployment methods:

### 1. Local Deployment

```bash
# Run the local deployment script
./deploy-local.sh
```

This script will:
- Check if MongoDB is installed and running
- Create a .env file with development settings
- Install dependencies
- Start the application in development mode

### 2. Local Docker Deployment

```bash
# Run the local Docker deployment script
./run-local-docker.sh
```

This script will:
- Check if Docker and Docker Compose are installed
- Start the application, MongoDB, and MongoDB Express using Docker Compose
- The application will be available at http://localhost:5000
- MongoDB Express (web interface) will be available at http://localhost:8081

### 3. Heroku Deployment

```bash
# Run the Heroku deployment script
./deploy-heroku.sh [optional-app-name]
```

### 4. AWS EC2 Deployment

```bash
# Make the script executable if not already
chmod +x deploy-aws.sh

# Run the AWS deployment script
./deploy-aws.sh
```

### 5. Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# For local development with Docker
docker-compose -f docker-compose.local.yml up -d
```

### 6. Kubernetes Deployment

```bash
# Deploy to Kubernetes
./deploy-kubernetes.sh --domain your-domain.com
```

## Detailed Instructions

For more detailed deployment instructions, please refer to the [DEPLOYMENT.md](DEPLOYMENT.md) file.

## Environment Configuration

Before deploying, you need to configure your environment variables:

1. Copy `.env.production` to `.env` and update the values:
   ```
   cp .env.production .env
   ```

2. Update the following variables in your `.env` file:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure secret for JWT token generation
   - `JWT_REFRESH_SECRET`: A secure secret for JWT refresh token generation
   - `CORS_ORIGIN`: The domain of your frontend (for CORS)

## MongoDB Atlas Setup

To set up MongoDB Atlas:

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Configure network access to allow connections from your deployment environment
4. Create a database user
5. Get your connection string
6. Test your connection using the provided script:
   ```
   node setup-mongodb-atlas.js
   ```

## CI/CD Pipeline

This repository includes GitHub Actions workflows for continuous integration and deployment:

- Automated testing on push and pull requests
- Automated deployment to Heroku when merging to main branch

To enable CI/CD:

1. Add the following secrets to your GitHub repository:
   - `HEROKU_API_KEY`: Your Heroku API key
   - `HEROKU_APP_NAME`: Your Heroku app name
   - `HEROKU_EMAIL`: Your Heroku email
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret
   - `JWT_REFRESH_SECRET`: Your JWT refresh secret
   - `CORS_ORIGIN`: Your CORS origin

## Troubleshooting

If you encounter issues during deployment:

1. Check the logs:
   - Heroku: `heroku logs --tail --app your-app-name`
   - AWS EC2: `pm2 logs`
   - Docker: `docker-compose logs`

2. Verify your environment variables are set correctly

3. Ensure your MongoDB connection is working properly

4. Check the application health endpoint: `/health`

## Security Considerations

- Always use HTTPS in production
- Use strong, unique secrets for JWT tokens
- Regularly update dependencies to patch security vulnerabilities
- Consider implementing rate limiting and IP blocking for suspicious activity
