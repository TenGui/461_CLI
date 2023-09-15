import { RateLimiter } from "../utils/apiRateLimit";
import { get_urls, parseFromGitLink } from "../utils/utils";
import * as LicenseRunner from "./licenseMetric/licenseRunner";
<<<<<<< HEAD
<<<<<<< HEAD
import * as BusFactorRunner from "./busFactorMetric/busFactorRunner";
=======
import { getRampUpScore } from "./rampUpMetric/rampUpRunner";
=======
import * as RampUpRunner from "./rampUpMetric/rampUpRunner";
import * as BusFactorRunner from "./busFactorMetric/busFactorRunner";
>>>>>>> 913bfdf (adjusted rampUp call, commented out rampUp, fixed merge conflicts)

>>>>>>> 5e4f7a1 (Rampup (#54))
async function eval_file(filepath: string = "URL_FILE_PATH"): Promise<void> {
  const url_list = get_urls(filepath);
  url_list.forEach(async (urlstr) => {
    const limiter = new RateLimiter();
    const url = parseFromGitLink(urlstr);
    const licenseScore = await LicenseRunner.getLicenseScore(
      limiter,
      `/repos/${url[0]}/${url[1]}`
    );
<<<<<<< HEAD
    const busFactorScore = await BusFactorRunner.getBusFactorScore(
      limiter, 
      `/repos/${url[0]}/${url[1]}`
    );
    console.log(urlstr, licenseScore, busFactorScore);
=======
    console.log(urlstr, licenseScore);

<<<<<<< HEAD
    const rampUpScore = await getRampUpScore(url);
    console.log(urlstr, rampUpScore);
>>>>>>> 5e4f7a1 (Rampup (#54))
=======
    // const rampUpScore = await RampUpRunner.getRampUpScore(url);
    // console.log(urlstr, rampUpScore);
    // need to fix, running too long

    const busFactorScore = await BusFactorRunner.getBusFactorScore(
      limiter,
      `/repos/${url[0]}/${url[1]}`
    );
    console.log(urlstr, busFactorScore);
>>>>>>> 913bfdf (adjusted rampUp call, commented out rampUp, fixed merge conflicts)
    //do something
  });
}

export { eval_file };
