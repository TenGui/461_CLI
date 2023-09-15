import { RateLimiter } from "../utils/apiRateLimit";
import { get_urls, parseFromGitLink } from "../utils/utils";
import * as LicenseRunner from "./licenseMetric/licenseRunner";
import * as BusFactorRunner from "./busFactorMetric/busFactorRunner";
import * as RampUpRunner from "./rampUpMetric/rampUpRunner";

async function eval_file(filepath: string = "URL_FILE_PATH"): Promise<void> {
  const url_list = get_urls(filepath);
  url_list.forEach(async (urlstr) => {
    const limiter = new RateLimiter();
    const url = parseFromGitLink(urlstr);
    //LICENSE SCORE
    const licenseScore = await LicenseRunner.getLicenseScore(
      limiter,
      `/repos/${url[0]}/${url[1]}`
    );
    console.log("LICENSE: ", urlstr, licenseScore);
    //RAMPUP SCORE
    const rampUpScore = await RampUpRunner.getRampUpScore(url);
    console.log("RAMP_UP: ", urlstr, rampUpScore);
    //BUSFACTOR SCORE
    const busFactorScore = await BusFactorRunner.getBusFactorScore(
      limiter,
      `/repos/${url[0]}/${url[1]}`
    );
    console.log("BUS_FAC: ", urlstr, busFactorScore);
    //RESPONSIVE MAINTAINER SCORE

    //CORRECTNESS SCORE
  });
}

export { eval_file };
