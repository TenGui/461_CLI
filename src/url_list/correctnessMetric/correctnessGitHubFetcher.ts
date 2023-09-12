import * as dotenv from 'dotenv';
dotenv.config();

import axios, { AxiosResponse } from 'axios';

// Define the GitHub owner and repository name variables
export function getOwnerAndRepoFromUrl(url: string): { owner: string; repo: string } {
  const urlParts = url.split('/');
  if (urlParts.length >= 4 && urlParts[0] === 'https:' && urlParts[2] === 'github.com') {
    const owner = urlParts[3];
    const repo = urlParts[4];
    return { owner, repo };
  } else {
    throw new Error('Invalid GitHub repository URL');
  }
}

// Function to check if the repository has releases
export function checkReleases(releaseAssetsUrl: string, headers: any): Promise<boolean> {
  return axios.get(releaseAssetsUrl, { headers })
    .then((response: AxiosResponse) => {
      return response.data && response.data.assets && response.data.assets.length > 0;
    })
    .catch(error => {
      console.error('Error checking releases:', error);
      return false;
    });
}

// Function to fetch the weekly downloads for release assets
export function fetchWeeklyReleaseDownloads(releaseAssetsUrl: string, headers: any): Promise<number> {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // One week ago

  return axios.get(releaseAssetsUrl, { headers })
    .then((response: AxiosResponse) => {
      const release = response.data;
      if (release && release.assets) {
        let weeklyDownloads = 0;
        for (const asset of release.assets) {
          if (asset.created_at >= oneWeekAgo.toISOString()) {
            weeklyDownloads += asset.download_count || 0;
          }
        }
        return weeklyDownloads;
      } else {
        console.error('Unable to retrieve release assets.');
        return -1; // Return -1 to indicate an error
      }
    })
    .catch(error => {
      console.error('Error fetching weekly downloads:', error);
      return -1; // Return -1 to indicate an error
    });
}

// Function to fetch the total number of open issues
export function fetchOpenIssues(openIssuesUrl: string, headers: any): Promise<number> {
  return axios.get(openIssuesUrl, { headers })
    .then((response: AxiosResponse) => response.data.length)
    .catch(error => {
      console.error('Error fetching open issues:', error);
      return -1; // Return -1 to indicate an error
    });
}

// Function to fetch the total number of closed (resolved) issues
export function fetchClosedIssues(closedIssuesUrl: string, headers: any): Promise<number> {
  return axios.get(closedIssuesUrl, { headers })
    .then((response: AxiosResponse) => response.data.length)
    .catch(error => {
      console.error('Error fetching closed issues:', error);
      return -1; // Return -1 to indicate an error
    });
}

// Function to fetch the number of stars and forks for the repository
export function fetchRepoStats(repoInfoUrl: string, headers: any): Promise<{ stars: number; forks: number }> {
  return axios.get(repoInfoUrl, { headers })
    .then((response: AxiosResponse) => {
      const repoInfo = response.data;
      if (repoInfo) {
        const stars = repoInfo.stargazers_count;
        const forks = repoInfo.forks_count;
        return { stars, forks };
      } else {
        console.error('Unable to retrieve repository information.');
        return { stars: -1, forks: -1 }; // Return -1 for stars and forks to indicate an error
      }
    })
    .catch(error => {
      console.error('Error fetching repository stats:', error);
      return { stars: -1, forks: -1 }; // Return -1 for stars and forks to indicate an error
    });
}