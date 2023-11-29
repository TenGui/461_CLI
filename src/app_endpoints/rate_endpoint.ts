import { RateLimiter } from "../utils/apiRateLimit";
import { GetDetailsFromNPM, parseFromGitLink } from "../utils/utils";
import * as LicenseRunner from "../url_list/licenseMetric/licenseRunner";
import * as BusFactorRunner from "../url_list/busFactorMetric/busFactorRunner";
import * as RampUpRunner from "../url_list/rampUpMetric/rampUpRunner";
import * as RespMaintRunner from "../url_list/respMaintMetric/respMaintRunner";
import * as CorrectnessRunner from "../url_list/correctnessMetric/correctnessRunner";
import * as PR_Runner from "../url_list/PR_metric/pull_request";


async function eval_single_file(urlstr: string): Promise<any> {
    let url: [string, string] = ["", ""];
    if (urlstr.startsWith("https://www.npmjs.com")) {
    url = await GetDetailsFromNPM(urlstr);
    } else {
    url = parseFromGitLink(urlstr);
    }
    const limiter = new RateLimiter();
    //LICENSE SCORE
    const licenseScore: number = await LicenseRunner.getLicenseScore(
    limiter,
    `/repos/${url[0]}/${url[1]}`
    );

    //RAMPUP SCORE
    const rampUpScore: number = await RampUpRunner.getRampUpScore(url);
    // const rampUpScore: number = 0;

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
    const correctnessScore: number = await CorrectnessRunner.getCorrectness(
    url
    );

    const pull_request_score: number = await PR_Runner.getPRscore(
    url
    );
    
    //OVERALL SCORE
    const multipliers = {
    license: 1,
    rampUp: 0.15,
    busFactor: 0.2,
    maintainer: 0.2,
    correctness: 0.25,
    pull_request: 0.2,
    };

    const adjustedScores: { [x: string]: number } = {
    licenseScore: licenseScore,
    rampUpScore: rampUpScore,
    busFactorScore: busFactorScore,
    maintainerScore: maintainerScore,
    correctnessScore: correctnessScore,
    pullrequestScore: pull_request_score,
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
        multipliers.pull_request * pull_request_score +
        Number.EPSILON) *
        100000
    ) / 100000;
    
    const output = `{"URL": "${urlstr}", "NET_SCORE": ${overallScore}, "RAMP_UP_SCORE": ${adjustedScores.rampUpScore}, "CORRECTNESS_SCORE": ${adjustedScores.correctnessScore}, "BUS_FACTOR_SCORE": ${adjustedScores.busFactorScore}, "RESPONSIVE_MAINTAINER_SCORE": ${adjustedScores.maintainerScore}, "LICENSE_SCORE": ${adjustedScores.licenseScore}, "PullRequest": ${adjustedScores.pullrequestScore}}`;
    //console.log(output);

    return output;
}

export { eval_single_file }