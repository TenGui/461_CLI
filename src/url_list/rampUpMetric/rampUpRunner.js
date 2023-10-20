"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRampUpScore = void 0;
const path = require("path");
const git = require("isomorphic-git");
const http = require("isomorphic-git/http/node");
const fs = require("fs");
const rampUpUtils_1 = require("./rampUpUtils");
const calcRampUpScore_1 = require("./calcRampUpScore");
async function getRampUpScore(url) {
    try {
        const dir = path.join(process.cwd(), `/rampup_repos/${url[0]}/${url[1]}`);
        await fs.rmSync(dir, { recursive: true, force: true });
        await fs.mkdirSync(dir, { recursive: true });
        await Promise.any([
            git.clone({
                fs,
                http,
                dir: path.join(dir, "/mainrepo"),
                corsProxy: "https://cors.isomorphic-git.org",
                url: `https://github.com/${url[0]}/${url[1]}`,
            }),
            new Promise((resolve) => setTimeout(resolve, 8000)),
        ]);
        const fileList = (await fs.readdirSync(dir, {
            recursive: true,
        }));
        const mdList = (0, rampUpUtils_1.getFileWithEnd)(".md", fileList);
        const jsList = (0, rampUpUtils_1.getFileWithEnd)(".js", fileList);
        const linesMD = await (0, rampUpUtils_1.sumLines)(dir, mdList);
        const linesJS = await (0, rampUpUtils_1.sumLines)(dir, jsList);
        return (0, calcRampUpScore_1.calcRampUpScore)(linesMD, linesJS);
    }
    catch (err) {
        return 0;
    }
}
exports.getRampUpScore = getRampUpScore;
