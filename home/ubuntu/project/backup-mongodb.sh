#!/bin/bash

# Script to backup MongoDB database for the Employee Management System

# Default values
BACKUP_DIR="/home/ubuntu/mongodb-backups"
MONGODB_URI=${MONGODB_URI:-"mongodb://localhost:27017/employee-management-system"}
RETENTION_DAYS=7

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --backup-dir)
      BACKUP_DIR="$2"
      shift 2
      ;;
    --mongodb-uri)
      MONGODB_URI="$2"
      shift 2
      ;;
    --retention-days)
      RETENTION_DAYS="$2"
      shift 2
      ;;
    --help)
      echo "Usage: $0 [options]"
      echo "Options:"
      echo "  --backup-dir DIR       Directory to store backups (default: /home/ubuntu/mongodb-backups)"
      echo "  --mongodb-uri URI      MongoDB connection URI (default: mongodb://localhost:27017/employee-management-system)"
      echo "  --retention-days DAYS  Number of days to keep backups (default: 7)"
      echo "  --help                 Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Extract database name from URI
DB_NAME=$(echo $MONGODB_URI | sed -n 's/.*\/\([^?]*\).*/\1/p')
if [ -z "$DB_NAME" ]; then
  DB_NAME="employee-management-system"
  echo "Could not extract database name from URI, using default: $DB_NAME"
fi

# Generate timestamp for backup filename
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILENAME="${DB_NAME}_${TIMESTAMP}.gz"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILENAME}"

# Check if mongodump is installed
if ! command -v mongodump &> /dev/null; then
  echo "mongodump is not installed. Installing MongoDB tools..."
  apt-get update
  apt-get install -y mongodb-clients mongodb-tools || {
    echo "Failed to install MongoDB tools. Please install manually."
    exit 1
  }
fi

# Perform the backup
echo "Starting backup of $DB_NAME to $BACKUP_PATH..."
mongodump --uri="$MONGODB_URI" --archive="$BACKUP_PATH" --gzip

# Check if backup was successful
if [ $? -eq 0 ]; then
  echo "Backup completed successfully: $BACKUP_PATH"
  
  # Calculate backup size
  BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
  echo "Backup size: $BACKUP_SIZE"
  
  # Remove old backups
  echo "Removing backups older than $RETENTION_DAYS days..."
  find "$BACKUP_DIR" -name "${DB_NAME}_*.gz" -type f -mtime +$RETENTION_DAYS -delete
  
  # List remaining backups
  echo "Current backups:"
  ls -lh "$BACKUP_DIR" | grep "${DB_NAME}_"
else
  echo "Backup failed!"
  exit 1
fi

# Instructions for restoring the backup
echo ""
echo "To restore this backup, use the following command:"
echo "mongorestore --uri=\"$MONGODB_URI\" --gzip --archive=\"$BACKUP_PATH\""
echo ""
echo "For automated backups, add this script to crontab:"
echo "0 2 * * * /home/ubuntu/project/backup-mongodb.sh > /home/ubuntu/mongodb-backup.log 2>&1"
