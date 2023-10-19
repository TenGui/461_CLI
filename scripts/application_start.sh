#!/bin/bash

echo 'run application_start.sh: ' >> /home/ec2-user/461_Team4_Phase2/deploy.log

echo 'pm2 restart nodejs-express-app' >> /home/ec2-user/461_Team4_Phase2/deploy.log
pm2 restart nodejs-express-app >> /home/ec2-user/461_Team4_Phase2/deploy.log
