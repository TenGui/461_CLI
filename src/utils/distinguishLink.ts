export function identifyLinkType(link: string) {
    // Regular expression pattern to match GitHub repository URLs
    const githubPattern = /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/.*)?$/;
  
    // Regular expression pattern to match npm package URLs (including scoped packages)
    const npmPattern = /^https:\/\/(www\.)?npmjs\.com\/(package\/)?(@[^/]+\/[^/]+)(\/.*)?$/;
  
    if (githubPattern.test(link)) {
      return 'GitHub Repository Link';
    } else if (npmPattern.test(link)) {
      return 'npm Package Link';
    } else {
      return 'Unknown Link';
    }
  }

export function getOwnerAndRepoFromGitHubUrl(githubUrl: string) {
    try {
      // Remove any trailing slashes and split the URL by '/'
      const urlParts = githubUrl.replace(/\/$/, '').split('/');
  
      // Check if the URL matches the expected GitHub repository URL format
      if (
        urlParts.length >= 4 &&
        urlParts[0] === 'https:' &&
        urlParts[2] === 'github.com'
      ) {
        const owner = urlParts[3];
        const repo = urlParts[4];
        return { owner, repo };
      } else {
        throw new Error('Invalid GitHub URL');
      }
    } catch (error) {
      console.error('Error extracting owner and repo:', error);
      return { owner: null, repo: null };
    }
  }

  