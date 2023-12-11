"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var rampUpUtils_1 = require("../url_list/rampUpMetric/rampUpUtils");
var calcRampUpScore_1 = require("../url_list/rampUpMetric/calcRampUpScore");
var files = [
    path.join(process.cwd(), "/src/test/testfile1.txt"),
    path.join(process.cwd(), "/src/test/testfile2.txt"),
    path.join(process.cwd(), "/src/test/testfile3.md"),
];
describe("File Reading", function () {
    it("Reads lines in a single file", function () { return __awaiter(void 0, void 0, void 0, function () {
        var lines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, rampUpUtils_1.countLines)(files[2])];
                case 1:
                    lines = _a.sent();
                    expect(lines).toEqual(14);
                    return [2 /*return*/];
            }
        });
    }); });
    it("Reads lines in a list of files", function () { return __awaiter(void 0, void 0, void 0, function () {
        var lines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, rampUpUtils_1.sumLines)("", files)];
                case 1:
                    lines = _a.sent();
                    expect(typeof lines).toBe("number");
                    return [2 /*return*/];
            }
        });
    }); });
    it("Filters files by postfix", function () { return __awaiter(void 0, void 0, void 0, function () {
        var filteredFiles;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, rampUpUtils_1.getFileWithEnd)(".txt", files)];
                case 1:
                    filteredFiles = _a.sent();
                    expect((0, rampUpUtils_1.getFileWithEnd)(".txt", files).length).toEqual(2);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe("Calculating Score", function () {
    it("Returns 0 if no code", function () {
        expect((0, calcRampUpScore_1.calcRampUpScore)(0, 0)).toEqual(0);
    });
    it("Returns ~0.986 if md:js is 1:1", function () {
        expect(typeof (0, calcRampUpScore_1.calcRampUpScore)(50, 100)).toEqual("number");
        expect((0, calcRampUpScore_1.calcRampUpScore)(100, 100)).toBeGreaterThan(0.986);
        expect((0, calcRampUpScore_1.calcRampUpScore)(100, 100)).toBeLessThan(0.987);
    });
    it("Returns ~0.848 if md:js is 1:2", function () {
        expect(typeof (0, calcRampUpScore_1.calcRampUpScore)(50, 100)).toEqual("number");
        expect((0, calcRampUpScore_1.calcRampUpScore)(50, 100)).toBeGreaterThan(0.848);
        expect((0, calcRampUpScore_1.calcRampUpScore)(50, 100)).toBeLessThan(0.849);
    });
    it("Returns ~0.554 if md:js is 1:4", function () {
        expect(typeof (0, calcRampUpScore_1.calcRampUpScore)(25, 100)).toEqual("number");
        expect((0, calcRampUpScore_1.calcRampUpScore)(25, 100)).toBeGreaterThan(0.554);
        expect((0, calcRampUpScore_1.calcRampUpScore)(25, 100)).toBeLessThan(0.555);
    });
    it("Returns ~0.302 if md:js is 1:8", function () {
        expect(typeof (0, calcRampUpScore_1.calcRampUpScore)(25, 200)).toEqual("number");
        expect((0, calcRampUpScore_1.calcRampUpScore)(25, 200)).toBeGreaterThan(0.302);
        expect((0, calcRampUpScore_1.calcRampUpScore)(25, 200)).toBeLessThan(0.303);
    });
});
