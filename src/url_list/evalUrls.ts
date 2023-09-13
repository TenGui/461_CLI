import * as fs from "fs";
import * as path from "path";
import { RateLimiter } from "../utils/apiRateLimit";
import * as LicenseRunner from "./licenseMetric/licenseRunner";

async function eval_file(filepath: string = "URL_FILE_PATH"): Promise<void> {
  const url_list = get_urls(filepath);
  url_list.forEach(async (urlstr) => {
    const limiter = new RateLimiter();
    const url = CreateApiUrl(urlstr);
    const licenseScore = await LicenseRunner.getLicenseScore(limiter, url);
    console.log(urlstr, licenseScore);
    //do something
  });
}

function CreateApiUrl(url: string): string {
  const username = url.split("/")[3];
  const repo = url.split("/")[4];
  return `/repos/${username}/${repo}`;
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
