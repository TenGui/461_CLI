import * as fs from "fs";
import * as path from "path";

export async function countLines(dir: string): Promise<number> {
  const data = fs.readFileSync(dir);
  const lines = data.toString().split("\n").length;
  return lines;
}
