import axios from 'axios';

export function getPackageNameFromNpmLink(npmLink: string): string | null {
    // Regular expression pattern to match npm package URLs
    const npmPattern = /^https:\/\/(www\.)?npmjs\.com\/package\/([^/?#]+)(\?.*)?$/;
  
    // Check if the npm link matches the pattern
    const match = npmLink.match(npmPattern);
  
    if (match) {
      // Extract the package name from the match
      const packageName = match[2];
  
      return packageName;
    } else {
      return null; // Return null for invalid or unmatched npm links
    }
  }


export async function getTotalDownloadsLastWeek(packageName: string): Promise<number> {
  try {
    // Calculate the date range for the last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    // Convert the dates to ISO format
    const endDateISO = endDate.toISOString().split('T')[0];
    const startDateISO = startDate.toISOString().split('T')[0];

    // Construct the URL for the npm package API with the date range
    const url = `https://api.npmjs.org/downloads/range/${startDateISO}:${endDateISO}/${packageName}`;

    // Send an HTTP GET request to the API
    const response = await axios.get(url);

    // Check if the request was successful and extract the total downloads for the last week
    if (response.status === 200 && response.data && response.data.downloads) {
      return response.data.downloads.reduce((total: number, week: any) => {
        return total + week.downloads;
      }, 0);
    } else {
      // Return null as the default value
      return -1;
    }
  } catch (error: any) {
    // Handle any errors, e.g., network issues or package not found
    console.error(`Error fetching total downloads for ${packageName}: ${error.message}`);
    return -1;
  }
}

export async function getHighestTotalDownloadsAcrossWeeks(packageName: string): Promise<number> {
  try {
    // Construct the URL for the npm package API to fetch all weekly downloads
    const url = `https://api.npmjs.org/downloads/range/1000-01-01:3000-01-01/${packageName}`;
    
    // Send an HTTP GET request to the API to fetch all weekly downloads
    const response = await axios.get(url);

    // Check if the request was successful and extract the weekly download data
    if (response.status === 200 && response.data && response.data.downloads) {
      const weeklyDownloads = response.data.downloads;

      // Calculate the highest total downloads across all weeks
      let highestTotalDownloads = 0;
      for (const week of weeklyDownloads) {
        if (week.downloads > highestTotalDownloads) {
          highestTotalDownloads = week.downloads;
        }
      }

      return highestTotalDownloads;
    } else {
      // Return null as the default value
      return -1;
    }
  } catch (error: any) {
    // Handle any errors, e.g., network issues or package not found
    console.error(`Error fetching download data for ${packageName}: ${error.message}`);
    return -1;
  }
}



