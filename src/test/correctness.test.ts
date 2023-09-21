import {calcCorrectnessScore} from "../url_list/correctnessMetric/correctnessRunner";

describe("Correctness Metric", () => {
    it('Should Return 1', () => {
        const t1 = calcCorrectnessScore(1,0,1,1);
        expect(t1).toEqual(1);
    });
    it('Should Return 0.75', () => {
        const t2 = calcCorrectnessScore(1,0,1,0.5);
        expect(t2).toEqual(0.75);
    it('Should Return 1', async () => {
        const t1 = await calcCorrectnessScore(1,1,1,1);
        expect(t1).toEqual(0.75);
    });
    /*
    it('Should Return 0.75', async () => {
        const t2 = await calcCorrectnessScore(1,1,1,0.5);
        expect(t2).toEqual(0.5);
    });

    //shoud return 0.
    it('Should Return 0.5', async () => {
        const t3 = await calcCorrectnessScore(1,1,1,0);
        expect(t3).toEqual(0.5);
    });
    it('Should Return 0.5', () => {
        const t4 = calcCorrectnessScore(0,1,1,1);
        expect(t4).toEqual(0.5);
    });
    */
});
