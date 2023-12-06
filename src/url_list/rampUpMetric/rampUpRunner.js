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
exports.getRampUpScore = void 0;
var path = require("path");
var git = require("isomorphic-git");
var http = require("isomorphic-git/http/node");
var fs = require("fs");
var rampUpUtils_1 = require("./rampUpUtils");
var calcRampUpScore_1 = require("./calcRampUpScore");
function getRampUpScore(url) {
    return __awaiter(this, void 0, void 0, function () {
        var dir, fileList, mdList, jsList, linesMD, linesJS, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    dir = path.join(process.cwd(), "/rampup_repos/".concat(url[0], "/").concat(url[1]));
                    return [4 /*yield*/, fs.rmSync(dir, { recursive: true, force: true })];
                case 1:
                    _a.sent(); //clear dir
                    return [4 /*yield*/, fs.mkdirSync(dir, { recursive: true })];
                case 2:
                    _a.sent(); //create dir
                    return [4 /*yield*/, Promise.race([
                            git.clone({
                                fs: fs,
                                http: http,
                                dir: path.join(dir, "/mainrepo"),
                                corsProxy: "https://cors.isomorphic-git.org",
                                url: "https://github.com/".concat(url[0], "/").concat(url[1]),
                            }),
                            new Promise(function (resolve) { return setTimeout(resolve, 8000); }),
                        ])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, fs.readdirSync(dir, {
                            recursive: true,
                        })];
                case 4:
                    fileList = (_a.sent());
                    mdList = (0, rampUpUtils_1.getFileWithEnd)(".md", fileList);
                    jsList = (0, rampUpUtils_1.getFileWithEnd)(".js", fileList);
                    return [4 /*yield*/, (0, rampUpUtils_1.sumLines)(dir, mdList)];
                case 5:
                    linesMD = _a.sent();
                    return [4 /*yield*/, (0, rampUpUtils_1.sumLines)(dir, jsList)];
                case 6:
                    linesJS = _a.sent();
                    return [2 /*return*/, (0, calcRampUpScore_1.calcRampUpScore)(linesMD, linesJS)];
                case 7:
                    err_1 = _a.sent();
                    return [2 /*return*/, 0];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.getRampUpScore = getRampUpScore;
