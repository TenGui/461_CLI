import {calcCorrectnessScore} from "../url_list/correctnessMetric/correctnessRunner";

describe("Correctness Metric", () => {
    it('Should Return 1', async () => {
        const t1 = await calcCorrectnessScore(1,0,1,1);
        console.log(t1);
        expect(t1).toEqual(1);
    });
    it('Should Return 0', async () => {
        const t1 = await calcCorrectnessScore(0,1,1,0);
        console.log(t1);
        expect(t1).toEqual(0);
    });
    it('Should Return 0.5', async () => {
        const t1 = await calcCorrectnessScore(1,0,1,0);
        console.log(t1);
        expect(t1).toEqual(0.5);
    });
    it('Should Return 0.75', async () => {
        const t1 = await calcCorrectnessScore(1,1,1,1);
        console.log(t1);
        expect(t1).toEqual(0.75);
    });
});
