"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcRespMaintScore = void 0;
function calcRespMaintScore(issuesSolved, time) {
    if (issuesSolved <= 0 || time <= 0) {
        return 0;
    }
    var denom = 1 + Math.exp(-1 * (issuesSolved / time - 1.5));
    var res = 1 / denom;
    return res;
}
exports.calcRespMaintScore = calcRespMaintScore;
