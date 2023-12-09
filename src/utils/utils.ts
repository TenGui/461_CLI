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

export async function GetDetailsFromNPM(
  url: string
): Promise<[string, string]> {
  const packagename = url.split("/").pop();
  const data = await fetch(`https://registry.npmjs.org/${packagename}`)
    .then((res) => res.json())
    .then((data) => data.repository.url);
  const datasplit = data.split("/");
  const repo = datasplit.pop().split(".")[0];
  return [datasplit.pop(), repo];
}




