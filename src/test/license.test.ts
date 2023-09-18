import {getLicenseScore} from "../url_list/licenseMetric/licenseRunner";
import {RateLimiter} from "../utils/apiRateLimit";  
describe("License Metric", () => {
    it('Should return 1 if license is LGPL-2.1', async () => {
        const limiter = new RateLimiter();
        const licenseScore = await getLicenseScore(
            limiter,
            `/repos/TenGui/461_CLI`
        );
        expect(licenseScore).toEqual(1);
    });
    
    it('Should return 1 if license match', async () => {
        const limiter = new RateLimiter();
        const licenseScore = await getLicenseScore(
            limiter,
            `/repos/ShaoNingHuang/ECE39595-Spring2023-lab3`
        );
        expect(licenseScore).toEqual(1);
    });
    
    it('Should return 0 if license is not match', async () => {
        const limiter = new RateLimiter();
        const licenseScore = await getLicenseScore(
            limiter,
            `/repos/nodejs/node`
        );
        expect(licenseScore).toEqual(0);
    });
    
});
