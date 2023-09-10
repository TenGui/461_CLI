const rateLimit = require("axios-rate-limit");
const axios = require("axios");

class RateLimiter {
  private token: string;
  private githubApi: any;
  private github_api: string;

  constructor() {
    this.githubApi = rateLimit(axios.create(), {
      maxRequests: 1,
      perMilliseconds: 3750,
    });
    this.token = process.env.GITHUB_TOKEN || "";
    this.github_api = process.env.GITHUB_API || "https://api.github.com";
  }

  async getGithubRepoInfo(username: string, repoName: string) {
    try {
      if (this.token == "") {
        console.error("No env variable 'GITHUB_TOKEN' provided");
        return null;
      }
      const response = await this.githubApi.get(
        `${this.github_api}/repos/${username}/${repoName}`,
        {
          headers: {
            Authorization: `token ${this.token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("GitHub API request failed:", error);
      return null;
    }
  }
}
export { RateLimiter };
