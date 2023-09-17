import axios from 'axios';

const graphqlEndpoint = 'https://api.github.com/graphql';

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

export function fetchClosedIssues(owner: string, name: string, githubToken: string): Promise<number> {
  const closedIssuesQuery = `
    query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        issues(states: CLOSED) {
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
        query: closedIssuesQuery,
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
      console.error('Error fetching closed issues:', error);
      return -1; // Return -1 to indicate an error
    });
}

export async function fetchWeeklyDownloads(owner: string, name: string, githubToken: string): Promise<number> {
  const releasesEndpoint = `https://api.github.com/repos/${owner}/${name}/releases`;

  try {
    // Make a GET request to fetch the latest release
    const response = await axios.get(releasesEndpoint, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
      params: {
        per_page: 1, // Limit to 1 release to get the latest
      },
    });

    const releases = response.data;
    if (Array.isArray(releases) && releases.length > 0) {
      const latestRelease = releases[0];
      const assets = latestRelease.assets || [];
      
      // Calculate the sum of download counts for all release assets
      const weeklyDownloads: number = assets.reduce(
        (total: number, asset: { download_count?: number }) =>
          total + (asset.download_count || 0),
        0
      );

      return weeklyDownloads;
    } else {
      console.error('No releases found for the repository.');
      return -1; // Return -1 to indicate an error
    }
  } catch (error) {
    console.error('Error fetching weekly downloads:', error);
    return -1; // Return -1 to indicate an error
  }
}

export async function fetchAllTimeHighestDownloads(owner: string, name: string, githubToken: string): Promise<number> {
  const releasesEndpoint = `https://api.github.com/repos/${owner}/${name}/releases`;

  try {
    // Make a GET request to fetch all releases
    const response = await axios.get(releasesEndpoint, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });

    const releases = response.data;
    if (Array.isArray(releases) && releases.length > 0) {
      let highestDownloads = 0;

      for (const release of releases) {
        const assets = release.assets || [];

        // Calculate the sum of download counts for all release assets
        const weeklyDownloads: number = assets.reduce(
          (total: number, asset: { download_count?: number }) =>
            total + (asset.download_count || 0),
          0
        );

        // Compare with the highest download count found so far
        if (weeklyDownloads > highestDownloads) {
          highestDownloads = weeklyDownloads;
        }
      }

      return highestDownloads;
    } else {
      console.error('No releases found for the repository.');
      return -1; // Return -1 to indicate an error
    }
  } catch (error) {
    console.error('Error fetching all-time highest downloads:', error);
    return -1; // Return -1 to indicate an error
  }
}

export async function fetchTotalStarsAndForks(owner: string, name: string, githubToken: string): Promise<number> {
  const repoEndpoint = `https://api.github.com/repos/${owner}/${name}`;

  try {
    // Make a GET request to fetch repository information
    const response = await axios.get(repoEndpoint, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    });

    const repoData = response.data;

    if (repoData) {
      return repoData.stargazers_count + repoData.forks_count;
    } else {
      console.error('No repository data found.');
      return -1; // Return -1 to indicate an error
    }
  } catch (error) {
    console.error('Error fetching stars and forks:', error);
    return -1; // Return -1 to indicate an error
  }
}

interface Branch {
  name: string;
}

async function fetchBranches(owner: string, repo: string, token: string): Promise<Branch[]> {
  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/branches`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
}

export async function findBranchWithMostStarsAndForks(owner: string, repo: string, token: string): Promise<number> {
  try {
    const branches = await fetchBranches(owner, repo, token);

    if (branches.length === 0) {
      throw new Error('No branches found for the repository.');
    }

    let maxStarsAndForks = 0;

    for (const branch of branches) {
      const branchStarsAndForks = await fetchTotalStarsAndForks(owner, repo, token);
      if (branchStarsAndForks > maxStarsAndForks) {
        maxStarsAndForks = branchStarsAndForks;
      }
    }

    return maxStarsAndForks;
  } catch (error) {
    console.error('Error finding branch with most stars and forks:', error);
    throw error;
  }
}
