"use strict";
/*
Installed Packages:

sudo apt install gh
npm install @types/node
npm install @actions/github
npm install @actions/core
npm install github-api
npm install @octokit/rest

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
    });
}
// Running With Token To Automate the Authorization
// GITHUB_TOKEN Auto Token Generator
var core = require("@actions/core");
// import { context, GitHub } from '@actions/github'
// HERE IMPORTANT TO DEFINE THE SECRET GITHUB TOKEN IN THE REPO WORKFLOW
// Getting & Verifying The Token
var repoToken = core.getInput('github_token');
if (!repoToken) {
    console.error("Token Generation Failed Or Is Blank");
}
else {
    console.log("Token Generated Successfully");
}
