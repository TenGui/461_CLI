"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScore = exports.getBusFactorScore = void 0;
async function getBusFactorScore(RateLimiter, url) {
    try {
        let keycontributor = [];
        const contributorResponse = await RateLimiter.getGitHubInfo(url + "/contributors");
        let totalcontribution = 0;
        for (let contributor of contributorResponse) {
            totalcontribution += contributor.contributions;
        }
        let currentcontribution = 0;
        for (let contributor of contributorResponse) {
            if (currentcontribution >= Math.floor(totalcontribution / 2))
                break;
            currentcontribution += contributor.contributions;
            keycontributor.push(contributor.login);
        }
        const busFactor = getScore(keycontributor.length);
        return busFactor;
    }
    catch {
        return 0;
    }
}
exports.getBusFactorScore = getBusFactorScore;
function getScore(keycontributor) {
    const e = 2.71828;
    if (keycontributor == 0)
        return 0;
    let busFactorScore = (1 - e ** (0.3 * (-keycontributor + 1))) / (1 + e ** (-keycontributor + 1));
    return Number(busFactorScore.toFixed(5));
}
exports.getScore = getScore;
