const cheerio = require('cheerio');


export async function fetchGitHubData(owner, repo, gitHubUrl): Promise<{ zipContent: Uint8Array, readmeContent: string }> {
  try {
      // Fetch the ZIP file from the GitHub repository
      const zipUrl = `https://codeload.github.com/${owner}/${repo}/zip/master`;
      const zipResponse = await fetch(zipUrl);
      if (!zipResponse.ok) {
        throw new Error(`Error fetching ZIP file: ${zipResponse.status} ${zipResponse.statusText}`);
      }
      const zipArrayBuffer = await zipResponse.arrayBuffer();
      const zipContent = new Uint8Array(zipArrayBuffer);

      // Fetch the README file from the GitHub repository (assuming it's in the root of the repository)
      const readmeResponse = await fetch(`${gitHubUrl}/raw/master/README.md`);
      
      const readmeText = await readmeResponse.text();

      // Use cheerio to parse the README content
      const $ = cheerio.load(readmeText);
      const readmeContent = $('body').text();
      //console.log(readmeContent);

      return { zipContent, readmeContent };
  } catch (error) {
      throw new Error(`Error fetching GitHub data: ${error.message}`);
  }
}