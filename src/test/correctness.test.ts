import {calcCorrectnessScore} from "../url_list/correctnessMetric/correctnessRunner";

describe("Correctness Metric", () => {
    //sohuld return 0.75 instead of 1?
    it('Should Return 1', async () => {
        const t1 = await calcCorrectnessScore(1,1,1,1);
        expect(t1).toEqual(0.75);
    });    
});
