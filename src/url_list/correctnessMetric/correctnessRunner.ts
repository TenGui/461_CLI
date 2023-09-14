import { 
  identifyLinkType,
  getOwnerAndRepoFromGitHubUrl,
 } from "../../utils/distinguishLink";

import * as dotenv from "dotenv";
dotenv.config();

import {
  fetchTotalIssues,
} from "./correctnessGitHubFetcher";

const key = process.env.API_KEY;
const url = "https://github.com/godotengine/godot";
let totalIssues = -1;

if(identifyLinkType(url) == 'GitHub Repository Link') {
    const { owner, repo } = getOwnerAndRepoFromGitHubUrl(url);
    
    fetchTotalIssues(owner as string, repo as string, key as string)
    .then((totalIssues) => {
      console.log(totalIssues);
  })
}