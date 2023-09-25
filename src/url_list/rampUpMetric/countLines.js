"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countLines = void 0;
const fs = require("fs");
async function countLines(dir) {
    const data = fs.readFileSync(dir);
    const lines = data.toString().split("\n").length;
    return lines;
}
exports.countLines = countLines;
