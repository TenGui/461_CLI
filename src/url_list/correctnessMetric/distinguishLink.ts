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
  