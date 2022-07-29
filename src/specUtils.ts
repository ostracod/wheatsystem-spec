
import * as fs from "fs";
import * as pathUtils from "path";
import { templateFilePath, instructionsFilePath } from "./constants.js";
import { SpecLine, DefinitionLine, MemberLine, TitleLine, DescriptionLine, BulletLine } from "./specLine.js";

export const readTemplateText = (): string => (
    fs.readFileSync(templateFilePath, "utf8")
);

export const readInstructionsText = (): string => (
    fs.readFileSync(instructionsFilePath, "utf8")
);

export const splitEqualityStatement = (statement: string): [string, string | null] => {
    const index = statement.indexOf("=");
    if (index < 0) {
        return [statement, null];
    } else {
        return [
            statement.substring(0, index).trim(),
            statement.substring(index + 1, statement.length).trim(),
        ];
    }
};

export const parseSpecLines = (specText: string): SpecLine[] => {
    const output: SpecLine[] = [];
    let definitionLine = null;
    const lines = specText.split("\n");
    for (const line of lines) {
        if (line.length < 2) {
            continue;
        }
        const character = line.charAt(0);
        const text = line.substring(2, line.length);
        if (character === "!") {
            output.push(new TitleLine(text));
        } else if (character === "#") {
            output.push(new DescriptionLine(text));
        } else if (character === "*") {
            output.push(new BulletLine(text));
        } else if (character === "$") {
            const [name, idText] = splitEqualityStatement(text);
            let id: number | null;
            if (idText === null) {
                id = null;
            } else if (idText.startsWith("0x")) {
                id = parseInt(idText.substring(2, idText.length), 16);
            } else {
                id = parseInt(idText, 10);
            }
            definitionLine = new DefinitionLine(name, id);
            output.push(definitionLine);
        } else if (character === ">") {
            let type: string;
            let statement: string;
            if (text.startsWith("(")) {
                const index = text.indexOf(")");
                type = text.substring(1, index);
                statement = text.substring(index + 1, text.length).trim();
            } else {
                type = null;
                statement = text;
            }
            const [name, description] = splitEqualityStatement(statement);
            const memberLine = new MemberLine(name, type, description);
            definitionLine.memberLines.push(memberLine);
            output.push(memberLine);
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
    const specLines = parseSpecLines(instructionsText);
    console.log(specLines);
    const instructionsHtml = "";
    let documentHtml = populateTemplatePlaceholders(templateText, instructionsHtml);
    documentHtml = formatHtmlStyle(documentHtml);
    const documentHtmlPath = pathUtils.join(directoryPath, "bytecode.html");
    fs.writeFileSync(documentHtmlPath, documentHtml);
    return [documentHtmlPath];
};


