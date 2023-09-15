import axios from 'axios';

async function getWeeklyDownloadCount(packageName: string, startDate: string, endDate: string): Promise<number | undefined> {
  try {
    // Construct the API URL
    const apiUrl = `https://api.npmjs.org/downloads/point/${startDate}:${endDate}/${packageName}`;

    // Make the API request
    const response = await axios.get(apiUrl);

    if (response.status === 200) {
      const weeklyDownloadCount: number = response.data.downloads;
      return weeklyDownloadCount;
    } else {
      console.error(`Failed to retrieve download data. Status: ${response.status}`);
      return undefined;
    }
  } catch (error) {
    console.error(`Error fetching download counts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return undefined;
  }
}

async function getMaxWeeklyDownloads(packageName: string, numberOfWeeks: number): Promise<number | undefined> {
  try {
    let maxDownloadCount = 0;
    const today = new Date();

    // Loop through the past 'numberOfWeeks' weeks
    for (let i = 0; i < numberOfWeeks; i++) {
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() - i * 7);
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 6);

      const endDateStr = endDate.toISOString().slice(0, 10);
      const startDateStr = startDate.toISOString().slice(0, 10);

      const weeklyDownloadCount = await getWeeklyDownloadCount(packageName, startDateStr, endDateStr);

      if (weeklyDownloadCount !== undefined) {
        maxDownloadCount = Math.max(maxDownloadCount, weeklyDownloadCount);
      }
    }

    return maxDownloadCount;
  } catch (error) {
    console.error(`Error fetching max weekly downloads: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return undefined;
  }
}

// Example usage:
const packageName = 'lodash';
const numberOfWeeks = 4; // Change this to the number of weeks you want to consider

getMaxWeeklyDownloads(packageName, numberOfWeeks)
  .then((maxDownloads) => {
    if (maxDownloads !== undefined) {
      console.log(`Maximum weekly downloads for ${packageName} in the past ${numberOfWeeks} weeks: ${maxDownloads}`);
    } else {
      console.log('Failed to retrieve max weekly downloads.');
    }
  })
  .catch((error) => {
    console.error(error instanceof Error ? error : 'Unknown error occurred');
  });
