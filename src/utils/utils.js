"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetDetailsFromNPM = exports.get_urls = exports.parseFromGitLink = void 0;
const fs = require("fs");
const path = require("path");
function parseFromGitLink(url) {
    const username = url.split("/")[3];
    const repo = url.split("/")[4];
    return [username, repo];
}
exports.parseFromGitLink = parseFromGitLink;
function get_urls(filepath) {
    try {
        const filedata = fs.readFileSync(filepath, "utf-8");
        return filedata.split("\n").filter(Boolean);
    }
    catch {
        console.log("Error reading: " + fullpath);
        process.exit(-1);
    }
}
exports.get_urls = get_urls;
async function GetDetailsFromNPM(url) {
    const packagename = url.split("/").pop();
    const data = await fetch(`https://registry.npmjs.org/${packagename}`)
        .then((res) => res.json())
        .then((data) => data.repository.url);
    const datasplit = data.split("/");
    const repo = datasplit.pop().split(".")[0];
    return [datasplit.pop(), repo];
}
exports.GetDetailsFromNPM = GetDetailsFromNPM;
