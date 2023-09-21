import * as path from "path";
import * as git from "isomorphic-git";
import * as http from "isomorphic-git/http/node";
import * as fs from "fs";
import { getFileWithEnd, sumLines } from "./rampUpUtils";
import { calcRampUpScore } from "./calcRampUpScore";

async function getRampUpScore(url: [string, string]): Promise<number> {
  try {
    const dir = path.join(process.cwd(), `/rampup_repos/${url[0]}/${url[1]}`);
    await fs.rmSync(dir, { recursive: true, force: true }); //clear dir
    await fs.mkdirSync(dir, { recursive: true }); //create dir
    await git.clone({
      fs,
      http,
      dir: path.join(dir, "/mainrepo"),
      corsProxy: "https://cors.isomorphic-git.org",
      url: `https://github.com/${url[0]}/${url[1]}`,
    });
    const fileList = (await fs.readdirSync(dir, {
      recursive: true,
    })) as string[];
    const mdList = getFileWithEnd(".md", fileList);
    const jsList = getFileWithEnd(".js", fileList);
    const linesMD = await sumLines(dir, mdList);
    const linesJS = await sumLines(dir, jsList);

    fs.rmSync(dir, { recursive: true, force: true }); //clean up dir
    return calcRampUpScore(linesMD, linesJS);
  } catch (err) {
    console.error(err);
    return 0;
  }
}

export { getRampUpScore };
