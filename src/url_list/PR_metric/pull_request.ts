import * as path from "path";
import * as fs from "fs";
import { getFileWithEnd, sumLines } from "../rampUpMetric/rampUpUtils";
const { Octokit } = require("@octokit/rest");

async function getPRscore(url: [string, string]): Promise<number> {
  try {
    const dir = path.join(process.cwd(), `/rampup_repos/${url[0]}/${url[1]}`);
    const fileList = (await fs.readdirSync(dir, {
      recursive: true,
    })) as string[];

    const jsList = getFileWithEnd(".js", fileList);

    const linesJS = await sumLines(dir, jsList);
    
    //fs.rmSync(dir, { recursive: true, force: true }); //clean up dir
    
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN // Put your GitHub token here
    });

    let pr_with_review: any[] = [];
    let total_pr = 0;
    let owner = url[0];
    let repo = url[1];
    
    //We will only evaluate the first 1000 PR's to account for repositories with thousands of PR's
    for (let page = 0; page <= 10; page++) {
      const response = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
        owner: owner,
        repo: repo,
        state: 'closed',
        per_page: 100,
        page: page
      });
      const pullRequests = response.data;
      
      //Check if there are no PR
      if (pullRequests.length === 0) {
        break;
      }
    
      // Filter pull requests that have been reviewed by at least one person
      const reviewedPr = pullRequests.filter((pr: any) => pr.requested_reviewers.length > 0 && pr.merged_at != null);
      pr_with_review = pr_with_review.concat(reviewedPr);
      total_pr += pullRequests.length
    }
    
    return total_pr === 0 ? 0 : pr_with_review.length / total_pr;
  } catch (err) {
    console.log(err);
    return 0;
  }
}

export { getPRscore };