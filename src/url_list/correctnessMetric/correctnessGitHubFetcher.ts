import axios from 'axios';

export async function fetchTotalOpenIssues(owner: string, repo: string, githubToken: string): Promise<number> {
  try {
    // Set up the request headers with the provided GitHub API key
    const headers = {
      Authorization: `Bearer ${githubToken}`,
      'Content-Type': 'application/json',
    };

    // Define the GitHub API endpoint for open issues
    const openIssuesUrl = `https://api.github.com/repos/${owner}/${repo}`;

    // Send the GET request to fetch repository details
    const response = await axios.get(openIssuesUrl, { headers });

    // Extract the total count of open issues from the response
    const totalOpenIssues = response.data.open_issues_count || 0;

    return totalOpenIssues;
  } catch (error) {
    console.error('Error fetching total open issues:', error);
    return -1; // Return -1 to indicate an error
  }
}
