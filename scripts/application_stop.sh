#!/bin/bash

# Stopping existing node servers gracefully
echo "Stopping any existing node servers"

# Find the Node.js processes
pids=$(pgrep node)

# Loop through the PIDs and gracefully stop the Node.js processes
for pid in $pids; do
  echo "Stopping Node.js process with PID $pid"
  kill -SIGTERM $pid
done