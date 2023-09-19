import * as dotenv from "dotenv";
import { calcRespMaintScore } from "./calcRespMaintScore";
//dotenv.config();

import axios from "axios";

const graphqlEndpoint = 'https://api.github.com/graphql';

async function getRespMaintScore(url: [string, string]) {
  try {
    const key = process.env.API_KEY;
    const owner = url[0];
    const name = url[1];

    let totalClosedIssues = 0;
    let totalTime = 0;

    const variables = {
      owner,
      name,
    };

    const query = `
    query {
      repository(owner: "${owner}", name: "${name}") {
        issues(states: CLOSED) {
          totalCount
          nodes {
            closedAt
            createdAt
          }
        }
      }
    }
  `;

  const result = await axios({
    url: graphqlEndpoint,
    method: 'post',
    headers: {
      Authorization: `Bearer ${key}`,
    },
    data: {
      query,
      variables,
    },
  });

  const closedIssues = result.data.data.repository.issues.nodes;
  totalClosedIssues = result.data.data.repository.issues.totalCount;

  for (const issue of closedIssues) {
    const closedDate = new Date(issue.closedAt);
    const createdDate = new Date(issue.createdAt);
    const timeDiff = closedDate.getTime() - createdDate.getTime();
    totalTime += timeDiff;
  }

  // Calculate the responsiveMaintainer score.
  const responsiveMaintainerScore = calcRespMaintScore(totalClosedIssues, totalTime);

  return responsiveMaintainerScore;

} catch (error) {
    console.error('Error fetching total issues:', error);
    return 0; 
  }
}

export { getRespMaintScore }; 
