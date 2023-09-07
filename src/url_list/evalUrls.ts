import * as fs from "fs";
import * as path from "path";

function eval_file(filepath: string = "URL_FILE_PATH"): boolean {
  const url_list = get_urls(filepath);
  url_list.forEach((urlstr) => {
    //do something
  });
  return false;
}

function get_urls(filepath: string): string[] {
  const fullpath = path.join(process.cwd(), filepath);
  try {
    const filedata = fs.readFileSync(fullpath, "utf-8");
    return filedata.split("\n").filter(Boolean);
  } catch {
    console.log("Error reading: " + fullpath);
    process.exit(-1);
  }
}

export { eval_file };
