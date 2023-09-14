import { 
  identifyLinkType,
  getOwnerAndRepoFromGitHubUrl,
 } from "../../utils/distinguishLink";

import * as dotenv from "dotenv";
dotenv.config();

import {
  fetchRepoStatistics,
} from "./correctnessGitHubFetcher";

const key = process.env.API_KEY;
const url = "https://github.com/godotengine/godot";
let weeklyDownloads = -1;

if(identifyLinkType(url) == 'GitHub Repository Link') {
    const { owner, repo } = getOwnerAndRepoFromGitHubUrl(url);
    fetchRepoStatistics(owner as string, repo as string, key as string)
    .then((data) => {
      console.log('Repo Statistics:', data);
  });
}