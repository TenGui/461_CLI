import * as fs from "fs";
import * as path from "path";
import { RateLimiter } from "../utils/apiRateLimit";

async function eval_file(filepath: string = "URL_FILE_PATH"): Promise<void> {
  const url_list = get_urls(filepath);
  url_list.forEach((urlstr) => {
    //do something
  });
  const limiter = new RateLimiter();
  const info = await limiter.getGitHubInfo("/repos/ShaoNingHuang/461_CLI");
  console.log("info: " + info.ssh_url);
  const info2 = await limiter.getGitHubInfo("/repos/ShaoNingHuang/461_CLI");
  console.log("info2: " + info2.ssh_url);
  console.log("Exiting...");
  process.exit(0);
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
