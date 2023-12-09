import * as vp from "../url_list/versionPinningMetric/versionPinning";

describe("Version Pinning Metric", () => {
    it('Should return number between 0 and 1', async () => {
        const versionPinningScore = await vp.get_version_pin_score(
           ["clin8328", "461_Team4_Phase2"]
        );
        expect(versionPinningScore).toBeGreaterThanOrEqual(0);
        expect(versionPinningScore).toBeLessThanOrEqual(1);
        console.log(versionPinningScore);
    });
    it('Should return number between 0 and 1 for the broken test case', async () => {
        const versionPinningScore = await vp.get_version_pin_score(
           ["jashkenas", "underscore"]
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