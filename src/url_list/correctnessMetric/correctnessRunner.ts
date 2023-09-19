import * as dotenv from "dotenv";
dotenv.config();

import axios from "axios";

const graphqlEndpoint = 'https://api.github.com/graphql';

async function getCorrectness(url: string) {
  try {
    const key = process.env.API_KEY;
    const repoInfo = getGitHubRepoInfo(url);
    const owner = repoInfo?.owner;
    const name = repoInfo?.name;

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
          stargazerCount
          forkCount
          releases(first: 50, orderBy: { field: CREATED_AT, direction: DESC }) {
            totalCount
            nodes {
              repository {
                stargazers {
                  totalCount
                }
                forks {
                  totalCount
                }
              }
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

    totalOpenIssues = result.data.data.repository.openIssues.totalCount;
    totalClosedIssues = result.data.data.repository.closedIssues.totalCount;

    const releases = result.data.data.repository.releases.nodes;

    // Calculate lastReleaseWeeklyDownloads and maxReleaseWeeklyDownloads here
    const releaseDate = releases[0].releaseAssets.nodes[0].createdAt;
    const elapsedTime = calculateWeeksDifference(releaseDate);
    const assetCount = releases[0].releaseAssets.nodes.length;
    let totalAssetDownloads = 0;

    for (let i = 0; i < assetCount; i++) {
      totalAssetDownloads += releases[0].releaseAssets.nodes[i].downloadCount;
    }

    lastReleaseWeeklyDownloads = totalAssetDownloads / elapsedTime;
    maxReleaseWeeklyDownloads = lastReleaseWeeklyDownloads;

    for (let i = 1; i < releases.length; i++) {
      if (releases[i].releaseAssets.nodes[0] === undefined) continue;

      const currReleaseDate = releases[i].releaseAssets.nodes[0].createdAt;
      const currElapsedTime = calculateWeeksDifference(currReleaseDate);
      const currAssetCount = releases[i].releaseAssets.nodes.length;
      let currTotalAssetDownloads = 0;

      for (let j = 0; j < currAssetCount; j++) {
        currTotalAssetDownloads += releases[i].releaseAssets.nodes[j].downloadCount;
      }

      if (currTotalAssetDownloads / currElapsedTime > maxReleaseWeeklyDownloads) {
        maxReleaseWeeklyDownloads = currTotalAssetDownloads / currElapsedTime;
      }
    }

    const correctness =
      0.5 * (totalClosedIssues / (totalOpenIssues + totalClosedIssues)) +
      0.5 * (lastReleaseWeeklyDownloads / maxReleaseWeeklyDownloads);

    return correctness;
  } catch (error) {
    console.error('Error fetching data:', error);
    // Handle the error or return a default value if necessary
    return 0;
  }
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

function calculateWeeksDifference(timestamp: string): number {
  // Convert the timestamp to a JavaScript Date object
  const startTime = new Date(timestamp);

  // Check if the provided timestamp is a valid date
  if (isNaN(startTime.getTime())) {
    console.error('Invalid timestamp format');
    return -1;
  }

  // Get the current time
  const currentTime = new Date();

  // Calculate the time difference in milliseconds
  const timeDifferenceMs = currentTime.getTime() - startTime.getTime();

  // Convert the time difference to weeks
  const weeksDifference = timeDifferenceMs / (1000 * 60 * 60 * 24 * 7);

  return weeksDifference;
}
