export async function getBusFactorScore(
  RateLimiter: any,
  url: string
): Promise<number> {
  try {
    let keycontributor: string[] = [];
    const contributorResponse = await RateLimiter.getGitHubInfo(
      url + "/contributors"
    );
    let totalcontribution: number = 0;
    for (let contributor of contributorResponse) {
      totalcontribution += contributor.contributions;
    }
    let currentcontribution: number = 0;
    for (let contributor of contributorResponse) {
      if (currentcontribution >= Math.floor(totalcontribution / 2)) break;
      currentcontribution += contributor.contributions;
      keycontributor.push(contributor.login);
    }
    const busFactor: number = getScore(keycontributor.length);
    return busFactor;
  } catch {
    return 0;
  }
}
export function getScore(keycontributor: number): number {
  const e: number = 2.71828;
  if (keycontributor == 0) return 0;
  let busFactorScore: number =
    (1 - e ** (1.8 * (-keycontributor + 1))) / (1 + e ** (-keycontributor + 1));
  return Number(busFactorScore.toFixed(5));
}
