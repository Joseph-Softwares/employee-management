# Deployment Guide for Employee Management System

This guide provides instructions for deploying the Employee Management System to various platforms.

## Prerequisites

Before deploying, ensure you have:

1. A MongoDB database (either MongoDB Atlas or a self-hosted MongoDB server)
2. Node.js (v14 or higher) installed on your deployment server
3. Updated the `.env.production` file with your production settings

## Deployment Options

### Option 1: Local Deployment

1. **Run the local deployment script**
   ```
   ./deploy-local.sh
   ```

   This script will:
   - Check if MongoDB is installed and running
   - Create a .env file with development settings
   - Install dependencies
   - Start the application in development mode

2. **Run with Docker for local development**
   ```
   ./run-local-docker.sh
   ```

   This script will:
   - Check if Docker and Docker Compose are installed
   - Start the application, MongoDB, and MongoDB Express using Docker Compose
   - The application will be available at http://localhost:5000
   - MongoDB Express (web interface) will be available at http://localhost:8081

### Option 2: Heroku Deployment

1. **Install Heroku CLI**
   ```
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```
   heroku login
   ```

3. **Create a new Heroku app**
   ```
   heroku create your-app-name
   ```

4. **Add MongoDB add-on or configure external MongoDB**
   ```
   # For Heroku MongoDB add-on
   heroku addons:create mongodb:sandbox
   
   # Or set environment variable for external MongoDB
   heroku config:set MONGODB_URI=your-mongodb-atlas-connection-string
   ```

5. **Set other environment variables**
   ```
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secure-jwt-secret
   heroku config:set JWT_REFRESH_SECRET=your-secure-jwt-refresh-secret
   heroku config:set ACCESS_TOKEN_EXPIRY=15m
   heroku config:set REFRESH_TOKEN_EXPIRY=7d
   heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
   ```

6. **Deploy to Heroku**
   ```
   git push heroku main
   ```

7. **Open the deployed app**
   ```
   heroku open
   ```

### Option 3: AWS EC2 Deployment

1. **Launch an EC2 instance**
   - Use Amazon Linux 2 or Ubuntu Server
   - Configure security groups to allow HTTP (80), HTTPS (443), and SSH (22)

2. **Connect to your EC2 instance**
   ```
   ssh -i your-key.pem ec2-user@your-ec2-public-dns
   ```

3. **Clone your repository**
   ```
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

4. **Run the deployment script**
   ```
   chmod +x deploy-aws.sh
   ./deploy-aws.sh
   ```

5. **Set up SSL with Let's Encrypt (optional)**
   ```
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

### Option 4: Docker Deployment

1. **Build and run with Docker Compose**
   ```
   docker-compose up -d
   ```

2. **For single container deployment**
   ```
   docker build -t employee-management-system .
   docker run -p 5000:5000 --env-file .env.production -d employee-management-system
   ```

3. **For Kubernetes deployment**
   ```
   ./deploy-kubernetes.sh --domain your-domain.com
   ```

### Option 5: Kubernetes Deployment

1. **Prerequisites**
   - A Kubernetes cluster (e.g., Minikube, EKS, GKE, AKS)
   - kubectl configured to connect to your cluster
   - Docker image of your application

2. **Deploy using the script**
   ```
   ./deploy-kubernetes.sh --domain your-domain.com --image-name your-image-name
   ```

3. **Manual deployment**
   ```
   # Apply the Kubernetes manifests
   kubectl apply -f kubernetes/deployment.yaml
   
   # Check the deployment status
   kubectl get deployments
   kubectl get services
   kubectl get ingress
   ```

4. **Access the application**
   - The application will be available at the domain you specified
   - It may take a few minutes for DNS and SSL certificate to be fully provisioned

## Post-Deployment Steps

1. **Verify the deployment**
   - Access the API at `https://your-domain.com/api/v1`
   - Check the health endpoint at `https://your-domain.com/health`

2. **Set up monitoring**
   - Consider using services like New Relic, Datadog, or AWS CloudWatch

3. **Set up CI/CD pipeline**
   - Configure GitHub Actions, Jenkins, or other CI/CD tools for automated deployments

## Troubleshooting

- **Application not starting**: Check the logs with `heroku logs --tail` or `pm2 logs`
- **Database connection issues**: Verify your MongoDB connection string and network settings
- **CORS errors**: Ensure the CORS_ORIGIN environment variable is set correctly

## Security Considerations

- Ensure JWT secrets are strong and unique for production
- Use HTTPS for all production traffic
- Regularly update dependencies to patch security vulnerabilities
- Consider implementing rate limiting and IP blocking for suspicious activity
