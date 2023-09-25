"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
const rateLimit = require("axios-rate-limit");
const axios = require("axios");
const dotenv = require("dotenv");
class RateLimiter {
    constructor() {
        dotenv.config();
        this.githubApi = rateLimit(axios.create(), {
            maxRequests: 1,
            perMilliseconds: 3750,
        });
        this.token = process.env.GITHUB_TOKEN || "";
        this.github_api = "https://api.github.com";
    }
    Settoken(token) {
        this.token = token;
    }
    async getGitHubInfo(url, params = {}) {
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
        }
        catch (error) {
            return null;
        }
    }
}
exports.RateLimiter = RateLimiter;
