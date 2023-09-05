#!/usr/bin/env ./node_modules/.bin/ts-node-script
import * as child_process from "child_process";
import * as fs from "fs";


function install(packagePath: string, logFilePath: string): boolean {
    const dependencies = getDependencies(packagePath);
    for (let dependency in dependencies) {
        try{
          const command = `npm install ${dependency}`;
          const result = child_process.execSync(command, {stdio: 'pipe', encoding: 'utf-8'});
          fs.appendFileSync(logFilePath, `=== ${dependency} Installation ===\n`);
          fs.appendFileSync(logFilePath, `STDOUT:\n${result}\n`);
          console.log(`Installation of ${dependency} completed successfully.`);
        } catch (error) {
            console.log(`Installation of ${dependency} failed.`);
            console.log(error);
            return false
        }
    }
    return true;
}


function getDependencies(path: string){
  let packageJson = JSON.parse(fs.readFileSync(path).toString());
  return packageJson.devDependencies;
}

export {install};