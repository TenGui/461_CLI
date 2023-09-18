#!/usr/bin/env node
import * as runInstall from "./install/installProcess";
import * as evalUrls from "./url_list/evalUrls";
import * as dotenv from "dotenv";
import * as child_process from "child_process";
dotenv.config();

if (process.argv.length != 3) {
  console.log("Usage: \n./run install\n./run <url_file>\n./run test");
  process.exit(1);
}

if (process.argv[2] == "install") {
  const installResult: boolean = runInstall.install();
  installResult ? process.exit(0) : process.exit(1);
} else if (process.argv[2] == "test") {
  try {
    child_process.execSync("npm test", { stdio: "inherit"});
    process.exit(0);
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  
} else {
  const filePath: string = process.argv[2];
  evalUrls.eval_file(filePath);
}
