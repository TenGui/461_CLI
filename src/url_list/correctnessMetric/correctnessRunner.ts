import * as dotenv from "dotenv";
dotenv.config();

import axios from "axios";

const graphqlEndpoint = 'https://api.github.com/graphql';

async function getCorrectness(
  url:string, 
  RateLimiter: any
  ): Promise<number> {
  const key = process.env.API_KEY;
  let totalIssues = -1;
  let totalClosedIssues = -1;
  let currentWeeklyDownloads = -1;
  let allTimeHighestDownloads = -1;
  let totalStorks = -1;
  let maxStorks = -1;

  const repoInfo = getGitHubRepoInfo(url);
  const owner = repoInfo?.owner;
  const name = repoInfo?.name;

  const variables = {
    owner,
    name,
  };

  const query = `
  query($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      openIssues: issues(states: OPEN) {
        totalCount
    }
    closedIssues: issues(states: CLOSED) {
      totalCount
    }
  }
}
`;

  axios({
    url: graphqlEndpoint,
    method: 'post',
    headers: {
      Authorization: `Bearer ${key}`,
    },
    data: {
      query,
      variables,
    },
    })
    .then((result) => {
      console.log(`total open issues: ${result.data.data.repository.openIssues.totalCount}`);
      console.log(`total closed issues ${result.data.data.repository.closedIssues.totalCount}`);
    });
 
    const releaseResponse = await RateLimiter.getGitHubInfo(
      url + "/releases"
    );
    return 0;
}

export { getCorrectness };

function getGitHubRepoInfo(gitHubLink: string): { owner: string; name: string } | null {
  const regex = /github\.com\/([^/]+)\/([^/]+)/;
  const match = gitHubLink.match(regex);

  if (match && match.length === 3) {
    const owner = match[1];
    const name = match[2];
    return { owner, name };
  }

  return null;
}