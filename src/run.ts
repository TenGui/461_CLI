//title

import * as run_install from "./install/runInstall";
function printsmthn(s: string) {
  console.log("Your string: " + s);
  return null;
}

printsmthn("Hello World");
console.log("hi there");


if (process.argv.length != 3) {
  console.log("Usage: run.ts <filename>");
  process.exit(1);
}


if (process.argv[2] == "install") {

  let installResult:boolean = run_install.install(process.cwd() + '/package.json', process.cwd() + '/log.txt');
  if (installResult) {
    console.log("Installation completed successfully.");
  }
  else {
    console.log("Installation failed.");
  }
}