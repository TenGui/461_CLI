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
exports.getPackageNameFromNpmLink = exports.npmToGitHub = exports.getGitHubRepoInfo = exports.identifyLinkType = void 0;
var axios_1 = require("axios");
function identifyLinkType(link) {
    // Regular expression pattern to match GitHub repository URLs
    var githubPattern = /^https:\/\/github\.com\/([^/]+)\/([^/]+)(\/.*)?$/;
    // Regular expression pattern to match npm package URLs with "activeTab=versions" query parameter
    var npmPattern = /^https:\/\/(www\.)?npmjs\.com\/package\/([^/?#]+)(\?.*activeTab=versions)?(\/.*)?$/;
    if (githubPattern.test(link)) {
        return 'GitHub Repository Link';
    }
    else if (npmPattern.test(link)) {
        return 'npm Package Link';
    }
    else {
        return 'Unknown Link';
    }
}
exports.identifyLinkType = identifyLinkType;
function getGitHubRepoInfo(repoLink) {
    try {
        // Regular expression to match GitHub repository URLs
        var githubRepoRegex = /github\.com[\/:]([^\/]+)\/([^\/.]+)(?:\.git)?$/;
        // Use regex to extract owner and repo name
        var match = repoLink.match(githubRepoRegex);
        if (match && match.length === 3) {
            var owner = match[1];
            var repoName = match[2];
            return { owner: owner, repoName: repoName };
        }
        else {
            throw new Error('Invalid GitHub repository URL');
        }
    }
    catch (error) {
        return {};
    }
}
exports.getGitHubRepoInfo = getGitHubRepoInfo;
function npmToGitHub(packageName) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, repositoryUrl, githubUrl;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.get("https://registry.npmjs.org/".concat(packageName))];
                case 1:
                    response = _a.sent();
                    data = response.data;
                    if (data.repository && data.repository.url) {
                        repositoryUrl = data.repository.url;
                        githubUrl = repositoryUrl.replace('git+', '');
                        if (githubUrl.endsWith('.git')) {
                            githubUrl = githubUrl.slice(0, -4); // Remove the trailing '.git' if present
                        }
                        return [2 /*return*/, githubUrl];
                    }
                    else {
                        return [2 /*return*/, '']; // Return an empty string if the repository URL is not found
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.npmToGitHub = npmToGitHub;
function getPackageNameFromNpmLink(npmLink) {
    // Regular expression to match npm package links
    var regex = /https:\/\/(www\.)?npmjs\.com\/package\/([^/]+)/;
    // Use the regex to extract the package name
    var match = npmLink.match(regex);
    if (match && match[2]) {
        return match[2];
    }
    else {
        return null;
    }
}
exports.getPackageNameFromNpmLink = getPackageNameFromNpmLink;
