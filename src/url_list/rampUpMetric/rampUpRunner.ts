import * as path from "path";
import * as git from "isomorphic-git";
import * as http from "isomorphic-git/http/node";
import * as fs from "fs";
import { countLines } from "./countLines";
import { calcRampUpScore } from "./calcRampUpScore";

async function getRampUpScore(url: [string, string]): Promise<number> {
  try {
    const dir = path.join(process.cwd(), `/rampup_repos/${url[0]}/${url[1]}`);
    await fs.rmSync(dir, { recursive: true, force: true }); //clear dir
    await fs.mkdirSync(dir, { recursive: true }); //create dir
    await git.clone({
      fs,
      http,
      dir,
      corsProxy: "https://cors.isomorphic-git.org",
      url: `https://github.com/${url[0]}/${url[1]}`,
      singleBranch: true,
      depth: 10,
    });
    const fileList = (await fs.readdirSync(dir, {
      recursive: true,
    })) as string[];
    const mdList = fileList.filter((filename: string) => {
      return filename.endsWith(".md");
    });
    const jsList = fileList.filter((filename: string) => {
      return filename.endsWith(".js");
    });
    const linesMD = await Promise.all(
      mdList.map(async (filename: string): Promise<number> => {
        return await countLines(path.join(dir, filename));
      })
    ).then((lines) => lines.reduce((a, b) => a + b, 0));
    const linesJS = await Promise.all(
      jsList.map(async (filename: string): Promise<number> => {
        return await countLines(path.join(dir, filename));
      })
    ).then((lines) => lines.reduce((a, b) => a + b, 0));

    fs.rmSync(dir, { recursive: true, force: true }); //clean up dir
    return calcRampUpScore(linesMD, linesJS);
  } catch (err) {
    console.error(err);
    return 0;
  }
}

export { getRampUpScore };
