#!/usr/bin/env ./node_modules/.bin/ts-node-script
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = void 0;
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
function install(packagePath = "/package.json", logFolderPath = "/logs", fileName = "install.log") {
    const fullPackagePath = path.join(process.cwd(), packagePath);
    const dirPath = path.join(process.cwd(), logFolderPath);
    const filePath = path.join(dirPath, fileName);
    const dependencies = getDependencies(fullPackagePath);
    if (!fs.existsSync(dirPath)) {
        try {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        catch (err) {
            console.error(`Error creating folder '${dirPath}': ${err}`);
        }
    }
    for (const dependency in dependencies) {
        try {
            const command = `npm install ${dependency}`;
            const result = child_process.execSync(command, {
                stdio: "pipe",
                encoding: "utf-8",
            });
            fs.appendFileSync(filePath, `=== ${dependency} Installation ===\n`);
            fs.appendFileSync(filePath, `STDOUT:\n${result}\n`);
        }
        catch (error) {
            return false;
        }
    }
    return true;
}
exports.install = install;
function getDependencies(path) {
    const packageJson = JSON.parse(fs.readFileSync(path).toString());
    return packageJson.devDependencies;
}
