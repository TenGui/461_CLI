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


// Define the GraphQL queries with the owner and repo variables
const collaboratorQuery = `
query {
  repository(owner: "${owner}", name: "${repo}") {
    collaborators(first: 100) {
      edges {
        node {
          login
        }
      }
    }
  }
}
`;

const commitQuery = (login:any) => `
query {
  user(login: "${login}") {
    contributionsCollection {
      contributionCalendar {
        totalContributions
      }
    }
  }
}
`;

// GitHub API GraphQL endpoint
const apiUrl = 'https://api.github.com/graphql';

// Set up the request headers with your GitHub Personal Access Token
const headers = {
  Authorization: `Bearer ${process.env.API_KEY}`,
  'Content-Type': 'application/json',
};

// Checking The Validity Of The API Key
axios.get(apiUrl, { headers })
  .then(response => {
    if (response.status === 200) {
      console.log('Personal Access Token is valid.');
    } else {
      console.error('Personal Access Token is not valid.');
    }
  })
  .catch(error => {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response Status Code:', error.response.status);
    }
  });

// Function to fetch the total number of commits per user
const fetchCommitsPerUser = async () => {
  try {
    const collaboratorResponse = await axios.post(apiUrl, { query: collaboratorQuery }, { headers });
    const collaborators = collaboratorResponse.data.data.repository.collaborators.edges;

    if (collaborators) {
      console.log(`Total number of commits per user for ${owner}/${repo}:`);
      for (const { node } of collaborators) {
        const login = node.login;
        const commitResponse = await axios.post(apiUrl, { query: commitQuery(login) }, { headers });
        const totalCommits = commitResponse.data.data.user.contributionsCollection.contributionCalendar.totalContributions;
        console.log(`${login}: ${totalCommits} commits`);
      }
    } else {
      console.error('Unable to retrieve the list of collaborators.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Call the function to fetch commits per user
fetchCommitsPerUser();
