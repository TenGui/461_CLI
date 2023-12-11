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
exports.getLicenseScore = void 0;
function getLicenseScore(RateLimiter, url) {
    return __awaiter(this, void 0, void 0, function () {
        var License, _license, find_license_regex, apiMatch, readme, content, license, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    License = "LGPL-2.1";
                    return [4 /*yield*/, RateLimiter.getGitHubInfo(url + "/license")];
                case 1:
                    _license = _b.sent();
                    find_license_regex = new RegExp('(apache-2.0)|(bsd-[2-3]-clause)|(MIT)|(lgpl-2.1)|(lgpl-3.0)|(gpl-[2-3].0)|([MIT])', 'i');
                    apiMatch = _license.license.spdx_id.match(find_license_regex);
                    if (!(_license == null || !(apiMatch))) return [3 /*break*/, 3];
                    return [4 /*yield*/, RateLimiter.getGitHubInfo(url + "/readme")];
                case 2:
                    readme = _b.sent();
                    content = Buffer.from(readme.content, "base64").toString("utf-8");
                    license = content.split("License\n")[1];
                    //const regex = / (\S+)\s+license/i;
                    console.log("License for ".concat(url, " is ").concat(license));
                    //const match = license.match(regex);
                    //console.log(`Match for ${url} was ` + match);
                    if ((find_license_regex.test(license))) {
                        return [2 /*return*/, 1];
                    }
                    else
                        return [2 /*return*/, 0];
                    return [3 /*break*/, 4];
                case 3: return [2 /*return*/, apiMatch ? 1 : 0];
                case 4: return [3 /*break*/, 6];
                case 5:
                    _a = _b.sent();
                    return [2 /*return*/, 0];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.getLicenseScore = getLicenseScore;
