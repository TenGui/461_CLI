import * as fs from "fs";
import * as path from "path";
import { RateLimiter } from "../utils/apiRateLimit";

async function eval_file(filepath: string = "URL_FILE_PATH"): Promise<void> {
  const url_list = get_urls(filepath);
  url_list.forEach((urlstr) => {
    //do something
  });
  const limiter = new RateLimiter();
  const info = await limiter.getGithubRepoInfo("ShaoNingHuang", "461_CLI");
  const info2 = await limiter.getGithubRepoInfo("ShaoNingHuang", "461_CLI");
  const info3 = await limiter.getGithubRepoInfo("ShaoNingHuang", "461_CLI");
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
