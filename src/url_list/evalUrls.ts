import { RateLimiter } from "../utils/apiRateLimit";
import { get_urls, parseFromGitLink } from "../utils/utils";
import * as LicenseRunner from "./licenseMetric/licenseRunner";
import * as BusFactorRunner from "./busFactorMetric/busFactorRunner";
import * as RampUpRunner from "./rampUpMetric/rampUpRunner";
import * as RespMaintRunner from "./respMaintMetric/respMaintRunner";
import * as CorrectnessRunner from "./correctnessMetric/correctnessRunner";

async function eval_file(filepath: string = "URL_FILE_PATH"): Promise<void> {
  const url_list = get_urls(filepath);
  url_list.forEach(async (urlstr) => {
    const limiter = new RateLimiter();
    const url = parseFromGitLink(urlstr);
    //LICENSE SCORE
    const licenseScore: number = await LicenseRunner.getLicenseScore(
      limiter,
      `/repos/${url[0]}/${url[1]}`
    );

    //RAMPUP SCORE
    const rampUpScore: number = await RampUpRunner.getRampUpScore(url);

    //BUSFACTOR SCORE
    const busFactorScore: number = await BusFactorRunner.getBusFactorScore(
      limiter,
      `/repos/${url[0]}/${url[1]}`
    );

    //RESPONSIVE MAINTAINER SCORE
    const maintainerScore: number = await RespMaintRunner.getRespMaintScore(
      url
    );

    //CORRECTNESS SCORE
    const correctnessScore: number = 0;

    //OVERALL SCORE
    const multipliers = {
      license: 0,
      rampUp: 0.15,
      busFactor: 0.2,
      maintainer: 0.2,
      correctness: 0.4,
    };

    const adjustedScores: { [x: string]: number } = {
      licenseScore: licenseScore,
      rampUpScore: rampUpScore,
      busFactorScore: busFactorScore,
      maintainerScore: maintainerScore,
      correctnessScore: correctnessScore,
    };

    Object.entries(adjustedScores).forEach(([key, score]): any => {
      adjustedScores[key] =
        Math.round((score + Number.EPSILON) * 100000) / 100000;
    });

    const overallScore: number =
      Math.round(
        (multipliers.license * licenseScore +
          multipliers.rampUp * rampUpScore +
          multipliers.busFactor * busFactorScore +
          multipliers.maintainer * maintainerScore +
          multipliers.correctness * correctnessScore +
          Number.EPSILON) *
          100000
      ) / 100000;

    console.log(
      `{"URL": ${urlstr}, "NetScore": ${overallScore}, "RampUp": ${adjustedScores.rampUpScore}, "Correctness": ${adjustedScores.correctnessScore}, "BusFactor": ${adjustedScores.busFactorScore}, "ResponsiveMaintainer": ${adjustedScores.maintainerScore}, "License": ${adjustedScores.licenseScore}}`
    );
  });
}

export { eval_file };
