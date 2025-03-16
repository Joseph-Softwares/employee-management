#!/bin/bash

# Script to deploy the Employee Management System locally

# Default values
PORT=5000
MONGODB_URI="mongodb://localhost:27017/employee-management-system"
JWT_SECRET="local-development-jwt-secret"
JWT_REFRESH_SECRET="local-development-jwt-refresh-secret"
CORS_ORIGIN="http://localhost:3000"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --port)
      PORT="$2"
      shift 2
      ;;
    --mongodb-uri)
      MONGODB_URI="$2"
      shift 2
      ;;
    --jwt-secret)
      JWT_SECRET="$2"
      shift 2
      ;;
    --jwt-refresh-secret)
      JWT_REFRESH_SECRET="$2"
      shift 2
      ;;
    --cors-origin)
      CORS_ORIGIN="$2"
      shift 2
      ;;
    --help)
      echo "Usage: $0 [options]"
      echo "Options:"
      echo "  --port PORT                 Port to run the server on (default: 5000)"
      echo "  --mongodb-uri URI           MongoDB connection URI (default: mongodb://localhost:27017/employee-management-system)"
      echo "  --jwt-secret SECRET         JWT secret for development"
      echo "  --jwt-refresh-secret SECRET JWT refresh secret for development"
      echo "  --cors-origin ORIGIN        CORS origin (default: http://localhost:3000)"
      echo "  --help                      Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Check if MongoDB is installed and running
echo "Checking MongoDB..."
if command -v mongod &> /dev/null; then
  echo "MongoDB is installed."
  
  # Check if MongoDB is running
  if pgrep mongod &> /dev/null; then
    echo "MongoDB is running."
  else
    echo "MongoDB is not running. Starting MongoDB..."
    if command -v systemctl &> /dev/null; then
      sudo systemctl start mongodb || sudo systemctl start mongod || {
        echo "Failed to start MongoDB using systemctl. Please start MongoDB manually."
        echo "You can start MongoDB with: mongod --dbpath /var/lib/mongodb"
      }
    else
      echo "Could not start MongoDB automatically. Please start MongoDB manually."
      echo "You can start MongoDB with: mongod --dbpath /var/lib/mongodb"
    fi
  fi
else
  echo "MongoDB is not installed. Please install MongoDB first."
  echo "You can install MongoDB on Ubuntu with: sudo apt-get install -y mongodb"
  echo "Or follow the instructions at: https://docs.mongodb.com/manual/installation/"
  
  read -p "Do you want to continue without MongoDB? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Create .env file for local development
echo "Creating .env file for local development..."
cat > .env <<EOF
NODE_ENV=development
PORT=$PORT
MONGODB_URI=$MONGODB_URI
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=$CORS_ORIGIN
EOF

echo "Environment variables set in .env file."

# Install dependencies
echo "Installing dependencies..."
npm install

# Check if frontend directory exists and has package.json
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
  echo "Installing frontend dependencies..."
  cd frontend
  npm install
  
  # Build frontend for production or start development server
  read -p "Do you want to build the frontend for production? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Building frontend..."
    npm run build
    cd ..
    
    # Start the server in production mode
    echo "Starting the server in production mode..."
    echo "The application will be available at: http://localhost:$PORT"
    NODE_ENV=production npm start
  else
    # Start frontend development server
    echo "Starting frontend development server..."
    echo "The frontend will be available at: http://localhost:3000"
    npm start &
    FRONTEND_PID=$!
    
    # Go back to project root
    cd ..
    
    # Start backend development server
    echo "Starting backend development server..."
    echo "The backend will be available at: http://localhost:$PORT"
    npm run dev &
    BACKEND_PID=$!
    
    # Handle termination
    trap "kill $FRONTEND_PID $BACKEND_PID; exit" SIGINT SIGTERM
    wait
  fi
else
  # Start the server
  echo "Starting the server..."
  echo "The application will be available at: http://localhost:$PORT"
  npm run dev
fi
