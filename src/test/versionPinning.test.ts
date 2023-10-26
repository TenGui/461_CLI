import * as vp from "../url_list/versionPinningMetric/versionPinning";

describe("Version Pinning Metric", () => {
    it('Should return number between 0 and 1', async () => {
        const versionPinningScore = await vp.getScore(
            `https://github.com/clin8328/461_Team4_Phase2`
        );
        expect(versionPinningScore).toBeGreaterThanOrEqual(0);
        expect(versionPinningScore).toBeLessThanOrEqual(1);
        console.log(versionPinningScore);
    });

    // it ('Should return 0 if no contributors', async () => {
    //     const res = BusFactorRunner.getScore(0);
    //     expect(res).toEqual(0);
    // });
});