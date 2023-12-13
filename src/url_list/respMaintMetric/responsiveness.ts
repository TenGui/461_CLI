import { Octokit } from '@octokit/rest';
import { subMonths, isAfter, differenceInDays } from "date-fns";

export class Responsiveness {

    async getCompletedIssues(url: [string, string]) {
        /*
        args: string (GitHub Repository URL)
        return: const (Filtered Octokit Response, Data on closed issues)

        Description: This function uses the javascript library 'octokit' to call the GitHub
        API to determine the issues in repository on github if the user provides a valid 
        github repository URL.
        */ 

        const owner = url[0]; //Obtain owner of repo
        const repoName = url[1]; //Obtain repo name
        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN //Insert token
        });
        
        try {
            console.log("here 0");
            const completedIssues = await octokit.request('GET /repos/{owner}/{repo}/issues', {
                owner: owner, //Test values: 'octokit',
                repo: repoName, //Test values: 'rest.js'
                state: 'closed', //Find closed issues
                per_page: 100,
            });
            console.log("here 1");
            if (completedIssues.status === 200) {
                const threeMonthsAgo = subMonths(new Date(), 3);

                //Filter for issues that have been completed within 3 months
                const completedWithin3Months = completedIssues.data.filter((issue) => (
                    issue.state === 'closed' && //Filter for closed issues
                    issue.state_reason === 'completed' && //Filter for issues that have been marked as completed
                    issue.closed_at !== null &&
                    isAfter(new Date(issue.closed_at), threeMonthsAgo) === true //Filter for issues that have been closed within the 3 months
                ));
                    
                // this.logger.info(completedWithin3Months)
                // this.logger.info(new Date('2023-08-30T21:31:09Z'));
                // this.logger.info(threeMonthsAgo);
                // this.logger.info(isAfter(new Date('2023-08-30T21:31:09Z'), threeMonthsAgo));

                return completedWithin3Months; //Return the data that contiains 
            } else {
                throw new Error(`Failed to fetch completed issues. Status code: ${completedIssues.status}`);
            }
        } catch (error:any) {
            console.error("Error in Responseiveness, GetcompleteIssue: ", error);
            throw error;
        }
    }
    
    async calculateScore(completedWithin3Months: any, maxBenchmarkDays: number) {
        /*
        args: any (Data contains issues that have been completed within 3 months)
        return: const (Metric score between [0, 1])

        Description: This function parses through the issues data to determine
        the average time a issue is open that have been closed within the past
        3 months. It then converts the time to a metric score.
        */ 

        let numIssuesClosed = 0; //Number of issues closed within 3 months
        var totalDaysOpen = 0; //Total time open for issues
        var score = 0;
    
        for (const issue of completedWithin3Months) {
            if (issue.closed_at !== null) {
                const create_date = new Date(issue.created_at);
                const closed_date = new Date(issue.closed_at);
                totalDaysOpen += differenceInDays(closed_date, create_date);
                numIssuesClosed++;
            }
        }

        if(numIssuesClosed === 0 ) {
            score = 0;
        }
        else {
            const averageDaysOpen = totalDaysOpen / numIssuesClosed;        
        
            // this.logger.info(`Average time to close an issue: ${averageDaysOpen} days, number of issues closed: ${numIssuesClosed}`);
        
            score = Math.max(0, (maxBenchmarkDays - averageDaysOpen) / maxBenchmarkDays);
        }
    
        return score;
    }
    
    async numCollaborators(url: [string, string]) {
        /*
        args: none
        return: const (Metric score between [0, 1])

        Description: This function calls the necessary functions to
        calculate the metric score
        */ 
        const maxBenchmarkDays = 30;

        try {
            let data = await this.getCompletedIssues(url);
            const score = await this.calculateScore(data, maxBenchmarkDays);
            return score;
        } catch (error:any) {
            console.error("numCollaborators: Error: " + error.message);
            return -1; // Return a default score or handle the error as needed
        }
    }
}

/*
used in main to return an integer representing the score from a string representing the url
*/
// export async function getResponsiveness(url: string) {
//     let test = new Responsiveness(url);
//     return await test.numCollaborators();
// }


/* Example 

(async () => {
    let test = new Responsiveness('https://github.com/clin8328/ECE461-Team4'); //https://github.com/clin8328/ECE461-Team4 https://github.com/davisjam/safe-regex
    const score = await test.numCollaborators();
    this.logger.info(`Score: ${score}`);
})();

*/

// (async () => {
//     let test = new Responsiveness('https://github.com/davisjam/safe-regex'); //https://github.com/clin8328/ECE461-Team4 https://github.com/davisjam/safe-regex
//     const score = await test.numCollaborators();
//     this.logger.info(`Score: ${score}`);
// })();
