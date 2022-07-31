
import * as fs from "fs";
import * as pathUtils from "path";
import { projectDirectoryPath } from "./constants.js";
import * as specUtils from "./specUtils.js";
import { instructionSpecification } from "./instances.js";

console.log("Generating documentation...");

const templatePath = pathUtils.join(projectDirectoryPath, "bytecodeTemplate.html");
const templateText = fs.readFileSync(templatePath, "utf8");
let documentHtml = specUtils.populateTemplatePlaceholders(templateText, {
    INSTRUCTIONS: instructionSpecification.toHtml()
});
documentHtml = specUtils.formatHtmlStyle(documentHtml);
const documentHtmlPath = pathUtils.join(projectDirectoryPath, "bytecode.html");
fs.writeFileSync(documentHtmlPath, documentHtml);
const documentationPaths = [documentHtmlPath];

console.log("Finished. Documentation file paths:");
documentationPaths.forEach((path) => {
    console.log(path);
});


