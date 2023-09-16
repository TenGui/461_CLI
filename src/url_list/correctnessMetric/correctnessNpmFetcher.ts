import axios from 'axios';

export async function getWeeklyDownloadCount(packageName: string, startDate: string, endDate: string): Promise<number> {
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
      return -1;
    }
  } catch (error) {
    console.error(`Error fetching download counts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return -1;
  }
}

export async function getMaxWeeklyDownloads(packageName: string, numberOfWeeks: number): Promise<number> {
  try {
    let maxDownloadCount = 0;
    const today = new Date();

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
    return -1;
  }
}
