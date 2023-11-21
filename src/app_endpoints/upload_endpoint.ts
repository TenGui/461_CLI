import { parseFromGitLink } from "../utils/utils";
import * as path from "path";
import * as fs from "fs";
const { Octokit } = require("@octokit/rest");
import { promisePool } from "../database_files/database_connect";

export class Upload{
    private owner;
    private repo;
    private url;
    private response;

    constructor() {
        this.owner = "";
        this.repo = "";
        this.url = ""
        this.response = {};
    }

    async check_valid_githubURL(url: string){
        const GitHub_Info = parseFromGitLink(url);
        const owner = GitHub_Info[0]
        const repo = GitHub_Info[1];

        const octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN // Put your GitHub token here
          });

        try {
            const response = await octokit.repos.get({
                owner: owner,
                repo: repo,
            });
            this.owner = owner;
            this.repo = repo;
            this.url = url;
            this.response = response;
            console.log(`Repository ${owner}/${repo} exists.`);
            return true;
        } catch (error) {
            console.error(`Error checking repository: ${error.message}`);
            return false;
        }
    }

    async get_githubURL_data(){
        console.log(this.response);
    }

    async check_Package_Existence(name: string, version: string): Promise<boolean> {
        try {
            const [rows] = await promisePool.query(
                'SELECT COUNT(*) AS count_exists FROM PackageMetadata WHERE Name = ? AND Version = ?',
                [name, version]
            );
            const countExists: number = rows[0].count_exists;
            return countExists > 0;
        } catch (error) {
            console.error('Error checking package existence:', error);
            throw error;
        }
    }

    async process(url){
        await this.check_valid_githubURL(url);
        return {"owner": this.owner, "repo": this.repo, "url": this.url}
    }
}

const a = new Upload()
a.process("https://github.com/davisjam/safe-regex")