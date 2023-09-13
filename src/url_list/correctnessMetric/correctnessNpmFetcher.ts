import axios from 'axios';

export function extractPackageNameFromNpmLink(npmLink:string) {
    // Regular expression pattern to match npm package URLs
    const npmPattern = /^https:\/\/(www\.)?npmjs\.com\/(package\/)?(@[^/]+\/[^/]+)(\/.*)?$/;
  
    const match = npmLink.match(npmPattern);
  
    if (match) {
      // If it's a valid npm package link, extract the package name
      return match[3];
    } else {
      // If the link doesn't match the pattern, return null or an error message
      return null;
    }
  }

export function getPackageInfo(packageName:any) {
  try {
    // Fetch package metadata from the npm registry
    const response = await axios.get(`https://registry.npmjs.org/${packageName}`);
    const packageData = response.data;

    if (packageData && packageData.versions) {
      // Calculate total downloads
      const totalDownloads = Object.values(packageData.versions).reduce(
        (total, version:any) => total + version.downloads || 0,
        0
      );

      // Calculate weekly downloads (if available)
      const weeklyDownloads =
        packageData.time && packageData.time.weekly ? packageData.time.weekly : 'N/A';

      return { totalDownloads, weeklyDownloads };
    } else {
      return { totalDownloads: 'N/A', weeklyDownloads: 'N/A' };
    }
  } catch (error) {
    console.error('Error fetching package info:', error);
    return { totalDownloads: 'N/A', weeklyDownloads: 'N/A' };
  }
}
