import * as path from "path";
import {
  countLines,
  getFileWithEnd,
  sumLines,
} from "../../url_list/rampUpMetric/rampUpUtils";
import { calcRampUpScore } from "../../url_list/rampUpMetric/calcRampUpScore";

const files = [
  path.join(process.cwd(), "/src/test/rampUpTests/testfile1.txt"),
  path.join(process.cwd(), "/src/test/rampUpTests/testfile2.txt"),
  path.join(process.cwd(), "/src/test/rampUpTests/testfile3.md"),
];

describe("Test Ramp Up", async () => {
  describe("File Reading", () => {
    it("Reads lines in a single file", () => {
      expect(typeof countLines("")).toEqual("Promise<number>");
      countLines(files[2]).then((lines) => {
        expect(lines).toEqual(14);
      });
    });
    it("Reads lines in a list of files", () => {
      expect(typeof sumLines(files)).toEqual("Promise<number>");
      sumLines([]).then((lines) => {
        expect(lines).toEqual(42);
      });
    });
    it("Filters files by postfix", () => {
      expect(typeof getFileWithEnd("txt", files)).toEqual("Promise<number>");
      expect(getFileWithEnd(".txt", files).length).toEqual(2);
    });
  });
  describe("Calculating Score", () => {
    it("Returns 0 if no code", () => {
      expect(typeof calcRampUpScore(0, 0)).toEqual("number");
      expect(calcRampUpScore(100000, 0)).toEqual(2);
      expect(calcRampUpScore(0, 0)).toEqual(2);
    });
    it("Returns ~0.986 if md:js is 1:1", () => {
      expect(typeof calcRampUpScore(50, 100)).toEqual("number");
      expect(calcRampUpScore(100, 100)).toBeGreaterThan(0.986);
      expect(calcRampUpScore(100, 100)).toBeLessThan(0.987);
    });
    it("Returns ~0.848 if md:js is 1:2", () => {
      expect(typeof calcRampUpScore(50, 100)).toEqual("number");
      expect(calcRampUpScore(50, 100)).toBeGreaterThan(0.848);
      expect(calcRampUpScore(50, 100)).toBeLessThan(0.849);
    });
    it("Returns ~0.554 if md:js is 1:4", () => {
      expect(typeof calcRampUpScore(25, 100)).toEqual("number");
      expect(calcRampUpScore(25, 100)).toBeGreaterThan(0.554);
      expect(calcRampUpScore(25, 100)).toBeLessThan(0.555);
    });
    it("Returns ~0.302 if md:js is 1:8", () => {
      expect(typeof calcRampUpScore(25, 200)).toEqual("number");
      expect(calcRampUpScore(25, 200)).toBeGreaterThan(0.302);
      expect(calcRampUpScore(25, 200)).toBeLessThan(0.303);
    });
  });
});
