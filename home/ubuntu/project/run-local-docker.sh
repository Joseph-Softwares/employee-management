#!/bin/bash

# Script to run the Employee Management System locally using Docker Compose

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  echo "Docker is not installed. Please install Docker first."
  echo "You can install Docker by following the instructions at: https://docs.docker.com/get-docker/"
  exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
  echo "Docker Compose is not installed. Please install Docker Compose first."
  echo "You can install Docker Compose by following the instructions at: https://docs.docker.com/compose/install/"
  exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
  echo "Docker is not running. Please start Docker first."
  exit 1
fi

# Build and start the containers
echo "Building and starting the containers..."
docker-compose -f docker-compose.local.yml up -d --build

# Check if the containers are running
if [ $? -eq 0 ]; then
  echo "Containers are running successfully!"
  echo "The application is available at: http://localhost:5000"
  echo "MongoDB is available at: mongodb://localhost:27017"
  echo "MongoDB Express (web interface) is available at: http://localhost:8081"
  echo "MongoDB Express credentials: admin / admin123"
  
  # Display container logs
  echo ""
  echo "Container logs:"
  docker-compose -f docker-compose.local.yml logs
  
  echo ""
  echo "To stop the containers, run: docker-compose -f docker-compose.local.yml down"
  echo "To view logs, run: docker-compose -f docker-compose.local.yml logs -f"
else
  echo "Failed to start the containers. Please check the Docker logs for more information."
  exit 1
fi
