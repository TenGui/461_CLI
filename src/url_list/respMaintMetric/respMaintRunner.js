"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRespMaintScore = void 0;
const dotenv = require("dotenv");
const calcRespMaintScore_1 = require("./calcRespMaintScore");
dotenv.config();
const axios_1 = require("axios");
const graphqlEndpoint = "https://api.github.com/graphql";
async function getRespMaintScore(url) {
    try {
        const key = process.env.GITHUB_TOKEN, owner = url[0], name = url[1];
        let totalClosedIssues = 0;
        let totalTime = 0;
        const variables = { owner, name, };
        const query = ` query { repository(owner: "${owner}", name: "${name}") { issues(last:50, states: CLOSED) { totalCount nodes { closedAt createdAt } } } } `;
        const result = await (0, axios_1.default)({ url: graphqlEndpoint, method: "post", headers: { Authorization: `Bearer ${key}`, }, data: { query, variables, }, });
        const closedIssues = result.data.data.repository.issues.nodes;
        totalClosedIssues = result.data.data.repository.issues.totalCount;
        for (const issue of closedIssues) {
            const closedDate = new Date(issue.closedAt), createdDate = new Date(issue.createdAt), timeDiff = closedDate.getTime() - createdDate.getTime();
            totalTime += timeDiff;
        }
        totalTime = totalTime / 1000 / 60 / 60 / 24;
        const responsiveMaintainerScore = (0, calcRespMaintScore_1.calcRespMaintScore)(totalClosedIssues, totalTime);
        return responsiveMaintainerScore;
    }
    catch (error) {
        return 0;
    }
}
exports.getRespMaintScore = getRespMaintScore;
