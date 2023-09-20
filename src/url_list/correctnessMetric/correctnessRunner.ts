import * as dotenv from "dotenv";
dotenv.config();

import axios from "axios";

const graphqlEndpoint = "https://api.github.com/graphql";

async function getCorrectness(url: string) {
  try {
    const key = process.env.GITHUB_TOKEN;
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

    const result = await axios({
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

    const releases = result.data.data.repository.releases.nodes;
    const releasesCount = releases.length;

    // Find The First Release With Valid Assets
    let recent = -1;
    for (let i = 0; i < releasesCount; i++) {
      if (
        releases[i] === undefined ||
        releases[i].releaseAssets === undefined ||
        releases[i].releaseAssets.nodes[0] === undefined
      )
        continue;
      recent = i;
      break;
    }

    if (recent == -1) {
      // No Releases With Valid Assets
      //console.log("No Releases With Valid Assets");
      return totalClosedIssues / (totalClosedIssues + totalOpenIssues);
    }

    let recentRelease = releases[recent].releaseAssets.nodes[0].createdAt;
    let weeksDifference = calculateWeeksDifference(recentRelease);
    let recentDownloads = releases[recent].releaseAssets.nodes[0].downloadCount;
    lastReleaseWeeklyDownloads = recentDownloads / weeksDifference;
    maxReleaseWeeklyDownloads = lastReleaseWeeklyDownloads;

    // Find The Max Release With Valid Assets
    for (let i = recent + 1; i < releasesCount; i++) {
      if (
        releases[i] === undefined ||
        releases[i].releaseAssets.nodes[0] === undefined
      )
        continue;

      recentRelease = releases[i].releaseAssets.nodes[0].createdAt;
      weeksDifference = calculateWeeksDifference(recentRelease);
      recentDownloads = releases[i].releaseAssets.nodes[0].downloadCount;

      let CurrWeeklyDownloads = recentDownloads / weeksDifference;
      if (CurrWeeklyDownloads > maxReleaseWeeklyDownloads)
        maxReleaseWeeklyDownloads = CurrWeeklyDownloads;
    }

    let correctness = calcCorrectnessScore(
      totalClosedIssues,
      totalOpenIssues,
      maxReleaseWeeklyDownloads,
      lastReleaseWeeklyDownloads
    );
    return correctness;
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle the error or return a default value if necessary
    return 0;
  }
}

export async function calcCorrectnessScore(totalClosedIssues: number, totalOpenIssues: number, maxReleaseWeeklyDownloads: number, lastReleaseWeeklyDownloads: number): Promise<number> {
  const correctness =
    0.5 * (totalClosedIssues / (totalOpenIssues + totalClosedIssues)) +
    0.5 * (lastReleaseWeeklyDownloads / maxReleaseWeeklyDownloads);

  return correctness;
}

export { getCorrectness };

function getGitHubRepoInfo(
  gitHubLink: string
): { owner: string; name: string } | null {
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
    console.error("Invalid timestamp format");
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
