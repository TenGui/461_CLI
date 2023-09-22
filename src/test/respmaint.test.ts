import { calcRespMaintScore } from "../url_list/respMaintMetric/calcRespMaintScore";

describe("Responsive Maintainer Metric", () => {
    it('Should Return 0.99996', () => {
        const t1 = calcRespMaintScore(1,.1);
        expect(t1).toBeGreaterThanOrEqual(0.99995);
        expect(t1).toBeLessThanOrEqual(1);
    });
    it('Should Return 0.73106', () => {
        const t2 = calcRespMaintScore(1,1);
        expect(t2).toBeGreaterThanOrEqual(0.73100);
        expect(t2).toBeLessThanOrEqual(0.73200);
    });
    it('Should Return 0.54983', () => {
        const t3 = calcRespMaintScore(1,5);
        expect(t3).toBeGreaterThanOrEqual(0.54800);
        expect(t3).toBeLessThanOrEqual(0.55000);
    });
    it('Should Return 0.51263', () => {
        const t4 = calcRespMaintScore(3,46);
        expect(t4).toBeGreaterThanOrEqual(0.51000);
        expect(t4).toBeLessThanOrEqual(0.52000);
    });
    it('Should Return 0.99999', () => {
        const t5 = calcRespMaintScore(50,4);
        expect(t5).toBeGreaterThanOrEqual(0.99900);
        expect(t5).toBeLessThanOrEqual(1);
    });
    it('Should Return 1', () => {
        const t6 = calcRespMaintScore(150,8);
        expect(t6).toBeGreaterThanOrEqual(0.99900);
        expect(t6).toBeLessThanOrEqual(1);
    });
    it('Should Return 0', () => {
        const t7 = calcRespMaintScore(0,0);
        expect(t7).toEqual(0);
        expect(t7).toBeGreaterThanOrEqual(0.00000);
        expect(t7).toBeLessThanOrEqual(0.00100);
    });
    /*it('Should Return 0.32865', () => {
        const t8 = calcRespMaintScore(500,700);
        expect(t8).toEqual(0.32865);
    }); */
});