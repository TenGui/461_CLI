import axios from 'axios';

const owner = ''; // Replace with the GitHub username or organization name
const repo = ''; // Replace with the GitHub repository name

// Function to fetch issue data from GitHub API
async function fetchIssueData(): Promise<void> {
  try {
    // Fetch all issues from the GitHub repository
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/issues`);

    if (response.status === 200) {
      // Process the issue data
      const issues = response.data;
      const issuesOverTime: { [date: string]: number } = {};

      for (const issue of issues) {
        // Extract the creation date of each issue
        const createdDate = new Date(issue.created_at).toLocaleDateString();

        // Count the issues created on each date
        if (issuesOverTime[createdDate]) {
          issuesOverTime[createdDate]++;
        } else {
          issuesOverTime[createdDate] = 1;
        }
      }

      // Print the number of issues solved over time
      console.log('Number of issues solved over time:');
      for (const date in issuesOverTime) {
        console.log(`${date}: ${issuesOverTime[date]}`);
      }
    } else {
      console.error('Failed');
    }
  } catch (error) {
    console.error('Error', error);
  }
}

function calculateLogisticCurve(issuesSolved: number, time: number): number {
    const exponent = -0.5 * ((issuesSolved / time) - 8);
    const curveValue = 1 / (1 + Math.exp(exponent));
    return curveValue;
  }

  async function main() {
    try {
      const issuesOverTime = await fetchIssueData();
  
      const issuesSolved = 30; // Replace with the actual number of issues solved
      const time = 10; // Replace with the specific point in time
  
      const curveValue = calculateLogisticCurve(issuesSolved, time);
  
      console.log(`Logistic Curve Value at Time ${time}: ${curveValue}`);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  main();