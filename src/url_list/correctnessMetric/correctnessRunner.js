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
exports.calculateWeeksDifference = exports.getCorrectness = exports.calcCorrectnessScore = void 0;
var dotenv = require("dotenv");
dotenv.config();
var axios_1 = require("axios");
var graphqlEndpoint = "https://api.github.com/graphql";
function getCorrectness(url) {
    return __awaiter(this, void 0, void 0, function () {
        var key, owner, name_1, totalOpenIssues, totalClosedIssues, lastReleaseWeeklyDownloads, maxReleaseWeeklyDownloads, variables, query, result, releases, releasesCount, recent, i, recentRelease, weeksDifference, recentDownloads, i, CurrWeeklyDownloads, correctness, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    key = process.env.GITHUB_TOKEN;
                    owner = url[0];
                    name_1 = url[1];
                    totalOpenIssues = 0;
                    totalClosedIssues = 0;
                    lastReleaseWeeklyDownloads = 0;
                    maxReleaseWeeklyDownloads = 0;
                    variables = {
                        owner: owner,
                        name: name_1,
                    };
                    query = "\n      query ($owner: String!, $name: String!) {\n        repository(owner: $owner, name: $name) {\n          openIssues: issues(states: OPEN) {\n            totalCount\n          }\n          closedIssues: issues(states: CLOSED) {\n            totalCount\n          }\n          releases(first: 100, orderBy: { field: CREATED_AT, direction: DESC }) {\n            totalCount\n            nodes {\n              releaseAssets(first: 20) {\n                nodes {\n                  name\n                  downloadCount\n                  createdAt\n                }\n              }\n            }\n          }\n        }\n      }\n    ";
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: graphqlEndpoint,
                            method: "post",
                            headers: {
                                Authorization: "Bearer ".concat(key),
                            },
                            data: {
                                query: query,
                                variables: variables,
                            },
                        })];
                case 1:
                    result = _a.sent();
                    totalOpenIssues = result.data.data.repository.openIssues.totalCount;
                    totalClosedIssues = result.data.data.repository.closedIssues.totalCount;
                    if (totalOpenIssues + totalClosedIssues == 0) {
                        totalClosedIssues = 0;
                        totalOpenIssues = 1;
                    }
                    releases = result.data.data.repository.releases.nodes;
                    releasesCount = releases.length;
                    recent = -1;
                    for (i = 0; i < releasesCount; i++) {
                        if (releases[i] === undefined ||
                            releases[i].releaseAssets === undefined ||
                            releases[i].releaseAssets.nodes[0] === undefined)
                            continue;
                        recent = i;
                        break;
                    }
                    if (recent == -1) {
                        // No Releases With Valid Assets
                        //console.log("No Releases With Valid Assets");
                        return [2 /*return*/, totalClosedIssues / (totalClosedIssues + totalOpenIssues)];
                    }
                    recentRelease = releases[recent].releaseAssets.nodes[0].createdAt;
                    weeksDifference = calculateWeeksDifference(recentRelease);
                    recentDownloads = releases[recent].releaseAssets.nodes[0].downloadCount;
                    lastReleaseWeeklyDownloads = recentDownloads / weeksDifference;
                    maxReleaseWeeklyDownloads = lastReleaseWeeklyDownloads;
                    // Find The Max Release With Valid Assets
                    for (i = recent + 1; i < releasesCount; i++) {
                        if (releases[i] === undefined ||
                            releases[i].releaseAssets.nodes[0] === undefined)
                            continue;
                        recentRelease = releases[i].releaseAssets.nodes[0].createdAt;
                        weeksDifference = calculateWeeksDifference(recentRelease);
                        recentDownloads = releases[i].releaseAssets.nodes[0].downloadCount;
                        CurrWeeklyDownloads = recentDownloads / weeksDifference;
                        if (CurrWeeklyDownloads > maxReleaseWeeklyDownloads)
                            maxReleaseWeeklyDownloads = CurrWeeklyDownloads;
                    }
                    correctness = calcCorrectnessScore(totalClosedIssues, totalOpenIssues, maxReleaseWeeklyDownloads, lastReleaseWeeklyDownloads);
                    return [2 /*return*/, correctness];
                case 2:
                    error_1 = _a.sent();
                    // console.error("Error fetching data:", error);
                    // Handle the error or return a default value if necessary
                    return [2 /*return*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getCorrectness = getCorrectness;
function calcCorrectnessScore(totalClosedIssues, totalOpenIssues, maxReleaseWeeklyDownloads, lastReleaseWeeklyDownloads) {
    return __awaiter(this, void 0, void 0, function () {
        var correctness;
        return __generator(this, function (_a) {
            correctness = 0.5 * (totalClosedIssues / (totalOpenIssues + totalClosedIssues)) +
                0.5 * (lastReleaseWeeklyDownloads / maxReleaseWeeklyDownloads);
            return [2 /*return*/, correctness];
        });
    });
}
exports.calcCorrectnessScore = calcCorrectnessScore;
function calculateWeeksDifference(timestamp) {
    // Convert the timestamp to a JavaScript Date object
    var startTime = new Date(timestamp);
    // Check if the provided timestamp is a valid date
    if (isNaN(startTime.getTime())) {
        //console.error("Invalid timestamp format");
        return -1;
    }
    // Get the current time
    var currentTime = new Date();
    // Calculate the time difference in milliseconds
    var timeDifferenceMs = currentTime.getTime() - startTime.getTime();
    // Convert the time difference to weeks
    var weeksDifference = timeDifferenceMs / (1000 * 60 * 60 * 24 * 7);
    return weeksDifference;
}
exports.calculateWeeksDifference = calculateWeeksDifference;
