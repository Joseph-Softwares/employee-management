#!/bin/bash

# Script to set up SSL with Let's Encrypt for the Employee Management System

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root or with sudo"
  exit 1
fi

# Check if domain name is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <domain-name> [email]"
  echo "Example: $0 example.com admin@example.com"
  exit 1
fi

DOMAIN=$1
EMAIL=$2

# Install Certbot and Nginx plugin
echo "Installing Certbot and Nginx plugin..."
apt-get update
apt-get install -y certbot python3-certbot-nginx

# Check if Nginx is installed
if ! command -v nginx &> /dev/null; then
  echo "Nginx is not installed. Installing..."
  apt-get install -y nginx
fi

# Create Nginx configuration for the domain
echo "Creating Nginx configuration for $DOMAIN..."
cat > /etc/nginx/sites-available/$DOMAIN <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/

# Test Nginx configuration
echo "Testing Nginx configuration..."
nginx -t

# Reload Nginx to apply changes
echo "Reloading Nginx..."
systemctl reload nginx

# Obtain SSL certificate
echo "Obtaining SSL certificate for $DOMAIN..."
if [ -z "$EMAIL" ]; then
  certbot --nginx -d $DOMAIN -d www.$DOMAIN --agree-tos --non-interactive
else
  certbot --nginx -d $DOMAIN -d www.$DOMAIN --agree-tos --non-interactive --email $EMAIL
fi

# Set up auto-renewal
echo "Setting up auto-renewal..."
echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew -q" | sudo tee -a /etc/crontab > /dev/null

echo "SSL setup completed successfully!"
echo "Your site is now accessible at https://$DOMAIN"
