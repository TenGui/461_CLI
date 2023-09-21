import { calcRespMaintScore } from "../url_list/respMaintMetric/calcRespMaintScore";

describe("Responsive Maintainer Metric", () => {
    it('Should Return 0.99996', () => {
        const t1 = calcRespMaintScore(1,.1);
        expect(t1).toEqual(0.99996);
    });
    it('Should Return 0.73106', () => {
        const t2 = calcRespMaintScore(1,1);
        expect(t2).toEqual(0.73106);
    });
    it('Should Return 0.54983', () => {
        const t3 = calcRespMaintScore(1,5);
        expect(t3).toEqual(0.54983);
    });
    it('Should Return 0.51263', () => {
        const t4 = calcRespMaintScore(3,46);
        expect(t4).toEqual(0.51263);
    });
    it('Should Return 0.99999', () => {
        const t5 = calcRespMaintScore(50,4);
        expect(t5).toEqual(0.99999);
    });
    it('Should Return 1', () => {
        const t6 = calcRespMaintScore(150,8);
        expect(t6).toEqual(1);
    });
    it('Should Return 0', () => {
        const t6 = calcRespMaintScore(0,0);
        expect(t6).toEqual(0);
    });
    it('Should Return 0.32865', () => {
        const t6 = calcRespMaintScore(500,700);
        expect(t6).toEqual(0.32865);
    });
});