import * as dotenv from 'dotenv';
dotenv.config();
// GITHUB TOKEN = process.env.API_KEY

const endpoint = "https://api.github.com/graphql";

// Creating The Query
const query = `
query {
    user(login: "davidasousa") {
        bio
    }
}
`;

const headers = {
  'Authorization': `Bearer ${process.env.API_KEY}`,
  'Content-Type': 'application/json',
};

const options = {
  method: 'POST',
  headers,
  body: JSON.stringify({ query }),
};

fetch(endpoint, options)
  .then(response => response.text()) // Get the raw response text
  .then(data => {
    console.log('Raw Response:', data); // Log the raw response
    try {
      const jsonData = JSON.parse(data);
      if (jsonData.errors) {
        console.error('GraphQL Error:', jsonData.errors);
      } else {
        const bio = jsonData.data.user.bio;
        console.log('Bio:', bio);
      }
    } catch (error) {
      console.error('JSON Parsing Error:', error);
    }
  })
  .catch(error => console.error('Fetch Error:', error));