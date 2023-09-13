import * as path from "path";
import * as git from "isomorphic-git";
import * as http from "isomorphic-git/http/node";
import * as fs from "fs";

const repoPath = path.resolve(process.cwd(), "temp");
