class URLReader {
    private url: string;

    constructor(url: string) {
        this.url = url;
    }

    isNpmURL(): boolean {
        const npmRegex = /^https:\/\/(www\.)?npmjs\.com\/package\/[\w-]+$/;
        return npmRegex.test(this.url);
    }

    isGitHubURL(): boolean {
        const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
        return githubRegex.test(this.url);
    }

    extractPackageName(): string | null {
        if (this.isNpmURL()) {
            // Extract package name from npmjs.com URL
            const matches = this.url.match(/\/package\/([\w-]+)$/);
            return matches ? matches[1] : null;
        } else if (this.isGitHubURL()) {
            // Extract repository name from GitHub URL
            const matches = this.url.match(/\/([\w-]+)\/([\w-]+)$/);
            return matches ? `${matches[1]}/${matches[2]}` : null;
        }
        return null;
    }
 }

 
 