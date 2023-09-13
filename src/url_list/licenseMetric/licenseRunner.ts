async function getLicenseScore(RateLimiter: any, url: string): Promise<number> {
    const License = "LGPL-2.1";
    const _license = await RateLimiter.getGitHubInfo(url + "/license");
    return _license.license.spdx_id == License ? 1 : 0;
}

export { getLicenseScore };