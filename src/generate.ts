
import { projectDirectoryPath } from "./constants.js";
import * as specUtils from "./specUtils.js";

console.log("Generating documentation...");

const documentationPaths = specUtils.generateDocumentationFiles(projectDirectoryPath);

console.log("Finished. Documentation file paths:");
documentationPaths.forEach((path) => {
    console.log(path);
});


