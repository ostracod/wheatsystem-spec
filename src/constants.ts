
import * as pathUtils from "path";
import { fileURLToPath } from "url";

const currentDirectoryPath = pathUtils.dirname(fileURLToPath(import.meta.url));
export const projectDirectoryPath = pathUtils.dirname(currentDirectoryPath);

export const templateFilePath = pathUtils.join(
    projectDirectoryPath, "bytecodeTemplate.html",
);
export const instructionsFilePath = pathUtils.join(
    projectDirectoryPath, "instructions.txt",
);


