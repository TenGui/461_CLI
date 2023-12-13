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
exports.getPRscore = void 0;
var path = require("path");
var fs = require("fs");
var rampUpUtils_1 = require("../rampUpMetric/rampUpUtils");
var Octokit = require("@octokit/rest").Octokit;
function getPRscore(url) {
    return __awaiter(this, void 0, void 0, function () {
        var dir, fileList, jsList, linesJS, octokit, pr_with_review, total_pr, owner, repo, page, response, pullRequests, reviewedPr, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    dir = path.join(process.cwd(), "/rampup_repos/".concat(url[0], "/").concat(url[1]));
                    return [4 /*yield*/, fs.readdirSync(dir, {
                            recursive: true,
                        })];
                case 1:
                    fileList = (_a.sent());
                    jsList = (0, rampUpUtils_1.getFileWithEnd)(".js", fileList);
                    return [4 /*yield*/, (0, rampUpUtils_1.sumLines)(dir, jsList)];
                case 2:
                    linesJS = _a.sent();
                    octokit = new Octokit({
                        auth: process.env.GITHUB_TOKEN // Put your GitHub token here
                    });
                    pr_with_review = [];
                    total_pr = 0;
                    owner = url[0];
                    repo = url[1];
                    page = 0;
                    _a.label = 3;
                case 3:
                    if (!(page <= 10)) return [3 /*break*/, 6];
                    return [4 /*yield*/, octokit.request('GET /repos/{owner}/{repo}/pulls', {
                            owner: owner,
                            repo: repo,
                            state: 'closed',
                            per_page: 100,
                            page: page
                        })];
                case 4:
                    response = _a.sent();
                    pullRequests = response.data;
                    //Check if there are no PR
                    if (pullRequests.length === 0) {
                        return [3 /*break*/, 6];
                    }
                    reviewedPr = pullRequests.filter(function (pr) { return pr.requested_reviewers.length > 0 && pr.merged_at != null; });
                    pr_with_review = pr_with_review.concat(reviewedPr);
                    total_pr += pullRequests.length;
                    _a.label = 5;
                case 5:
                    page++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/, total_pr === 0 ? 0 : pr_with_review.length / total_pr];
                case 7:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [2 /*return*/, 0];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.getPRscore = getPRscore;
