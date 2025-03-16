#!/bin/bash

# Deployment script for AWS EC2

# Update system packages
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js if not already installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    sudo npm install -g pm2
fi

# Install MongoDB if not using Atlas
# Uncomment the following lines if you want to install MongoDB locally
# echo "Installing MongoDB..."
# sudo apt-get install -y mongodb
# sudo systemctl start mongodb
# sudo systemctl enable mongodb

# Navigate to project directory
cd /home/ubuntu/project

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Set up environment variables
echo "Setting up environment variables..."
cp .env.production .env

# Build frontend (if needed)
# echo "Building frontend..."
# cd frontend
# npm install
# npm run build
# cd ..

# Start the application with PM2
echo "Starting the application with PM2..."
pm2 stop employee-management-system || true
pm2 delete employee-management-system || true
pm2 start index.js --name "employee-management-system" --env production

# Save PM2 process list and configure to start on system startup
pm2 save
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Set up Nginx as a reverse proxy (if needed)
# echo "Setting up Nginx..."
# sudo apt-get install -y nginx
# sudo cp nginx.conf /etc/nginx/sites-available/employee-management-system
# sudo ln -s /etc/nginx/sites-available/employee-management-system /etc/nginx/sites-enabled/
# sudo nginx -t
# sudo systemctl restart nginx

echo "Deployment completed successfully!"
