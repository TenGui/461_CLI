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
exports.getScore = exports.getBusFactorScore = void 0;
function getBusFactorScore(RateLimiter, url) {
    return __awaiter(this, void 0, void 0, function () {
        var keycontributor, contributorResponse, totalcontribution, _i, contributorResponse_1, contributor, currentcontribution, _a, contributorResponse_2, contributor, busFactor, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    keycontributor = [];
                    return [4 /*yield*/, RateLimiter.getGitHubInfo(url + "/contributors")];
                case 1:
                    contributorResponse = _c.sent();
                    totalcontribution = 0;
                    for (_i = 0, contributorResponse_1 = contributorResponse; _i < contributorResponse_1.length; _i++) {
                        contributor = contributorResponse_1[_i];
                        totalcontribution += contributor.contributions;
                    }
                    currentcontribution = 0;
                    for (_a = 0, contributorResponse_2 = contributorResponse; _a < contributorResponse_2.length; _a++) {
                        contributor = contributorResponse_2[_a];
                        if (currentcontribution >= Math.floor(totalcontribution / 2))
                            break;
                        currentcontribution += contributor.contributions;
                        keycontributor.push(contributor.login);
                    }
                    busFactor = getScore(keycontributor.length);
                    return [2 /*return*/, busFactor];
                case 2:
                    _b = _c.sent();
                    return [2 /*return*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getBusFactorScore = getBusFactorScore;
function getScore(keycontributor) {
    var e = 2.71828;
    if (keycontributor == 0)
        return 0;
    var busFactorScore = (1 - Math.pow(e, (1.8 * (-keycontributor + 1)))) / (1 + Math.pow(e, (-keycontributor + 1)));
    return Number(busFactorScore.toFixed(5));
}
exports.getScore = getScore;
