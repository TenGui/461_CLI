import { RateLimiter } from "../utils/apiRateLimit";
import { get_urls, parseFromGitLink } from "../utils/utils";
import * as LicenseRunner from "./licenseMetric/licenseRunner";
import * as BusFactorRunner from "./busFactorMetric/busFactorRunner";
async function eval_file(filepath: string = "URL_FILE_PATH"): Promise<void> {
  const url_list = get_urls(filepath);
  url_list.forEach(async (urlstr) => {
    const limiter = new RateLimiter();
    const url = parseFromGitLink(urlstr);
    const licenseScore = await LicenseRunner.getLicenseScore(
      limiter,
      `/repos/${url[0]}/${url[1]}`
    );
    const busFactorScore = await BusFactorRunner.getBusFactorScore(
      limiter, 
      `/repos/${url[0]}/${url[1]}`
    );
    console.log(urlstr, licenseScore, busFactorScore);
    //do something
  });
}

export { eval_file };
