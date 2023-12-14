import { Octokit } from '@octokit/rest';

export class Bus{

    async Bus_Factor(url: string): Promise<number> {
        let res: number = -1; // Initialize res with a default value in case of an error

        try {
            const octokit = new Octokit({
                auth: process.env.GITHUB_TOKEN // Put your GitHub token here
            });

            const urlParts = url.split('/');
            const _owner = urlParts[2]; // Obtain the owner of the repo
            const _repo = urlParts[3];// Obtain the repo name

            const response = await octokit.request('GET /repos/{owner}/{repo}/contributors', {
                owner: _owner,
                repo: _repo,
                per_page: 100,
            });

            if (response.status === 200) {
                let good = 0;
                let total = 0;

                for (const person of response.data) {
                    if (person.contributions >= 3) {
                        good += 1;
                    }
                    total += 1;
                }

                if (total === 0) {
                    res = 0;
                } else {
                    res = Math.round(good / total * 100000) / 100000;
                }
            }
        } catch (error:any) {
            console.error("busFactor: Error: " + error.message)
            return -1;
        }

        return res;
    }

}

