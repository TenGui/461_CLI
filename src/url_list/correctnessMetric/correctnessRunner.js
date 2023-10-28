"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateWeeksDifference = exports.getCorrectness = exports.calcCorrectnessScore = void 0;
const dotenv = require("dotenv");
dotenv.config();
const axios_1 = require("axios");
const graphqlEndpoint = "https://api.github.com/graphql";
async function getCorrectness(url) {
    try {
        const key = process.env.GITHUB_TOKEN;
        const owner = url[0];
        const name = url[1];
        let totalOpenIssues = 0;
        let totalClosedIssues = 0;
        let lastReleaseWeeklyDownloads = 0;
        let maxReleaseWeeklyDownloads = 0;
        const variables = {
            owner,
            name,
        };
        const query = `
      query ($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          openIssues: issues(states: OPEN) {
            totalCount
          }
          closedIssues: issues(states: CLOSED) {
            totalCount
          }
          releases(first: 100, orderBy: { field: CREATED_AT, direction: DESC }) {
            totalCount
            nodes {
              releaseAssets(first: 20) {
                nodes {
                  name
                  downloadCount
                  createdAt
                }
              }
            }
          }
        }
      }
    `;
        const result = await (0, axios_1.default)({
            url: graphqlEndpoint,
            method: "post",
            headers: {
                Authorization: `Bearer ${key}`,
            },
            data: {
                query,
                variables,
            },
        });
        totalOpenIssues = result.data.data.repository.openIssues.totalCount;
        totalClosedIssues = result.data.data.repository.closedIssues.totalCount;
        if (totalOpenIssues + totalClosedIssues == 0) {
            totalClosedIssues = 0;
            totalOpenIssues = 1;
        }
        const releases = result.data.data.repository.releases.nodes;
        const releasesCount = releases.length;
        let recent = -1;
        for (let i = 0; i < releasesCount; i++) {
            if (releases[i] === undefined ||
                releases[i].releaseAssets === undefined ||
                releases[i].releaseAssets.nodes[0] === undefined)
                continue;
            recent = i;
            break;
        }
        if (recent == -1) {
            return totalClosedIssues / (totalClosedIssues + totalOpenIssues);
        }
        let recentRelease = releases[recent].releaseAssets.nodes[0].createdAt;
        let weeksDifference = calculateWeeksDifference(recentRelease);
        let recentDownloads = releases[recent].releaseAssets.nodes[0].downloadCount;
        lastReleaseWeeklyDownloads = recentDownloads / weeksDifference;
        maxReleaseWeeklyDownloads = lastReleaseWeeklyDownloads;
        for (let i = recent + 1; i < releasesCount; i++) {
            if (releases[i] === undefined ||
                releases[i].releaseAssets.nodes[0] === undefined)
                continue;
            recentRelease = releases[i].releaseAssets.nodes[0].createdAt;
            weeksDifference = calculateWeeksDifference(recentRelease);
            recentDownloads = releases[i].releaseAssets.nodes[0].downloadCount;
            let CurrWeeklyDownloads = recentDownloads / weeksDifference;
            if (CurrWeeklyDownloads > maxReleaseWeeklyDownloads)
                maxReleaseWeeklyDownloads = CurrWeeklyDownloads;
        }
        let correctness = calcCorrectnessScore(totalClosedIssues, totalOpenIssues, maxReleaseWeeklyDownloads, lastReleaseWeeklyDownloads);
        return correctness;
    }
    catch (error) {
        return 0;
    }
}
exports.getCorrectness = getCorrectness;
async function calcCorrectnessScore(totalClosedIssues, totalOpenIssues, maxReleaseWeeklyDownloads, lastReleaseWeeklyDownloads) {
    const correctness = 0.5 * (totalClosedIssues / (totalOpenIssues + totalClosedIssues)) +
        0.5 * (lastReleaseWeeklyDownloads / maxReleaseWeeklyDownloads);
    return correctness;
}
exports.calcCorrectnessScore = calcCorrectnessScore;
function calculateWeeksDifference(timestamp) {
    const startTime = new Date(timestamp);
    if (isNaN(startTime.getTime())) {
        return -1;
    }
    const currentTime = new Date();
    const timeDifferenceMs = currentTime.getTime() - startTime.getTime();
    const weeksDifference = timeDifferenceMs / (1000 * 60 * 60 * 24 * 7);
    return weeksDifference;
}
exports.calculateWeeksDifference = calculateWeeksDifference;
