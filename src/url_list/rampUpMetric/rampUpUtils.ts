import * as fs from "fs";
import * as path from "path";

async function countLines(dir: string): Promise<number> {
  const data = fs.readFileSync(dir);
  const lines = data.toString().split("\n").length;
  return lines;
}

function getFileWithEnd(postfix: string, fileList: string[]): string[] {
  const filteredList = fileList.filter((filename: string) => {
    return filename.endsWith(".md");
  });
  return filteredList;
}

async function sumLines(dir: string, fileList: string[]): Promise<number> {
  const lines = await Promise.all(
    fileList.map(async (filename: string): Promise<number> => {
      return await countLines(path.join(dir, filename));
    })
  ).then((lines) => lines.reduce((a, b) => a + b, 0));
  return lines;
}

export { countLines, getFileWithEnd, sumLines };
