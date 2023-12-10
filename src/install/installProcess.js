#!/usr/bin/env ./node_modules/.bin/ts-node-script
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = void 0;
var child_process = require("child_process");
var fs = require("fs");
var path = require("path");
function install(packagePath, logFolderPath, fileName) {
    if (packagePath === void 0) { packagePath = "/package.json"; }
    if (logFolderPath === void 0) { logFolderPath = "/logs"; }
    if (fileName === void 0) { fileName = "install.log"; }
    var fullPackagePath = path.join(process.cwd(), packagePath);
    var dirPath = path.join(process.cwd(), logFolderPath);
    var filePath = path.join(dirPath, fileName);
    var dependencies = getDependencies(fullPackagePath);
    //Check if directories already exist
    if (!fs.existsSync(dirPath)) {
        try {
            fs.mkdirSync(dirPath, { recursive: true });
        }
        catch (err) {
            console.error("Error creating folder '".concat(dirPath, "': ").concat(err));
        }
    }
    //Install Dependencies
    for (var dependency in dependencies) {
        try {
            var command = "npm install ".concat(dependency);
            var result = child_process.execSync(command, {
                stdio: "pipe",
                encoding: "utf-8",
            });
            fs.appendFileSync(filePath, "=== ".concat(dependency, " Installation ===\n"));
            fs.appendFileSync(filePath, "STDOUT:\n".concat(result, "\n"));
            // console.log(`Installation of ${dependency} completed successfully.`);
        }
        catch (error) {
            // console.log(`Installation of ${dependency} failed.`);
            // console.log(error);
            // console.log("\x1b[41m", "Installation cancelled.", "\x1b[0m");
            return false;
        }
    }
    // console.log("\x1b[32m", "Installation completed successfully.", "\x1b[0m");
    return true;
}
exports.install = install;
function getDependencies(path) {
    var packageJson = JSON.parse(fs.readFileSync(path).toString());
    return packageJson.devDependencies;
}
