
import * as fs from "fs";
import * as pathUtils from "path";
import { templateFilePath, instructionsFilePath } from "./constants.js";
import { Category, Instruction, Argument } from "./instructionClasses.js";

export const readTemplateText = (): string => (
    fs.readFileSync(templateFilePath, "utf8")
);

export const readInstructionsText = (): string => (
    fs.readFileSync(instructionsFilePath, "utf8")
);

export const splitEqualityStatement = (statement: string): string[] => {
    const textList = statement.split("=");
    return textList.map((text) => text.trim());
};

export const parseInstructions = (instructionsText: string): Category[] => {
    const output: Category[] = [];
    let currentCategory = null;
    let currentInstruction = null;
    const lines = instructionsText.split("\n");
    for (const line of lines) {
        if (line.length <= 0) {
            continue;
        }
        const character = line.charAt(0);
        const text = line.substring(2, line.length);
        if (character === "!") {
            currentCategory = new Category(text);
            output.push(currentCategory);
        }
        if (character === "$") {
            let [name, opcodeText] = splitEqualityStatement(text);
            opcodeText = opcodeText.substring(2, opcodeText.length);
            const opcode = parseInt(opcodeText, 16);
            currentInstruction = new Instruction(name, opcode);
            currentCategory.instructions.push(currentInstruction);
        }
        if (character === "#") {
            currentInstruction.description = text;
        }
        if (character === ">") {
            const [name, description] = splitEqualityStatement(text);
            const argument = new Argument(name, description);
            currentInstruction.arguments.push(argument);
        }
        if (character === "*") {
            currentInstruction.notes.push(text);
        }
    }
    return output;
};

export const populateTemplatePlaceholders = (
    templateText: string,
    instructionsHtml: string,
): string => {
    let output = templateText;
    const date = new Date();
    output = output.replace("{TIMESTAMP}", date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
    }));
    output = output.replace("{INSTRUCTIONS}", instructionsHtml);
    return output;
};

export const formatHtmlStyle = (documentHtml: string): string => {
    const oldList = documentHtml.split("`");
    const newList = [];
    oldList.forEach((text, index) => {
        if (index > 0) {
            if (index % 2 == 1) {
                newList.push(`<span class="code">`);
            } else {
                newList.push(`</span>`);
            }
        }
        newList.push(text);
    });
    return newList.join("");
};

// Returns the paths of the documentation files.
export const generateDocumentationFiles = (directoryPath: string): string[] => {
    const templateText = readTemplateText();
    const instructionsText = readInstructionsText();
    const categories = parseInstructions(instructionsText);
    const instructionsHtml = categories.map((category) => category.toHtml()).join("\n");
    let documentHtml = populateTemplatePlaceholders(templateText, instructionsHtml);
    documentHtml = formatHtmlStyle(documentHtml);
    const instructionsJson = categories.map((category) => category.toJson());
    const documentHtmlPath = pathUtils.join(directoryPath, "bytecode.html");
    const instructionsJsonPath = pathUtils.join(directoryPath, "bytecodeInstructions.json");
    fs.writeFileSync(documentHtmlPath, documentHtml);
    fs.writeFileSync(instructionsJsonPath, JSON.stringify(instructionsJson));
    return [documentHtmlPath, instructionsJsonPath];
};


