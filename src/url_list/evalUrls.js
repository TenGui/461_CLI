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
exports.eval_file = void 0;
var apiRateLimit_1 = require("../utils/apiRateLimit");
var utils_1 = require("../utils/utils");
var LicenseRunner = require("./licenseMetric/licenseRunner");
var BusFactorRunner = require("./busFactorMetric/busFactorRunner");
var RampUpRunner = require("./rampUpMetric/rampUpRunner");
var RespMaintRunner = require("./respMaintMetric/respMaintRunner");
var CorrectnessRunner = require("./correctnessMetric/correctnessRunner");
var PR_Runner = require("./PR_metric/pull_request");
var versionPinningRunner = require("./versionPinningMetric/versionPinning");
function eval_file(filepath) {
    if (filepath === void 0) { filepath = "URL_FILE_PATH"; }
    return __awaiter(this, void 0, void 0, function () {
        var url_list, finished;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url_list = (0, utils_1.get_urls)(filepath);
                    finished = 0;
                    url_list.forEach(function (urlstr) { return __awaiter(_this, void 0, void 0, function () {
                        var url, limiter, licenseScore, rampUpScore, busFactorScore, maintainerScore, correctnessScore, pull_request_score, versionPinningScore, multipliers, adjustedScores, overallScore, output;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    url = ["", ""];
                                    if (!urlstr.startsWith("https://www.npmjs.com")) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, utils_1.GetDetailsFromNPM)(urlstr)];
                                case 1:
                                    url = _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    url = (0, utils_1.parseFromGitLink)(urlstr);
                                    _a.label = 3;
                                case 3:
                                    limiter = new apiRateLimit_1.RateLimiter();
                                    return [4 /*yield*/, LicenseRunner.getLicenseScore(limiter, "/repos/".concat(url[0], "/").concat(url[1]))];
                                case 4:
                                    licenseScore = _a.sent();
                                    return [4 /*yield*/, RampUpRunner.getRampUpScore(url)];
                                case 5:
                                    rampUpScore = _a.sent();
                                    return [4 /*yield*/, BusFactorRunner.getBusFactorScore(limiter, "/repos/".concat(url[0], "/").concat(url[1]))];
                                case 6:
                                    busFactorScore = _a.sent();
                                    return [4 /*yield*/, RespMaintRunner.getRespMaintScore(url)];
                                case 7:
                                    maintainerScore = _a.sent();
                                    return [4 /*yield*/, CorrectnessRunner.getCorrectness(url)];
                                case 8:
                                    correctnessScore = _a.sent();
                                    return [4 /*yield*/, PR_Runner.getPRscore(url)];
                                case 9:
                                    pull_request_score = _a.sent();
                                    return [4 /*yield*/, versionPinningRunner.get_version_pin_score(url)];
                                case 10:
                                    versionPinningScore = _a.sent();
                                    multipliers = {
                                        license: 1,
                                        rampUp: 0.15,
                                        busFactor: 0.15,
                                        maintainer: 0.15,
                                        correctness: 0.25,
                                        pull_request: 0.2,
                                        versionPinning: 0.1
                                    };
                                    adjustedScores = {
                                        licenseScore: licenseScore,
                                        rampUpScore: rampUpScore,
                                        busFactorScore: busFactorScore,
                                        maintainerScore: maintainerScore,
                                        correctnessScore: correctnessScore,
                                        pullrequestScore: pull_request_score,
                                        versionPinningScore: versionPinningScore
                                    };
                                    Object.entries(adjustedScores).forEach(function (_a) {
                                        var key = _a[0], score = _a[1];
                                        adjustedScores[key] =
                                            Math.round((score + Number.EPSILON) * 100000) / 100000;
                                    });
                                    overallScore = Math.round((multipliers.rampUp * rampUpScore +
                                        multipliers.busFactor * busFactorScore +
                                        multipliers.maintainer * maintainerScore +
                                        multipliers.correctness * correctnessScore +
                                        multipliers.pull_request * pull_request_score +
                                        Number.EPSILON) *
                                        100000) / 100000;
                                    overallScore *= licenseScore;
                                    output = "{\"URL\": \"".concat(urlstr, "\", \"NET_SCORE\": ").concat(overallScore, ", \"RAMP_UP_SCORE\": ").concat(adjustedScores.rampUpScore, ", \"CORRECTNESS_SCORE\": ").concat(adjustedScores.correctnessScore, ", \"BUS_FACTOR_SCORE\": ").concat(adjustedScores.busFactorScore, ", \"RESPONSIVE_MAINTAINER_SCORE\": ").concat(adjustedScores.maintainerScore, ", \"LICENSE_SCORE\": ").concat(adjustedScores.licenseScore, ", \"PullRequest\": ").concat(adjustedScores.pullrequestScore, "}");
                                    console.log(output);
                                    finished += 1;
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    _a.label = 1;
                case 1:
                    if (!(finished < url_list.length)) return [3 /*break*/, 3];
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 400); })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3:
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
exports.eval_file = eval_file;
