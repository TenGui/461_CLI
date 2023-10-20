"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPRscore = void 0;
const path = require("path");
const fs = require("fs");
const rampUpUtils_1 = require("../rampUpMetric/rampUpUtils");
const { Octokit } = require("@octokit/rest");
async function getPRscore(url) {
    try {
        const dir = path.join(process.cwd(), `/rampup_repos/${url[0]}/${url[1]}`);
        const fileList = (await fs.readdirSync(dir, {
            recursive: true,
        }));
        const jsList = (0, rampUpUtils_1.getFileWithEnd)(".js", fileList);
        const linesJS = await (0, rampUpUtils_1.sumLines)(dir, jsList);
        fs.rmSync(dir, { recursive: true, force: true });
        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });
        let allPr = [];
        let prWithReview = [];
        let page = 1;
        let owner = url[0];
        let repo = url[1];
        while (true) {
            const response = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
                owner: owner,
                repo: repo,
                state: 'closed',
                per_page: 100,
                page: page
            });
            const pullRequests = response.data;
            if (pullRequests.length === 0) {
                break;
            }
            const reviewedPr = pullRequests.filter((pr) => pr.requested_reviewers.length > 0);
            allPr = allPr.concat(reviewedPr);
            page += 1;
        }
        console.log(allPr.length);
        return linesJS;
    }
    catch (err) {
        console.log(err);
        return 0;
    }
}
exports.getPRscore = getPRscore;
