async function getLicenseScore(RateLimiter: any, url: string): Promise<number> {
  try {
    const License = "LGPL-2.1";
    const _license = await RateLimiter.getGitHubInfo(url + "/license");
    const find_license_regex = new RegExp('(apache-2.0)|(bsd-[2-3]-clause)|(MIT)|(lgpl-2.1)|(lgpl-3.0)|(gpl-[2-3].0)|([MIT])','i');
    
    //console.log(`API response is: ${JSON.stringify(_license.license)}`);

    const apiMatch = _license.license.spdx_id.match(find_license_regex);

    if (_license == null || !(apiMatch)) {
      const readme = await RateLimiter.getGitHubInfo(url + "/readme");
      const content = Buffer.from(readme.content, "base64").toString("utf-8");
      const license = content.split("License\n")[1];
      //const regex = / (\S+)\s+license/i;
      console.log(`License for ${url} is ${license}`);
      //const match = license.match(regex);
      //console.log(`Match for ${url} was ` + match);
      if ((find_license_regex.test(license))) {
        return 1;
      } else return 0;

      //If the license was set on github regex the API-response with the valid license types
    } else {
      return apiMatch ? 1 : 0;
    }
  } catch {
    return 0;
  }
}
export { getLicenseScore };
