#!/bin/bash

# Deployment script for Heroku

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "Heroku CLI is not installed. Installing..."
    curl https://cli-assets.heroku.com/install.sh | sh
fi

# Login to Heroku
echo "Logging in to Heroku..."
heroku login

# Create a new Heroku app if app name is provided
if [ -n "$1" ]; then
    APP_NAME=$1
    echo "Creating Heroku app: $APP_NAME"
    heroku create $APP_NAME || true
else
    echo "Creating a new Heroku app with a random name..."
    heroku create || true
    APP_NAME=$(heroku apps:info | grep "===.*" | cut -d' ' -f2)
fi

echo "Using Heroku app: $APP_NAME"

# Add MongoDB add-on
echo "Adding MongoDB add-on..."
heroku addons:create mongodb:sandbox --app $APP_NAME || echo "MongoDB add-on already exists or couldn't be added. You may need to add it manually or use an external MongoDB."

# Set environment variables
echo "Setting environment variables..."
heroku config:set NODE_ENV=production --app $APP_NAME
echo "Please enter your MongoDB URI (leave empty to use Heroku MongoDB add-on):"
read MONGODB_URI
if [ -n "$MONGODB_URI" ]; then
    heroku config:set MONGODB_URI=$MONGODB_URI --app $APP_NAME
fi

echo "Please enter your JWT secret for production:"
read -s JWT_SECRET
if [ -n "$JWT_SECRET" ]; then
    heroku config:set JWT_SECRET=$JWT_SECRET --app $APP_NAME
fi

echo "Please enter your JWT refresh secret for production:"
read -s JWT_REFRESH_SECRET
if [ -n "$JWT_REFRESH_SECRET" ]; then
    heroku config:set JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET --app $APP_NAME
fi

echo "Please enter your CORS origin (e.g., https://your-frontend-domain.com):"
read CORS_ORIGIN
if [ -n "$CORS_ORIGIN" ]; then
    heroku config:set CORS_ORIGIN=$CORS_ORIGIN --app $APP_NAME
fi

# Set other environment variables from .env.production
if [ -f .env.production ]; then
    echo "Setting additional environment variables from .env.production..."
    while IFS= read -r line || [[ -n "$line" ]]; do
        # Skip comments and empty lines
        if [[ $line == \#* ]] || [[ -z $line ]]; then
            continue
        fi
        
        # Skip variables we've already set
        if [[ $line == NODE_ENV=* ]] || [[ $line == MONGODB_URI=* ]] || [[ $line == JWT_SECRET=* ]] || [[ $line == JWT_REFRESH_SECRET=* ]] || [[ $line == CORS_ORIGIN=* ]]; then
            continue
        fi
        
        # Set the environment variable
        heroku config:set "$line" --app $APP_NAME
    done < .env.production
fi

# Deploy to Heroku
echo "Deploying to Heroku..."
git push heroku main || git push heroku master

# Open the app
echo "Opening the app..."
heroku open --app $APP_NAME

echo "Deployment completed successfully!"
echo "You can view your app at: https://$APP_NAME.herokuapp.com"
echo "To view logs, run: heroku logs --tail --app $APP_NAME"
