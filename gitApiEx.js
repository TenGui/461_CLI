"use strict";
/*
Installed Packages:

sudo apt install gh
npm install @types/node
*/
exports.__esModule = true;
// Must Authenticate Git Login Before Using The API
var child_process_1 = require("child_process");
/*
Exec - Run CLI Commands
Arguments:
    First: Shell Command You Want To Be Run
    Second: Callback Function () => {} defined to handle the results of the shell command
*/
function runCLI(shellCommand) {
    (0, child_process_1.exec)(shellCommand, function (error, stdout, stderr) {
        if (error) {
            console.error("Error: ".concat(error.message));
            return;
        }
        if (stderr) {
            console.error("stderr: ".concat(stderr));
            return;
        }
        console.log("stdout:\n".concat(stdout));
        if (error) {
            console.log('gh auth login succeeded!');
        }
        else {
            console.error('gh auth login failed.');
        }
    });
}
// Running With Token To Automate the Authorization
runCLI('gh auth login --with-token < mytoken.txt');
