import * as dotenv from "dotenv";
dotenv.config();

import { 
  identifyLinkType, 
  getGitHubRepoInfo, 
  npmToGitHub,
  getPackageNameFromNpmLink,
} from "../../utils/distinguishLink";

import { 
  fetchTotalIssues, 
  fetchClosedIssues, 
  fetchWeeklyDownloads,
  fetchAllTimeHighestDownloads,
  fetchTotalStarsAndForks,
  findBranchWithMostStarsAndForks,
} from "./correctnessGitHubFetcher";

import {
  getMaxWeeklyDownloads,
  getWeeklyDownloadCount
} from "./correctnessNpmFetcher";
import { get } from "http";

async function main() {
  const key = process.env.API_KEY;
  const url = "https://github.com/godotengine/godot";
  //const url = "https://www.npmjs.com/package/lodash?activeTab=versions";
  let totalIssues = -1;
  let totalClosedIssues = -1;
  let currentWeeklyDownloads = -1;
  let allTimeHighestDownloads = -1;
  let totalStorks = -1;
  let maxStorks = -1;

  if (identifyLinkType(url) == 'GitHub Repository Link') {
    const repoInfo = getGitHubRepoInfo(url);
    const owner = repoInfo?.owner;
    const repo = repoInfo?.repoName;

    // Use async/await to wait for the Promise to resolve
    try {
      totalIssues = await fetchTotalIssues(owner as string, repo as string, key as string);
      console.log(totalIssues);

      totalClosedIssues = await fetchClosedIssues(owner as string, repo as string, key as string);
      console.log(totalClosedIssues);

      currentWeeklyDownloads = await fetchWeeklyDownloads(owner as string, repo as string, key as string);
      console.log(currentWeeklyDownloads);

      allTimeHighestDownloads = await fetchAllTimeHighestDownloads(owner as string, repo as string, key as string);
      console.log(allTimeHighestDownloads);

      totalStorks = await fetchTotalStarsAndForks(owner as string, repo as string, key as string);
      console.log(totalStorks);

      maxStorks = await findBranchWithMostStarsAndForks(owner as string, repo as string, key as string);
      console.log(maxStorks);

      let correctnessScore = 0.4 * (totalClosedIssues / totalIssues) + 0.4 * (currentWeeklyDownloads / allTimeHighestDownloads) + 0.2 * (totalStorks / maxStorks);
      console.log(correctnessScore);

    } catch (error) {
      console.error('Error:', error);
    }
  } 
  else if(identifyLinkType(url) == "npm Package Link") {
    const npmName = getPackageNameFromNpmLink(url);
    const githubUrl = await npmToGitHub(npmName as string);
    const repoStats = getGitHubRepoInfo(githubUrl as string);
    const owner = repoStats?.owner;
    const repo = repoStats?.repoName;

    try {
      totalIssues = await fetchTotalIssues(owner as string, repo as string, key as string);
      console.log(totalIssues);

      totalClosedIssues = await fetchClosedIssues(owner as string, repo as string, key as string);
      console.log(totalClosedIssues);

      currentWeeklyDownloads = await getWeeklyDownloadCount(npmName as string, "2020-01-01", "2020-01-07");
      console.log(currentWeeklyDownloads);

      allTimeHighestDownloads = await getMaxWeeklyDownloads(npmName as string, 100);
      console.log(allTimeHighestDownloads);

      totalStorks = await fetchTotalStarsAndForks(owner as string, repo as string, key as string);
      console.log(totalStorks);

      maxStorks = await findBranchWithMostStarsAndForks(owner as string, repo as string, key as string);
      console.log(maxStorks);

      let correctnessScore = 0.4 * (totalClosedIssues / totalIssues) + 0.4 * (currentWeeklyDownloads / allTimeHighestDownloads) + 0.2 * (totalStorks / maxStorks);
      console.log(correctnessScore);

    } catch (error) {
      console.error('Error:', error);
    }
  }
}



main(); // Call the async function to execute the code
