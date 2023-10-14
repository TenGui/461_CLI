#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runInstall = require("./src/install/installProcess");
if (process.argv.length != 3) {
    console.log("Usage: \n./run install\n./run <url_file>\n./run test");
    process.exit(1);
}
if (!process.env.GITHUB_TOKEN) {
    process.exit(1);
}
if (!process.env.LOG_FILE) {
    process.exit(1);
}
if (process.argv[2] == "install") {
    const installResult = runInstall.install();
    installResult ? process.exit(0) : process.exit(1);
}
const evalUrls = require("./src/url_list/evalUrls");
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
if (process.argv[2] == "test") {
    try {
        const npmTestProcess = child_process.spawnSync("npm", ["test"], {
            encoding: "utf8",
        });
        const output = npmTestProcess.output;
        let outputInfo = "";
        for (const line of output) {
            if (line && line.includes("Tests:")) {
                outputInfo = line.trim();
                break;
            }
        }
        const testCasesPassedRegex = /Tests:\s*(?:(\d+)\s+failed,\s*)?(\d+)\s+passed,\s+(\d+)\s+total/;
        const testCasesPassed = outputInfo.match(testCasesPassedRegex);
        if (!testCasesPassed) {
            process.exit(1);
        }
        else {
            const passed = parseInt(testCasesPassed[2]);
            const total = parseInt(testCasesPassed[3]);
            const coverage = JSON.parse(fs.readFileSync(path.join(process.cwd(), "/coverage/coverage-summary.json"), { encoding: "utf8" }));
            const line_coverage = coverage.total.lines.pct.toFixed(0);
            console.log(`${passed}/${total} test cases passed. ${line_coverage}% line coverage achieved.`);
            process.exit(0);
        }
    }
    catch (err) {
        process.exit(1);
    }
}
else {
    const filePath = process.argv[2];
    evalUrls.eval_file(filePath);
}
