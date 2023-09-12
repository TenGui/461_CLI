import * as dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

// Define the GitHub owner and repository name variables
function getOwnerAndRepoFromUrl(url: string): { owner: string; repo: string } {
  const urlParts = url.split('/');
  if (urlParts.length >= 4 && urlParts[0] === 'https:' && urlParts[2] === 'github.com') {
    const owner = urlParts[3];
    const repo = urlParts[4];
    return { owner, repo };
  } else {
    throw new Error('Invalid GitHub repository URL');
  }
}

// Example usage:
const githubRepoUrl = 'https://github.com/TenGui/461_CLI'; // Replace with your GitHub repository URL
const { owner, repo } = getOwnerAndRepoFromUrl(githubRepoUrl);

console.log(`Owner: ${owner}`);
console.log(`Repo: ${repo}`);

// GitHub API REST endpoint for getting open issues
const openIssuesUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=open`;

// GitHub API REST endpoint for getting closed issues
const closedIssuesUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=closed`;

// GitHub API REST endpoint for getting repository information
const repoInfoUrl = `https://api.github.com/repos/${owner}/${repo}`;

// Set up the request headers with your GitHub Personal Access Token
const headers = {
  Authorization: `Bearer ${process.env.API_KEY}`,
  'Content-Type': 'application/json',
};

// Function to fetch the total number of open issues
const fetchOpenIssues = () => {
  return axios.get(openIssuesUrl, { headers })
    .then(response => response.data.length)
    .catch(error => {
      console.error('Error:', error);
      return -1; // Return -1 to indicate an error
    });
};

// Function to fetch the total number of closed (resolved) issues
const fetchClosedIssues = () => {
  return axios.get(closedIssuesUrl, { headers })
    .then(response => response.data.length)
    .catch(error => {
      console.error('Error:', error);
      return -1; // Return -1 to indicate an error
    });
};

// Function to fetch the number of stars and forks for the repository
const fetchRepoStats = () => {
  return axios.get(repoInfoUrl, { headers })
    .then(response => {
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
      console.error('Error:', error);
      return { stars: -1, forks: -1 }; // Return -1 for stars and forks to indicate an error
    });
};

// Call the functions to fetch open and closed issues, stars, and forks
Promise.all([fetchOpenIssues(), fetchClosedIssues(), fetchRepoStats()])
  .then(([openIssuesCount, closedIssuesCount, { stars, forks }]) => {
    console.log(`Total number of open issues for ${owner}/${repo}: ${openIssuesCount}`);
    console.log(`Total number of closed (resolved) issues for ${owner}/${repo}: ${closedIssuesCount}`);
    console.log(`Stars: ${stars}`);
    console.log(`Forks: ${forks}`);
  });
