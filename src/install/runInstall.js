#!/usr/bin/env ./node_modules/.bin/ts-node-script
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.install = void 0;
var child_process = require("child_process");
var fs = require("fs");
function install(packagePath, logFilePath) {
    var dependencies = getDependencies(packagePath);
    for (var dependency in dependencies) {
        try {
            var command = "npm install ".concat(dependency);
            var result = child_process.execSync(command, { stdio: 'pipe', encoding: 'utf-8' });
            fs.appendFileSync(logFilePath, "=== ".concat(dependency, " Installation ===\n"));
            fs.appendFileSync(logFilePath, "STDOUT:\n".concat(result, "\n"));
            console.log("Installation of ".concat(dependency, " completed successfully."));
        }
        catch (error) {
            console.log("Installation of ".concat(dependency, " failed."));
            console.log(error);
            return false;
        }
    }
    return true;
}
exports.install = install;
function getDependencies(path) {
    var packageJson = JSON.parse(fs.readFileSync(path).toString());
    return packageJson.devDependencies;
}
