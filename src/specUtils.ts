
import * as fs from "fs";
import * as pathUtils from "path";
import { projectDirectoryPath } from "./constants.js";
import { SpecLine, DefinitionLine, MemberLine, TitleLine, DescriptionLine, BulletLine } from "./specLine.js";
import { DataType, IntegerType, PointerType, ArrayType, FileHandleType, AppHandleType } from "./dataType.js";
import { InstructionDefinition } from "./definition.js";
import { InstructionArg } from "./member.js";

const typeCreatorMap: { [name: string]: () => DataType } = {
    any: () => new DataType(),
    sInt: () => new IntegerType(true),
    sInt8: () => new IntegerType(true, 8),
    sInt32: () => new IntegerType(true, 32),
    fileHandle: () => new FileHandleType(),
    appHandle: () => new AppHandleType(),
};
const specTextMap: { [name: string]: string } = {};

export const getSpecText = (name: string): string => {
    if (name in specTextMap) {
        return specTextMap[name];
    } else {
        const specPath = pathUtils.join(projectDirectoryPath, name + ".txt");
        const specText = fs.readFileSync(specPath, "utf8");
        specTextMap[name] = specText;
        return specText;
    }
};

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

export const parseDataType = (text: string): DataType => {
    const terms = text.split(" ");
    let index = terms.length - 1;
    const lastTerm = terms[index];
    const typeCreator = typeCreatorMap[lastTerm];
    let dataType: DataType;
    if (typeof typeCreator === "undefined") {
        dataType = new DataType();
    } else {
        dataType = typeCreator();
        index -= 1;
    }
    while (index >= 0) {
        const term = terms[index];
        index -= 1;
        if (term === "const") {
            dataType.isConstant = true;
        } else if (term === "ptr") {
            dataType = new PointerType(dataType);
        } else if (term === "array") {
            dataType = new ArrayType(dataType);
        } else if (term.startsWith("array[")) {
            if (!term.endsWith("]")) {
                throw new Error(`Malformed array type "${term}".`);
            }
            const lengthText = term.substring(6, term.length - 1);
            const length = parseInt(lengthText, 10);
            if (Number.isNaN(length)) {
                throw new Error(`"${lengthText}" is not a valid array length.`);
            }
            dataType = new ArrayType(dataType, length);
        } else {
            throw new Error(`Unknown data type "${term}".`);
        }
    }
    return dataType;
};

export const createInstructionDefinition = (
    definitionLine: DefinitionLine,
): InstructionDefinition => {
    const definitionName = definitionLine.name;
    const args = definitionLine.memberLines.map((memberLine) => {
        const { name: argName, type: typeText } = memberLine;
        if (typeText === null) {
            throw new Error(`"${argName}" argument of "${definitionName}" instruction is missing data type.`);
        }
        const dataType = parseDataType(typeText);
        return new InstructionArg(argName, dataType);
    });
    return new InstructionDefinition(definitionName, definitionLine.id, args);
}

export const createInstructionDefinitions = (
    specLines: SpecLine[],
): InstructionDefinition[] => {
    const definitionLines = specLines.filter(
        (specLine) => specLine instanceof DefinitionLine,
    ) as DefinitionLine[];
    return definitionLines.map(
        (definitionLine) => createInstructionDefinition(definitionLine),
    );
}

export const populateTemplatePlaceholders = (
    templateText: string,
    htmlMap: { [name: string]: string },
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
    for (const name in htmlMap) {
        output = output.replace(`{${name}}`, htmlMap[name]);
    }
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
    const templatePath = pathUtils.join(projectDirectoryPath, "bytecodeTemplate.html");
    const templateText = fs.readFileSync(templatePath, "utf8");
    const instructionsText = getSpecText("instructions");
    const specLines = parseSpecLines(instructionsText);
    const instructionsHtml = "TODO: Generate instructions HTML.";
    let documentHtml = populateTemplatePlaceholders(templateText, {
        INSTRUCTIONS: instructionsHtml
    });
    documentHtml = formatHtmlStyle(documentHtml);
    const documentHtmlPath = pathUtils.join(directoryPath, "bytecode.html");
    fs.writeFileSync(documentHtmlPath, documentHtml);
    return [documentHtmlPath];
};


