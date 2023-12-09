export async function getGitHubPackageVersion(githubUrl: string): Promise<string> {
    try {
        // Fetch the GitHub API response for the file
        const response = await fetch(`${githubUrl}/blob/master/package.json`);
        const apiResponse = await response.text();

        // Parse the GitHub HTML response to extract the rawBlobUrl
        const rawBlobUrlMatch = apiResponse.match(/https:\/\/github\.com\/[^"]+\/raw\/[^"]+\/package\.json/);
        const rawBlobUrl = rawBlobUrlMatch ? rawBlobUrlMatch[0] : null;

        if (rawBlobUrl) {
            // Fetch the raw content of package.json using the rawBlobUrl
            const rawContentResponse = await fetch(rawBlobUrl);
            const rawContent = await rawContentResponse.text();

            // Parse the JSON content of package.json
            const packageJson = JSON.parse(rawContent);

            // Extract the version from package.json
            const version: string = packageJson.version || '1.0.0';
            //console.log('Package Version:', version);

            // Return the extracted version
            return version;
        } else {
            console.error('Unable to extract rawBlobUrl from GitHub API response.');
            // Return a default version if rawBlobUrl is not found
            return '1.0.0';
        }
    } catch (error) {
        console.error('Error fetching or parsing package.json:', error.message);
        // Return a default version in case of an error
        return '1.0.0';
    }
}
