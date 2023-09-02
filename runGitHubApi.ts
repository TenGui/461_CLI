import axios from 'axios';

const accessToken = 'GITHUB_TOKEN';

// Define the API URL for the repository
const apiUrl = ` https://github.com/openai/chatgpt-example`;

// Define headers with authorization using your access token
const headers = {
  Authorization: `token ${accessToken}`,
};

// Use Axios to make a GET request to the GitHub API
axios
  .get(apiUrl, { headers })
  .then((response) => {
    if (response.status !== 200) {
      throw new Error(`GitHub API request failed with status: ${response.status}`);
    }

    const repoData = response.data;

    if (repoData && repoData.name) {
      const repoName: string = repoData.name;
      console.log(`Repository Name: ${repoName}`);
    } else {
      console.log('Repository name not found in the API response.');
    }
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });