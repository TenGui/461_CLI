"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLicenseScore = void 0;
async function getLicenseScore(RateLimiter, url) {
    try {
        const License = "LGPL-2.1";
        const _license = await RateLimiter.getGitHubInfo(url + "/license");
        if (_license == null) {
            const readme = await RateLimiter.getGitHubInfo(url + "/readme");
            const content = Buffer.from(readme.content, "base64").toString("utf-8");
            const license = content.split("License\n")[1];
            const regex = / (\S+)\s+license/i;
            const match = license.match(regex);
            if (match && match[1] == License) {
                return 1;
            }
            else
                return 0;
        }
        else {
            return _license.license.spdx_id == License ? 1 : 0;
        }
    }
    catch {
        return 0;
    }
}
exports.getLicenseScore = getLicenseScore;
