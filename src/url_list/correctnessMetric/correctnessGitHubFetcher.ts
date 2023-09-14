import axios from 'axios';

// Define the GraphQL query
const repoStatisticsQuery = `
  query($owner: String!, $repo: String!) {
    repository(owner: $owner, name: $repo) {
      releases(last: 1) {
        edges {
          node {
            releaseAssets {
              nodes {
                downloadCount
                createdAt
              }
            }
          }
        }
      }
      stargazers {
        totalCount
      }
      forks {
        totalCount
      }
      issues(states: OPEN) {
        totalCount
      }
    }
  }
`;

export async function fetchRepoStatistics(owner: string, repo: string, githubToken: string): Promise<number[]> {
  try {
    // Set up the request headers with your GitHub Personal Access Token
    const headers = {
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    };

    // Define variables for the GraphQL query
    const variables = {
      owner,
      repo,
    };

    // Send the GraphQL request
    const response = await axios.post('https://api.github.com/graphql', {
      query: repoStatisticsQuery,
      variables,
    }, {
      headers,
    });

    // Handle the GraphQL response
    const data = response.data.data.repository;
    if (data) {
      // Calculate current weekly downloads
      const releaseAssets = data.releases.edges[0]?.node?.releaseAssets?.nodes || [];
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // One week ago
      const currentWeeklyDownloads = releaseAssets
        .filter((asset:any) => new Date(asset.createdAt) >= oneWeekAgo)
        .reduce((totalDownloads:any, asset:any) => totalDownloads + asset.downloadCount, 0);

      // Calculate other statistics
      const currentWeeklyStars = data.stargazers.totalCount;
      const currentForks = data.forks.totalCount;
      const currentOpenIssues = data.issues.totalCount;

      // You can add more logic to calculate other statistics as needed

      return [
        currentWeeklyDownloads,
        0, // All-time highest weekly downloads (need to implement this)
        currentWeeklyStars,
        0, // All-time highest weekly stars (need to implement this)
        currentForks,
        0, // All-time highest forks (need to implement this)
        currentOpenIssues,
        0, // All-time issues opened (need to implement this)
      ];
    } else {
      console.error('GraphQL response did not contain the expected data structure:', response.data);
      return [-1]; // Return -1 to indicate an error
    }
  } catch (error) {
    console.error('Error fetching repo statistics:', error);
    return [-1]; // Return -1 to indicate an error
  }
}