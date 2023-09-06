#!/usr/bin/env node
import * as run_install from "./install/runInstall";

if (process.argv.length != 3) {
  console.log("Usage: run.ts <filename>");
  process.exit(1);
}

if (process.argv[2] == "install") {
  const installResult: boolean = run_install.install(
    "/package.json",
    "/logs",
    "install.log"
  );
  if (installResult) {
    console.log("Installation completed successfully.");
  } else {
    console.log("Installation failed.");
  }
}
