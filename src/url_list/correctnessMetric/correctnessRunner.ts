import { 
  identifyLinkType, 
  getOwnerAndRepoFromGitHubUrl, 
  getNpmPackageInfoFromUrl,
} from "../../utils/distinguishLink";

import * as dotenv from "dotenv";
dotenv.config();

import { 
  fetchTotalIssues, 
  fetchClosedIssues, 
  fetchWeeklyDownloads,
  fetchAllTimeHighestDownloads,
  fetchTotalStarsAndForks,
  findBranchWithMostStarsAndForks,
} from "./correctnessGitHubFetcher";

import {
  getPackageNameFromNpmLink,
  getTotalDownloadsLastWeek,
  getHighestTotalDownloadsAcrossWeeks,
} from "./correctnessNpmFetcher";

async function main() {
  const key = process.env.API_KEY;
  //const url = "https://github.com/godotengine/godot";
  const url = "https://www.npmjs.com/package/lodash?activeTab=versions";
  let totalIssues = -1;
  let totalClosedIssues = -1;
  let currentWeeklyDownloads = -1;
  let allTimeHighestDownloads = -1;
  let totalStorks = -1;
  let maxStorks = -1;

  if (identifyLinkType(url) == 'GitHub Repository Link') {
    const { owner, repo } = getOwnerAndRepoFromGitHubUrl(url);

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
    const { owner, name } = getNpmPackageInfoFromUrl(url);
    
    
    
    
  }
}

main(); // Call the async function to execute the code
