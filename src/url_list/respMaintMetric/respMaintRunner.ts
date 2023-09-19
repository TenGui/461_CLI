import { calcRespMaintScore } from "./calcRespMaintScore";
import { identifyLinkType } from "./distinguishLink";
import { getOwnerAndRepoFromUrl, fetchOpenIssues, fetchClosedIssues, fetchRepoStats } from "./GitHubFetcher";
import { extractPackageNameFromNpmLink, getPackageInfo } from "./NpmFetcher";

const link = "https://www.npmjs.com/package/@npmcli/metavuln-calculator";
const linkType = identifyLinkType(link);

if (linkType.localeCompare("GitHub Repository Link") === 0) {
  const githubRepoUrl = 'https://github.com/oven-sh/bun'; // Replace with your GitHub repository URL
  const { owner, repo } = getOwnerAndRepoFromUrl(githubRepoUrl);

  console.log(`Owner: ${owner}`);
  console.log(`Repo: ${repo}`);

  // GitHub API REST endpoints
  const openIssuesUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=open`;
  const closedIssuesUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=closed`;
  const repoInfoUrl = `https://api.github.com/repos/${owner}/${repo}`;

  // Set up the request headers with your GitHub Personal Access Token
  const headers = {
    Authorization: `Bearer ${process.env.API_KEY}`,
    'Content-Type': 'application/json',
  };

  // Call the functions to fetch open and closed issues, stars, forks, etc.
  Promise.all([
    fetchOpenIssues(openIssuesUrl, headers),
    fetchClosedIssues(closedIssuesUrl, headers),
    fetchRepoStats(repoInfoUrl, headers),
  ])
    .then(([openIssues, closedIssues, { stars, forks }]) => {
      const issuesSolved = closedIssues.length; // Use closed issues count as "issuesSolved"
      const firstClosedIssue = new Date(closedIssues[closedIssues.length - 1].closed_at);
      const lastClosedIssue = new Date(closedIssues[0].closed_at);

      const timeDiffInMs = lastClosedIssue.getTime() - firstClosedIssue.getTime();
      const timeDiffInDays = timeDiffInMs / (1000 * 3600 * 24);

      const respMaintScore = calcRespMaintScore(issuesSolved, timeDiffInDays);
      console.log(`Responsive Maintainer Score: ${respMaintScore}`);
    })
    .catch(error => {
      console.error('Error:', error);
    });
} else if (linkType.localeCompare("npm Package Link") === 0) {
  const npmName = extractPackageNameFromNpmLink(link);
  console.log(`Package Name: ${npmName}`);

  // Call the function to fetch npm package info
  getPackageInfo(npmName)
    .then(({ totalDownloads, weeklyDownloads }) => {
      console.log(`Total Downloads: ${totalDownloads}`);
      console.log(`Weekly Downloads: ${weeklyDownloads}`);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}