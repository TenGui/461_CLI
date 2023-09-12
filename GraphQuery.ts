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

// GitHub API REST endpoint for getting contributors
const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contributors`;

// Set up the request headers with your GitHub Personal Access Token
const headers = {
  Authorization: `Bearer ${process.env.API_KEY}`,
  'Content-Type': 'application/json',
};

// Function to fetch the total number of commits per user
const fetchCommitsPerUser = async () => {
  try {
    const response = await axios.get(apiUrl, { headers });
    const contributors = response.data;

    if (Array.isArray(contributors)) {
      console.log(`Total number of commits per user for ${owner}/${repo}:`);
      for (const contributor of contributors) {
        const login = contributor.login;
        const totalCommits = contributor.contributions;
        console.log(`${login}: ${totalCommits} commits`);
      }
    } else {
      console.error('Unable to retrieve the list of contributors.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Call the function to fetch commits per user
fetchCommitsPerUser();
