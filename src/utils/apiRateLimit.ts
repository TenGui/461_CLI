const rateLimit = require("axios-rate-limit");
const axios = require("axios");
import * as dotenv from "dotenv";


class RateLimiter {
  private token: string;
  private githubApi: any;
  private github_api: string;

  constructor() {
    dotenv.config();
    this.githubApi = rateLimit(axios.create(), {
      maxRequests: 1,
      perMilliseconds: 3750,
    });
    this.token = process.env.GITHUB_TOKEN || "";
    this.github_api = "https://api.github.com";
  }
  public Settoken(token: string) {
    this.token = token;
  }
  async getGitHubInfo(url: string, params = {}) {
    try {
      if (this.token == "") {
        console.error("No env variable 'GITHUB_TOKEN' provided");
        return null;
      }
      const response = await this.githubApi.get(`${this.github_api}${url}`, {
        headers: {
          Authorization: `token ${this.token}`,
        },
        params: params,
      });
      return response.data;
    } catch (error) {
      return null;
    }
  }
}
export { RateLimiter };
