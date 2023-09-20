import * as fs from "fs";

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

async function sumLines(fileList: string[]): Promise<number> {
  const lines = await Promise.all(
    fileList.map(async (filename: string): Promise<number> => {
      return await countLines(filename);
    })
  ).then((lines) => lines.reduce((a, b) => a + b, 0));
  return lines;
}

export { countLines, getFileWithEnd, sumLines };
