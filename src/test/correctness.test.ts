import {calcCorrectnessScore} from "../url_list/correctnessMetric/correctnessRunner";
import {calculateWeeksDifference} from "../url_list/correctnessMetric/correctnessRunner";
import {getCorrectness} from "../url_list/correctnessMetric/correctnessRunner";
import { parseFromGitLink } from "../utils/utils";
describe("Correctness Metric", () => {
    it('Should Return 1', async () => {
        const t1 = await calcCorrectnessScore(1,0,1,1);
        console.log(t1);
        expect(t1).toEqual(1);
    });
    it('Should Return -1 if invalid Timestamp', ()=> {
        const t2 = calculateWeeksDifference("JIBBERISH");
        expect(t2).toEqual(-1);
    })
    it ('Should Return number of weeks if Timestamp valid', ()=> {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const timestamp = oneWeekAgo.toISOString();
        const result = calculateWeeksDifference(timestamp);
        expect(result).toBeCloseTo(1, 0);
    });
    it ('Should return correctness score 0  ', async () => {
        const url = parseFromGitLink("https://github.com/jonschlinkert/is-even");
        const correctness = await getCorrectness(url);
        expect(correctness).toBeCloseTo(0, 1);

    });
    it ('Should return correctness score between 0 to 1  ', async () => {
        const url = parseFromGitLink("https://github.com/facebookresearch/nougat");
        const correctness = await getCorrectness(url);
        expect(correctness).toBeCloseTo(0.8, 1);
    });
});
