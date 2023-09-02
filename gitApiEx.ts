/*
Installed Packages:

sudo apt install gh
npm install @types/node
*/

// Must Authenticate Git Login Before Using The API

import { exec } from 'child_process';

/*
Exec - Run CLI Commands
Arguments: 
    First: Shell Command You Want To Be Run
    Second: Callback Function () => {} defined to handle the results of the shell command
*/

function runCLI(shellCommand:string): void {
    exec(shellCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
          }
          console.log(`stdout:\n${stdout}`);
    });
}

// Running With Token To Automate the Authorization
 runCLI('gh auth login --with-token < mytoken.txt');

