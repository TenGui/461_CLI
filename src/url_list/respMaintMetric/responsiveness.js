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
exports.Responsiveness = void 0;
var rest_1 = require("@octokit/rest");
var date_fns_1 = require("date-fns");
var Responsiveness = /** @class */ (function () {
    function Responsiveness() {
    }
    Responsiveness.prototype.getCompletedIssues = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var owner, repoName, octokit, completedIssues, threeMonthsAgo_1, completedWithin3Months, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        owner = url[0];
                        repoName = url[1];
                        octokit = new rest_1.Octokit({
                            auth: process.env.GITHUB_TOKEN //Insert token
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log("here 0");
                        return [4 /*yield*/, octokit.request('GET /repos/{owner}/{repo}/issues', {
                                owner: owner,
                                repo: repoName,
                                state: 'closed',
                                per_page: 100,
                            })];
                    case 2:
                        completedIssues = _a.sent();
                        console.log("here 1");
                        if (completedIssues.status === 200) {
                            threeMonthsAgo_1 = (0, date_fns_1.subMonths)(new Date(), 3);
                            completedWithin3Months = completedIssues.data.filter(function (issue) { return (issue.state === 'closed' && //Filter for closed issues
                                issue.state_reason === 'completed' && //Filter for issues that have been marked as completed
                                issue.closed_at !== null &&
                                (0, date_fns_1.isAfter)(new Date(issue.closed_at), threeMonthsAgo_1) === true //Filter for issues that have been closed within the 3 months
                            ); });
                            // this.logger.info(completedWithin3Months)
                            // this.logger.info(new Date('2023-08-30T21:31:09Z'));
                            // this.logger.info(threeMonthsAgo);
                            // this.logger.info(isAfter(new Date('2023-08-30T21:31:09Z'), threeMonthsAgo));
                            return [2 /*return*/, completedWithin3Months]; //Return the data that contiains 
                        }
                        else {
                            throw new Error("Failed to fetch completed issues. Status code: ".concat(completedIssues.status));
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Error in Responseiveness, GetcompleteIssue: ", error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Responsiveness.prototype.calculateScore = function (completedWithin3Months, maxBenchmarkDays) {
        return __awaiter(this, void 0, void 0, function () {
            var numIssuesClosed, totalDaysOpen, score, _i, completedWithin3Months_1, issue, create_date, closed_date, averageDaysOpen;
            return __generator(this, function (_a) {
                numIssuesClosed = 0;
                totalDaysOpen = 0;
                score = 0;
                for (_i = 0, completedWithin3Months_1 = completedWithin3Months; _i < completedWithin3Months_1.length; _i++) {
                    issue = completedWithin3Months_1[_i];
                    if (issue.closed_at !== null) {
                        create_date = new Date(issue.created_at);
                        closed_date = new Date(issue.closed_at);
                        totalDaysOpen += (0, date_fns_1.differenceInDays)(closed_date, create_date);
                        numIssuesClosed++;
                    }
                }
                if (numIssuesClosed === 0) {
                    score = 0;
                }
                else {
                    averageDaysOpen = totalDaysOpen / numIssuesClosed;
                    // this.logger.info(`Average time to close an issue: ${averageDaysOpen} days, number of issues closed: ${numIssuesClosed}`);
                    score = Math.max(0, (maxBenchmarkDays - averageDaysOpen) / maxBenchmarkDays);
                }
                return [2 /*return*/, score];
            });
        });
    };
    Responsiveness.prototype.numCollaborators = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var maxBenchmarkDays, data, score, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        maxBenchmarkDays = 30;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.getCompletedIssues(url)];
                    case 2:
                        data = _a.sent();
                        return [4 /*yield*/, this.calculateScore(data, maxBenchmarkDays)];
                    case 3:
                        score = _a.sent();
                        return [2 /*return*/, score];
                    case 4:
                        error_2 = _a.sent();
                        console.error("numCollaborators: Error: " + error_2.message);
                        return [2 /*return*/, -1]; // Return a default score or handle the error as needed
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Responsiveness;
}());
exports.Responsiveness = Responsiveness;
/*
used in main to return an integer representing the score from a string representing the url
*/
// export async function getResponsiveness(url: string) {
//     let test = new Responsiveness(url);
//     return await test.numCollaborators();
// }
/* Example

(async () => {
    let test = new Responsiveness('https://github.com/clin8328/ECE461-Team4'); //https://github.com/clin8328/ECE461-Team4 https://github.com/davisjam/safe-regex
    const score = await test.numCollaborators();
    this.logger.info(`Score: ${score}`);
})();

*/
// (async () => {
//     let test = new Responsiveness('https://github.com/davisjam/safe-regex'); //https://github.com/clin8328/ECE461-Team4 https://github.com/davisjam/safe-regex
//     const score = await test.numCollaborators();
//     this.logger.info(`Score: ${score}`);
// })();
