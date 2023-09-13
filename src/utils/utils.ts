import * as fs from "fs";
import * as path from "path";

export function parseFromGitLink(url: string): [string, string] {
  const username: string = url.split("/")[3];
  const repo: string = url.split("/")[4];
  return [username, repo];
}

export function get_urls(filepath: string): string[] {
  const fullpath = path.join(process.cwd(), filepath);
  try {
    const filedata = fs.readFileSync(fullpath, "utf-8");
    return filedata.split("\n").filter(Boolean);
  } catch {
    console.log("Error reading: " + fullpath);
    process.exit(-1);
  }
}
