import axios from 'axios';

const graphqlEndpoint = 'https://api.github.com/graphql';

/**
 * Fetches the total number of issues for a GitHub repository.
 * @param owner The owner (username) of the GitHub repository.
 * @param name The name of the GitHub repository.
 * @param githubToken The GitHub API token for authentication.
 * @returns A Promise that resolves with the total number of issues.
 */
export function fetchTotalIssues(owner: string, name: string, githubToken: string): Promise<number> {
  const totalIssuesQuery = `
    query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        issues {
          totalCount
        }
      }
    }
  `;

  const variables = {
    owner,
    name,
  };

  return axios
    .post(
      graphqlEndpoint,
      {
        query: totalIssuesQuery,
        variables,
      },
      {
        headers: {
          Authorization: `Bearer ${githubToken}`,
        },
      }
    )
    .then((response) => {
      const data = response.data.data;
      if (data && data.repository && data.repository.issues) {
        return data.repository.issues.totalCount || 0;
      } else {
        console.error('GraphQL response did not contain the expected data structure:', response.data);
        return -1; // Return -1 to indicate an error
      }
    })
    .catch((error) => {
      console.error('Error fetching total issues:', error);
      return -1; // Return -1 to indicate an error
    });
}