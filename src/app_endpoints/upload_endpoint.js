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
exports.Upload = void 0;
var utils_1 = require("../utils/utils");
var fs = require("fs");
var Octokit = require("@octokit/rest").Octokit;
var database_connect_1 = require("../database_files/database_connect");
var unzipper = require("unzipper");
var Upload = /** @class */ (function () {
    function Upload() {
        this.owner = "";
        this.repo = "";
        this.url = "";
        this.response = {};
    }
    Upload.prototype.check_valid_githubURL = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var GitHub_Info, owner, repo, octokit, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        GitHub_Info = (0, utils_1.parseFromGitLink)(url);
                        owner = GitHub_Info[0];
                        repo = GitHub_Info[1];
                        octokit = new Octokit({
                            auth: process.env.GITHUB_TOKEN // Put your GitHub token here
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, octokit.repos.get({
                                owner: owner,
                                repo: repo,
                            })];
                    case 2:
                        response = _a.sent();
                        this.owner = owner;
                        this.repo = repo;
                        this.url = url;
                        this.response = response;
                        console.log("Repository ".concat(owner, "/").concat(repo, " exists."));
                        return [2 /*return*/, true];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Error checking repository: ".concat(error_1.message));
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Upload.prototype.get_githubURL_data = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log(this.response);
                return [2 /*return*/];
            });
        });
    };
    Upload.prototype.check_Package_Existence = function (name, version) {
        return __awaiter(this, void 0, void 0, function () {
            var rows, countExists, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, database_connect_1.promisePool.query('SELECT COUNT(*) AS count_exists FROM PackageMetadata WHERE Name = ? AND Version = ?', [name, version])];
                    case 1:
                        rows = (_a.sent())[0];
                        countExists = rows[0].count_exists;
                        return [2 /*return*/, countExists > 0];
                    case 2:
                        error_2 = _a.sent();
                        console.error('Error checking package existence:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Upload.prototype.decompress_zip_to_github_link = function (base64) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var base64String = base64;
                        var buffer = Buffer.from(base64String, 'base64');
                        var readableStream = require('stream').Readable.from(buffer);
                        var cleaned_github_link = "";
                        readableStream.pipe(unzipper.Parse())
                            .on('entry', function (entry) {
                            if (entry.path.endsWith("package.json")) {
                                console.log('Found package.json in the ZIP file.');
                                var contentStream = fs.createWriteStream('zip_file_package.json');
                                entry.pipe(contentStream);
                                contentStream.on('finish', function () {
                                    // Parse the JSON content
                                    fs.readFile("zip_file_package.json", 'utf-8', function (err, data) {
                                        if (err) {
                                            reject(err);
                                            return;
                                        }
                                        try {
                                            var parsedContent = JSON.parse(data);
                                            if (parsedContent && parsedContent['repository']) {
                                                var github_link = parsedContent['repository'].url;
                                                cleaned_github_link = "https://" + github_link.substring(6, github_link.length - 4);
                                                console.log("Extracted github repo link from ZIP file: ", cleaned_github_link);
                                            }
                                            console.log('base64 ZIP file decoded.');
                                            if (cleaned_github_link) {
                                                resolve(cleaned_github_link);
                                            }
                                            else {
                                                reject(new Error('GitHub link not found in the ZIP file.'));
                                            }
                                        }
                                        catch (error) {
                                            console.error('Error parsing JSON content:', error);
                                            reject(error);
                                        }
                                    });
                                });
                            }
                            else {
                                entry.autodrain();
                            }
                        })
                            .on('error', function (err) {
                            console.error('Error checking base64 encoded zip file:', err);
                            resolve("");
                        })
                            .on('finish', function () {
                            resolve(cleaned_github_link);

                        });
                    })];
            });
        });
    };
    Upload.prototype.process = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var githubUrlRegex, match, extractedString, output;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        githubUrlRegex = /github\.com\/(.+)/;
                        match = url.match(githubUrlRegex);
                        if (match) {
                            extractedString = match[1];
                            url = "https://github.com/".concat(extractedString);
                        }
                        else {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, this.check_valid_githubURL(url)];
                    case 1:
                        output = _a.sent();
                        if (!output) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, { "owner": this.owner, "repo": this.repo, "url": this.url }];
                }
            });
        });
    };
    return Upload;
}());
exports.Upload = Upload;
// const a = new Upload()
// a.process("https://github.com/davisjam/safe-regex")
