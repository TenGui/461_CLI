"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sumLines = exports.getFileWithEnd = exports.countLines = void 0;
const fs = require("fs");
const path = require("path");
async function countLines(dir) {
    const data = fs.readFileSync(dir);
    const lines = data.toString().split("\n").length;
    return lines;
}
exports.countLines = countLines;
function getFileWithEnd(postfix, fileList) {
    const filteredList = fileList.filter((filename) => {
        return filename.endsWith(postfix);
    });
    return filteredList;
}
exports.getFileWithEnd = getFileWithEnd;
async function sumLines(dir, fileList) {
    const lines = await Promise.all(fileList.map(async (filename) => {
        return await countLines(path.join(dir, filename));
    })).then((lines) => lines.reduce((a, b) => a + b, 0));
    return lines;
}
exports.sumLines = sumLines;
