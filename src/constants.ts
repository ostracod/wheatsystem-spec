
import * as pathUtils from "path";
import { fileURLToPath } from "url";

const currentDirectoryPath = pathUtils.dirname(fileURLToPath(import.meta.url));
export const projectDirectoryPath = pathUtils.dirname(currentDirectoryPath);


