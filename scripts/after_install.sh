#!/bin/bash
echo 'run after_install.sh: ' >> /home/ec2-user/461_Team4_Phase2/deploy.log

echo 'cd /home/ec2-user/461_Team4_Phase2' >> /home/ec2-user/461_Team4_Phase2/deploy.log
cd /home/ec2-user/461_Team4_Phase2 >> /home/ec2-user/461_Team4_Phase2/deploy.log

echo 'npm install' >> /home/ec2-user/461_Team4_Phase2/deploy.log 
npm install >> /home/ec2-user/461_Team4_Phase2/deploy.log

echo 'Changing permissions...'
sudo chown ec2-user:ec2-user /home/ec2-user/461_Team4_Phase2/zip_file_package.json
sudo chown -R ec2-user:ec2-user /home/ec2-user/461_Team4_Phase2/rampup_repos