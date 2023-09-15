async function getLicenseScore(RateLimiter: any, url: string): Promise<number> {
    const License = "LGPL-2.1";
    const _license = await RateLimiter.getGitHubInfo(url + "/license");
    if (_license == null) {
        let license = "";
        const readme = await RateLimiter.getGitHubInfo(url + "/readme");
        const content = readme.content;
        const decodeedContent = Buffer.from(content, "base64").toString();
        const Licensesection = decodeedContent.split("License")[1];
        if (Licensesection.length == 1) {
            return 0;
        }
        const licenseRegex = /([^ ]+)\s+license/i;;
        const match = Licensesection.match(licenseRegex);
        if (match && match[1]) {
            license = match[1];
        }
        return license == License ? 1 : 0;
    }
    else
        return _license.license.spdx_id == License ? 1 : 0;

    return 1;
}

export { getLicenseScore };