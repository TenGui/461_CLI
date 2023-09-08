const rateLimit = require('axios-rate-limit');
const axios = require('axios');

class RateLimiter {
    private token: string;
    private githubApi: any;

    constructor() {
        this.githubApi = rateLimit(axios.create(), { maxRequests: 1, perMilliseconds: 3750 });
        this.token = 'your_token_here';
    }

    async getGithubRepoInfo(username: string, repoName: string){
        console.log("Start time: " + Date.now());
        try {
            const response = await this.githubApi.get(`https://api.github.com/repos/${username}/${repoName}`, {
                headers: {
                    Authorization: `token ${this.token}`,
                },
            });
        console.log(`GitHub API Response: ${response.status}`);
        return response.data;
        } 
        catch (error) {
            console.error('GitHub API request failed:', error);
            return null;
        }
    }
}
const limiter = new RateLimiter();
limiter.getGithubRepoInfo('ShaoNingHuang', '461_CLI').then((data) => {
    console.log(data.license);
    console.log("First call end time: " + Date.now());
});
limiter.getGithubRepoInfo('ShaoNingHuang', '461_CLI').then((data) => {
    console.log(data.license);
    console.log("Second call end time: " + Date.now());
});
limiter.getGithubRepoInfo('ShaoNingHuang', '461_CLI').then((data) => {
    console.log(data.license);
    console.log("Third call end time: " + Date.now());
});

export { RateLimiter }
