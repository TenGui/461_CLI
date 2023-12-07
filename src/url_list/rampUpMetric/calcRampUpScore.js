"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcRampUpScore = void 0;
function calcRampUpScore(linesMD, linesJS) {
    if (linesJS <= 0) {
        return 0;
    }
    var denom = 1 + Math.exp((-5 * linesMD) / linesJS);
    var res = 2 / denom - 1;
    return res;
}
exports.calcRampUpScore = calcRampUpScore;
