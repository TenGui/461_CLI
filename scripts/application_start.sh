#!/bin/bash
echo 'run application_start.sh: ' >> /home/ec2-user/461_Team4_Phase2/deploy.log

cd /home/ec2-user/461_Team4_Phase2 >> /home/ec2-user/461_Team4_Phase2/deploy.log

echo 'pm2 restart app --update-env' >> /home/ec2-user/461_Team4_Phase2/deploy.log
pm2 restart app --update-env >> /home/ec2-user/461_Team4_Phase2/deploy.log
