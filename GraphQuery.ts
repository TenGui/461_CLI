import * as dotenv from 'dotenv';
dotenv.config();

import axios from 'axios';

// Define the GitHub owner and repository name variables
const owner = 'TenGui'; // Replace with your owner variable
const repo = '461_CLI'; // Replace with your repo variable

// Define the GraphQL query with the owner and repo variables
const graphqlQuery = `
query {
    repository(owner: "${owner}", name: "${repo}") {
      forkCount
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

// Create the request options
const requestOptions = {
  method: 'POST',
  url: apiUrl,
  headers,
  data: JSON.stringify({ query: graphqlQuery }),
};

// Send the GraphQL query using Axios
axios(requestOptions)
  .then(response => {
    const data = response.data;
    const forkCount = data.data.repository.forkCount;

    if (forkCount !== undefined) {
      console.log(`Fork count for ${owner}/${repo}: ${forkCount}`);
    } else {
      console.error('Unable to retrieve fork count.');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
