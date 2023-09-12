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
const fetchOpenIssues = async () => {
  try {
    const response = await axios.get(openIssuesUrl, { headers });
    const openIssues = response.data.length;

    console.log(`Total number of open issues for ${owner}/${repo}: ${openIssues}`);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Function to fetch the total number of closed (resolved) issues
const fetchClosedIssues = async () => {
  try {
    const response = await axios.get(closedIssuesUrl, { headers });
    const closedIssues = response.data.length;

    console.log(`Total number of closed (resolved) issues for ${owner}/${repo}: ${closedIssues}`);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Function to fetch the number of stars and forks for the repository
const fetchRepoStats = async () => {
  try {
    const response = await axios.get(repoInfoUrl, { headers });
    const repoInfo = response.data;

    if (repoInfo) {
      const stars = repoInfo.stargazers_count;
      const forks = repoInfo.forks_count;

      console.log(`Stars: ${stars}`);
      console.log(`Forks: ${forks}`);
    } else {
      console.error('Unable to retrieve repository information.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Call the functions to fetch open and closed issues, stars, and forks
fetchOpenIssues();
fetchClosedIssues();
fetchRepoStats();
