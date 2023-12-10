import { parseFromGitLink } from "../utils/utils";
import * as path from "path";
import * as fs from "fs";
const { Octokit } = require("@octokit/rest");
import { promisePool } from "../database_files/database_connect";
import * as unzipper from 'unzipper';

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

    async decompress_zip_to_github_link(base64): Promise<string> {
        return new Promise((resolve, reject) => {
            const base64String = base64;
    
            const buffer = Buffer.from(base64String, 'base64');
    
            const readableStream = require('stream').Readable.from(buffer);
            let cleaned_github_link = "";
    
            readableStream.pipe(unzipper.Parse())
                .on('entry', (entry: unzipper.Entry) => {
                    if (entry.path.endsWith("package.json")) {
                        console.log('Found package.json in the ZIP file.');
    
                        const contentStream = fs.createWriteStream('zip_file_package.json');
                        entry.pipe(contentStream);
    
                        contentStream.on('finish', () => {
                            // Parse the JSON content
                            fs.readFile("zip_file_package.json", 'utf-8', (err, data) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }
                                try {
                                    const parsedContent = JSON.parse(data);
                                    if (parsedContent && parsedContent['repository']) {
                                        const github_link = parsedContent['repository'].url
                                        cleaned_github_link = "https://" + github_link.substring(6, github_link.length - 4);
                                        console.log("Extracted github repo link from ZIP file: ", cleaned_github_link);
                                    }
                                    console.log('base64 ZIP file decoded.');
                                    if (cleaned_github_link) {
                                        resolve(cleaned_github_link);
                                    } else {
                                        reject(new Error('GitHub link not found in the ZIP file.'));
                                    }
                                } catch (error) {
                                    console.error('Error parsing JSON content:', error);
                                    reject(error);
                                }
                            });
                        });
                    } else {
                        entry.autodrain();
                    }
                })
                .on('error', (err: Error) => {
                    console.error('Error checking base64 encoded zip file:', err);
                    reject(err);
                })
        });
    }
    
    async process(url){
        const githubUrlRegex = /github\.com\/(.+)/;
        const match = url.match(githubUrlRegex);
    
        if (match) {
            const extractedString = match[1];
            url = `https://github.com/${extractedString}`;
        } else {
            return false;
        }

        const output = await this.check_valid_githubURL(url);
        if(!output){
            return false;
        }
        return {"owner": this.owner, "repo": this.repo, "url": this.url}
    }
}

// const a = new Upload()
// a.process("https://github.com/davisjam/safe-regex")