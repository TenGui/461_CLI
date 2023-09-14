import { 
  identifyLinkType,
  getOwnerAndRepoFromGitHubUrl,
 } from "../../utils/distinguishLink";

import * as dotenv from "dotenv";
dotenv.config();

import {
  fetchTotalOpenIssues,
} from "./correctnessGitHubFetcher";

const key = process.env.API_KEY;
const url = "https://github.com/godotengine/godot";
let totalOpenIssues = -1;

if(identifyLinkType(url) == 'GitHub Repository Link') {
    const { owner, repo } = getOwnerAndRepoFromGitHubUrl(url);
    
    fetchTotalOpenIssues(owner as string, repo as string, key as string)
    .then((data) => {
        totalOpenIssues = data;
        console.log(`Total open issues: ${totalOpenIssues}`);
    });
}