import { calcRespMaintScore } from "../url_list/respMaintMetric/calcRespMaintScore";

describe("Responsive Maintainer Metric", () => {
    it('Should Return 0.99979', () => {
        const t1 = calcRespMaintScore(1,.1);
        expect(t1).toBeGreaterThanOrEqual(0.99970);
        expect(t1).toBeLessThanOrEqual(0.99980);
    });
    it('Should Return 0.37754', () => {
        const t2 = calcRespMaintScore(1,1);
        expect(t2).toBeGreaterThanOrEqual(0.37700);
        expect(t2).toBeLessThanOrEqual(0.37800);
    });
    it('Should Return 0.21416', () => {
        const t3 = calcRespMaintScore(1,5);
        expect(t3).toBeGreaterThanOrEqual(0.21400);
        expect(t3).toBeLessThanOrEqual(0.21500);
    });
    it('Should Return 0.19235', () => {
        const t4 = calcRespMaintScore(3,46);
        expect(t4).toBeGreaterThanOrEqual(0.19200);
        expect(t4).toBeLessThanOrEqual(0.19300);
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
        expect(t7).toBeGreaterThanOrEqual(0.00000);
        expect(t7).toBeLessThanOrEqual(0.00100);
    });
    it('Should Return 0.31309', () => {
        const t8 = calcRespMaintScore(500,700);
        expect(t8).toBeGreaterThanOrEqual(0.31300);
        expect(t8).toBeLessThanOrEqual(0.31400);
    });
    it('Should Return 0.62245', () => {
        const t9 = calcRespMaintScore(100,50);
        expect(t9).toBeGreaterThanOrEqual(0.62200);
        expect(t9).toBeLessThanOrEqual(0.62300);
    });
    it('Should Return 0.84271', () => {
        const t10 = calcRespMaintScore(89,28);
        expect(t10).toBeGreaterThanOrEqual(0.84200);
        expect(t10).toBeLessThanOrEqual(0.84300);
    });
    it('Should Return 0.50000', () => {
        const t11 = calcRespMaintScore(45,30);
        expect(t11).toBeGreaterThanOrEqual(0.49900);
        expect(t11).toBeLessThanOrEqual(0.50100);
    });
    it('Should Return 0.71095', () => {
        const t8 = calcRespMaintScore(60,25);
        expect(t8).toBeGreaterThanOrEqual(0.71000);
        expect(t8).toBeLessThanOrEqual(0.71100);
    });
});