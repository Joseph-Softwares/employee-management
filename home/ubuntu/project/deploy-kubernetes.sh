#!/bin/bash

# Script to deploy the Employee Management System to Kubernetes

# Default values
DOCKER_IMAGE_NAME="employee-management-system"
DOCKER_IMAGE_TAG="latest"
DOMAIN_NAME="example.com"
NAMESPACE="default"
MONGODB_URI="mongodb://localhost:27017/employee-management-system"
JWT_SECRET="your-secure-jwt-secret-for-production"
JWT_REFRESH_SECRET="your-secure-jwt-refresh-secret-for-production"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --image-name)
      DOCKER_IMAGE_NAME="$2"
      shift 2
      ;;
    --image-tag)
      DOCKER_IMAGE_TAG="$2"
      shift 2
      ;;
    --domain)
      DOMAIN_NAME="$2"
      shift 2
      ;;
    --namespace)
      NAMESPACE="$2"
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
    --help)
      echo "Usage: $0 [options]"
      echo "Options:"
      echo "  --image-name NAME            Docker image name (default: employee-management-system)"
      echo "  --image-tag TAG              Docker image tag (default: latest)"
      echo "  --domain DOMAIN              Domain name for the application (default: example.com)"
      echo "  --namespace NAMESPACE        Kubernetes namespace (default: default)"
      echo "  --mongodb-uri URI            MongoDB connection URI"
      echo "  --jwt-secret SECRET          JWT secret for production"
      echo "  --jwt-refresh-secret SECRET  JWT refresh secret for production"
      echo "  --help                       Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
  echo "kubectl is not installed. Please install kubectl first."
  exit 1
fi

# Check if the namespace exists, create it if it doesn't
if ! kubectl get namespace $NAMESPACE &> /dev/null; then
  echo "Creating namespace: $NAMESPACE"
  kubectl create namespace $NAMESPACE
fi

# Encode secrets in base64
BASE64_MONGODB_URI=$(echo -n "$MONGODB_URI" | base64)
BASE64_JWT_SECRET=$(echo -n "$JWT_SECRET" | base64)
BASE64_JWT_REFRESH_SECRET=$(echo -n "$JWT_REFRESH_SECRET" | base64)

# Create a temporary deployment file with the variables replaced
TEMP_DEPLOYMENT_FILE=$(mktemp)
cat kubernetes/deployment.yaml | \
  sed "s|\${DOCKER_IMAGE_NAME}|$DOCKER_IMAGE_NAME|g" | \
  sed "s|\${DOCKER_IMAGE_TAG}|$DOCKER_IMAGE_TAG|g" | \
  sed "s|\${DOMAIN_NAME}|$DOMAIN_NAME|g" | \
  sed "s|\${BASE64_MONGODB_URI}|$BASE64_MONGODB_URI|g" | \
  sed "s|\${BASE64_JWT_SECRET}|$BASE64_JWT_SECRET|g" | \
  sed "s|\${BASE64_JWT_REFRESH_SECRET}|$BASE64_JWT_REFRESH_SECRET|g" \
  > $TEMP_DEPLOYMENT_FILE

# Apply the Kubernetes configuration
echo "Deploying to Kubernetes namespace: $NAMESPACE"
kubectl apply -f $TEMP_DEPLOYMENT_FILE -n $NAMESPACE

# Clean up the temporary file
rm $TEMP_DEPLOYMENT_FILE

# Wait for the deployment to be ready
echo "Waiting for deployment to be ready..."
kubectl rollout status deployment/employee-management-system -n $NAMESPACE

# Get the deployment status
echo "Deployment status:"
kubectl get deployment employee-management-system -n $NAMESPACE

# Get the service status
echo "Service status:"
kubectl get service employee-management-system -n $NAMESPACE

# Get the ingress status
echo "Ingress status:"
kubectl get ingress employee-management-system -n $NAMESPACE

echo "Deployment completed successfully!"
echo "Your application should be accessible at: https://$DOMAIN_NAME"
echo "It may take a few minutes for DNS and SSL certificate to be fully provisioned."
