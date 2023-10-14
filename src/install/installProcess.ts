#!/usr/bin/env ./node_modules/.bin/ts-node-script
import * as child_process from "child_process";
import * as fs from "fs";
import * as path from "path";

function install(
  packagePath: string = "/package.json",
  logFolderPath: string = "/logs",
  fileName: string = "install.log"
): boolean {
  const fullPackagePath = path.join(process.cwd(), packagePath);
  const dirPath = path.join(process.cwd(), logFolderPath);
  const filePath = path.join(dirPath, fileName);
  const dependencies = getDependencies(fullPackagePath);

  //Check if directories already exist
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
    } catch (err) {
      console.error(`Error creating folder '${dirPath}': ${err}`);
    }
  }

  //Install Dependencies
  for (const dependency in dependencies) {
    try {
      const command = `npm install ${dependency}`;
      const result = child_process.execSync(command, {
        stdio: "pipe",
        encoding: "utf-8",
      });
      fs.appendFileSync(filePath, `=== ${dependency} Installation ===\n`);
      fs.appendFileSync(filePath, `STDOUT:\n${result}\n`);
      // console.log(`Installation of ${dependency} completed successfully.`);
    } catch (error) {
      // console.log(`Installation of ${dependency} failed.`);
      // console.log(error);
      // console.log("\x1b[41m", "Installation cancelled.", "\x1b[0m");
      return false;
    }
  }
  // console.log("\x1b[32m", "Installation completed successfully.", "\x1b[0m");
  return true;
}

function getDependencies(path: string) {
  const packageJson = JSON.parse(fs.readFileSync(path).toString());
  return packageJson.devDependencies;
}

export { install };
