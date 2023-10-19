#!/bin/bash
#Stopping existing node servers
sudo chmod +x /scripts/application_stop.sh
echo "Stopping any existing node servers"
sudo pkill node 