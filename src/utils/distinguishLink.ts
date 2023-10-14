import axios from 'axios';

export function identifyLinkType(link: string) {
  // Regular expression pattern to match GitHub repository URLs
  const githubPattern = /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/.*)?$/;

  // Regular expression pattern to match npm package URLs with "activeTab=versions" query parameter
  const npmPattern = /^https:\/\/(www\.)?npmjs\.com\/package\/([^/?#]+)(\?.*activeTab=versions)?(\/.*)?$/;

  if (githubPattern.test(link)) {
    return 'GitHub Repository Link';
  } else if (npmPattern.test(link)) {
    return 'npm Package Link';
  } else {
    return 'Unknown Link';
  }
}

export function getGitHubRepoInfo(repoLink:string) {
  try {
    // Regular expression to match GitHub repository URLs
    const githubRepoRegex = /github\.com[\/:]([^\/]+)\/([^\/.]+)(?:\.git)?$/;

    // Use regex to extract owner and repo name
    const match = repoLink.match(githubRepoRegex);

    if (match && match.length === 3) {
      const owner = match[1];
      const repoName = match[2];
      return { owner, repoName };
    } else {
      throw new Error('Invalid GitHub repository URL');
    }
  } catch (error) {
    return {};
  }
}

export async function npmToGitHub(packageName: string): Promise<string> {
  const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
  const data = response.data;

  if (data.repository && data.repository.url) {
    const repositoryUrl = data.repository.url;
    let githubUrl = repositoryUrl.replace('git+', ''); // Remove 'git+' if present
    if (githubUrl.endsWith('.git')) {
      githubUrl = githubUrl.slice(0, -4); // Remove the trailing '.git' if present
    }
    return githubUrl;
  } else {
    return ''; // Return an empty string if the repository URL is not found
  }
}

export function getPackageNameFromNpmLink(npmLink: string): string | null {
  // Regular expression to match npm package links
  const regex = /https:\/\/(www\.)?npmjs\.com\/package\/([^/]+)/;

  // Use the regex to extract the package name
  const match = npmLink.match(regex);

  if (match && match[2]) {
    return match[2];
  } else {
    return null;
  }
}


