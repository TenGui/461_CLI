"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_version_pin_score = void 0;
const axios_1 = require("axios");
async function get_version_pin_score(url) {
    const FILE_PATH = '/main/package.json';
    const apiUrl = 'https://raw.githubusercontent.com/' + url[0] + '/' + url[1] + FILE_PATH;
    return new Promise((resolve, reject) => {
        axios_1.default.get(apiUrl)
            .then((response) => {
            if (response.status === 200) {
                const packageJson = response.data;
                const fullPinnedEX = /^[0-9]*\.[0-9]*\.[0-9]*/;
                const majorMinorEX = /^[0-9]*\.[0-9]*\.[0-9]*/;
                let count = 0;
                let fullPinned = 0;
                let majorMinor = 0;
                for (const i in packageJson.dependencies) {
                    let curVer = packageJson.dependencies[i];
                    count += 1;
                    if (fullPinnedEX.test(curVer))
                        fullPinned += 1;
                    if (majorMinorEX.test(curVer))
                        majorMinor += 1;
                }
                let score;
                let correctlyPinned = (majorMinor + fullPinned);
                if (count == 0)
                    score = 1;
                else
                    score = correctlyPinned / count;
                score = Math.trunc(score * 1000) / 1000;
                resolve(score);
            }
            else {
                console.error('Failed to fetch package.json');
                reject(-1);
            }
        })
            .catch((error) => {
            console.error('Error fetching package.json:', error);
            reject(-1);
        });
    });
}
exports.get_version_pin_score = get_version_pin_score;
