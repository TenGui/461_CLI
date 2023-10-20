"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eval_file = void 0;
const apiRateLimit_1 = require("../utils/apiRateLimit");
const utils_1 = require("../utils/utils");
const LicenseRunner = require("./licenseMetric/licenseRunner");
const BusFactorRunner = require("./busFactorMetric/busFactorRunner");
const RampUpRunner = require("./rampUpMetric/rampUpRunner");
const RespMaintRunner = require("./respMaintMetric/respMaintRunner");
const CorrectnessRunner = require("./correctnessMetric/correctnessRunner");
const PR_Runner = require("./PR_metric/pull_request");
async function eval_file(filepath = "URL_FILE_PATH") {
    const url_list = (0, utils_1.get_urls)(filepath);
    var finished = 0;
    url_list.forEach(async (urlstr) => {
        let url = ["", ""];
        if (urlstr.startsWith("https://www.npmjs.com")) {
            url = await (0, utils_1.GetDetailsFromNPM)(urlstr);
        }
        else {
            url = (0, utils_1.parseFromGitLink)(urlstr);
        }
        const limiter = new apiRateLimit_1.RateLimiter();
        const licenseScore = await LicenseRunner.getLicenseScore(limiter, `/repos/${url[0]}/${url[1]}`);
        const rampUpScore = await RampUpRunner.getRampUpScore(url);
        const busFactorScore = await BusFactorRunner.getBusFactorScore(limiter, `/repos/${url[0]}/${url[1]}`);
        const maintainerScore = await RespMaintRunner.getRespMaintScore(url);
        const correctnessScore = await CorrectnessRunner.getCorrectness(url);
        const pull_request_score = await PR_Runner.getPRscore(url);
        const multipliers = {
            license: 0,
            rampUp: 0.15,
            busFactor: 0.2,
            maintainer: 0.2,
            correctness: 0.4,
        };
        const adjustedScores = {
            licenseScore: licenseScore,
            rampUpScore: rampUpScore,
            busFactorScore: busFactorScore,
            maintainerScore: maintainerScore,
            correctnessScore: correctnessScore,
        };
        Object.entries(adjustedScores).forEach(([key, score]) => {
            adjustedScores[key] =
                Math.round((score + Number.EPSILON) * 100000) / 100000;
        });
        const overallScore = Math.round((multipliers.license * licenseScore +
            multipliers.rampUp * rampUpScore +
            multipliers.busFactor * busFactorScore +
            multipliers.maintainer * maintainerScore +
            multipliers.correctness * correctnessScore +
            Number.EPSILON) *
            100000) / 100000;
        console.log(`{"URL": "${urlstr}", "NET_SCORE": ${overallScore}, "RAMP_UP_SCORE": ${adjustedScores.rampUpScore}, "CORRECTNESS_SCORE": ${adjustedScores.correctnessScore}, "BUS_FACTOR_SCORE": ${adjustedScores.busFactorScore}, "RESPONSIVE_MAINTAINER_SCORE": ${adjustedScores.maintainerScore}, "LICENSE_SCORE": ${adjustedScores.licenseScore}}`);
        finished += 1;
    });
    while (finished < url_list.length) {
        await new Promise((resolve) => setTimeout(resolve, 400));
    }
    process.exit(0);
}
exports.eval_file = eval_file;
