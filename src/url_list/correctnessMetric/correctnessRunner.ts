import { 
  getOwnerAndRepoFromUrl, 
  checkReleases, 
  fetchOpenIssues, 
  fetchClosedIssues, 
  fetchRepoStats, 
  fetchWeeklyReleaseDownloads,
} from "./correctnessGitHubFetcher";

import { identifyLinkType } from "./distinguishLink";

const linkType = identifyLinkType("https://www.npmjs.com/package/@npmcli/metavuln-calculator");

if(linkType.localeCompare("GitHub Repository Link") == 0) {

  const githubRepoUrl = 'https://github.com/oven-sh/bun'; // Replace with your GitHub repository URL
  const { owner, repo } = getOwnerAndRepoFromUrl(githubRepoUrl);

  console.log(`Owner: ${owner}`);
  console.log(`Repo: ${repo}`);

// GitHub API REST endpoints
  const openIssuesUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=open`;
  const closedIssuesUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=closed`;
  const repoInfoUrl = `https://api.github.com/repos/${owner}/${repo}`;
  const releaseAssetsUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;

// Set up the request headers with your GitHub Personal Access Token
  const headers = {
  Authorization: `Bearer ${process.env.API_KEY}`,
  'Content-Type': 'application/json',
  };

  // Call the functions to check for releases, fetch open and closed issues, stars, forks, and weekly release downloads
  Promise.all([
  checkReleases(releaseAssetsUrl, headers),
  fetchOpenIssues(openIssuesUrl, headers),
  fetchClosedIssues(closedIssuesUrl, headers),
  fetchRepoStats(repoInfoUrl, headers),
  fetchWeeklyReleaseDownloads(releaseAssetsUrl, headers),
  ])
  .then(([hasReleases, openIssuesCount, closedIssuesCount, { stars, forks }, weeklyDownloads]) => {
    const statsArray = [hasReleases, openIssuesCount, closedIssuesCount, stars, forks, weeklyDownloads];
    console.log('Stats Array:', statsArray);
  })
  .catch(error => {
    console.error('Error:', error);
  });
} else if(linkType.localeCompare("npm Package Link") == 0) {
  console.log("Hello");
}
