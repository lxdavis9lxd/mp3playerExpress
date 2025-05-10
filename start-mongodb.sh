#!/bin/bash

echo "Starting local MongoDB..."

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "MongoDB is not installed. Please install MongoDB first."
    exit 1
fi

# Create data directory if it doesn't exist
mkdir -p /tmp/mongodb-data

# Start MongoDB as a background process
mongod --dbpath /tmp/mongodb-data --port 27017 --logpath /tmp/mongodb.log --fork

if [ $? -eq 0 ]; then
    echo "MongoDB started successfully"
    echo "You can now start the application with: npm run dev"
else
    echo "Failed to start MongoDB. Check logs at /tmp/mongodb.log"
    exit 1
fi
