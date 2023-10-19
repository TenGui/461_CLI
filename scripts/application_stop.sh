#!/bin/bash
#Stopping existing node servers
chmod +x /scripts/application_stop.sh
echo "Stopping any existing node servers"
pkill node 