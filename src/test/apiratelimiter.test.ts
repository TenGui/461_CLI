import { RateLimiter } from "../utils/apiRateLimit";

describe("API Rate Limiter", () => {
    beforeEach(() => {
        console.error = jest.fn();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    it('Should return error if no token', async () => {
        let ratelimiter = new RateLimiter();
        ratelimiter.Settoken("");
        const res = await ratelimiter.getGitHubInfo("/repos/expressjs/express");
        expect(console.error).toHaveBeenCalledWith("No env variable 'GITHUB_TOKEN' provided");
        expect(res).toEqual(null);

    });
});