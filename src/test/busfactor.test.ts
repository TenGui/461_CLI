import {RateLimiter} from "../utils/apiRateLimit";
import * as BusFactorRunner from "../url_list/busFactorMetric/busFactorRunner";

describe("Bus Factor Metric", () => {
    it('Should return number between 0 and 1', async () => {
        const limiter = new RateLimiter();
        const busFactorScore = await BusFactorRunner.getBusFactorScore(
            limiter,
            `/repos/expressjs/express`
        );
        expect(busFactorScore).toBeGreaterThanOrEqual(0);
        expect(busFactorScore).toBeLessThanOrEqual(1);
    });

    it ('Should return 0 if no contributors', async () => {
        const res = BusFactorRunner.getScore(0);
        expect(res).toEqual(0);
    });
});
