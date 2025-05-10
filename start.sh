#!/bin/bash

# Start MongoDB if not already running
echo "Checking if MongoDB is running..."
if pgrep mongod > /dev/null
then
    echo "MongoDB is already running"
else
    echo "Starting MongoDB..."
    mkdir -p ~/data/db
    mongod --dbpath ~/data/db --fork --logpath ~/data/mongod.log
    
    if [ $? -eq 0 ]; then
        echo "MongoDB started successfully"
    else
        echo "Failed to start MongoDB. Please make sure MongoDB is installed."
        exit 1
    fi
fi

# Start the application
echo "Starting MP3 Player application..."
npm run dev
