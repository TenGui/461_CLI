import * as path from "path";
import * as fs from "fs";
import { getFileWithEnd, sumLines } from "../rampUpMetric/rampUpUtils";
import { pull } from "isomorphic-git";
const { Octokit } = require("@octokit/rest");

async function getPRscore(url: [string, string]): Promise<number> {
    try {
      const dir = path.join(process.cwd(), `/rampup_repos/${url[0]}/${url[1]}`);
      const fileList = (await fs.readdirSync(dir, {
        recursive: true,
      })) as string[];

      const jsList = getFileWithEnd(".js", fileList);

      const linesJS = await sumLines(dir, jsList);
      
      fs.rmSync(dir, { recursive: true, force: true }); //clean up dir
      
      const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN // Put your GitHub token here
      });

      let pr_with_review: any[] = [];
      let owner = url[0];
      let repo = url[1];

      for (let page = 1; page <= 10; page++) {
        const response = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
          owner: owner,
          repo: repo,
          state: 'closed',
          per_page: 100,
          page: page
        });
        const pullRequests = response.data;
        
        //Check if there are no PR and we will stop at 1000 pr's to fasten runtime and repositories with thousands of PR's
        if (pullRequests.length === 0) {
          break;
        }
      
        // Filter pull requests that have been reviewed by at least one person
        const reviewedPr = pullRequests.filter((pr: any) => pr.requested_reviewers.length > 0); // Specify the type of 'pr'
        pr_with_review = pr_with_review.concat(reviewedPr);
      }
      

      //NOTE(CHUHAN), FINISHED FINDING ALL PR'S WITH REVIEW, NOW CALCULATE A PR SCORE
      
      console.log(pr_with_review.length)
      return linesJS;
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

export { getPRscore };