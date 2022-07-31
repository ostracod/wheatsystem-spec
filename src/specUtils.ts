
import { SpecLine, DefinitionLine, IdLine, MemberLine, TitleLine, DescriptionLine, BulletLine } from "./specLine.js";
import { DataType, IntegerType, PointerType, ArrayType, FileHandleType, AppHandleType } from "./dataType.js";
import { SpecBlock, LineBlock, ListBlock } from "./specBlock.js";

const indentationText = "    ";
const typeCreatorMap: { [name: string]: () => DataType } = {
    any: () => new DataType(),
    sInt: () => new IntegerType(true),
    sInt8: () => new IntegerType(true, 8),
    sInt32: () => new IntegerType(true, 32),
    fileHandle: () => new FileHandleType(),
    appHandle: () => new AppHandleType(),
};

export const convertNumberToHexadecimal = (value: number, length = 2): string => {
    let text = value.toString(16).toUpperCase();
    while (text.length < length) {
        text = "0" + text;
    }
    return "0x" + text;
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

export const parseDataType = (text: string): DataType => {
    const terms = text.split(" ");
    let index = terms.length - 1;
    const lastTerm = terms[index];
    const typeCreator = typeCreatorMap[lastTerm];
    let dataType: DataType | null;
    if (typeof typeCreator === "undefined") {
        dataType = null;
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

export const measureIndentation = (text: string): number => {
    let startIndex = 0;
    let output = 0;
    while (true) {
        const endIndex = startIndex + indentationText.length;
        if (endIndex > text.length
                || text.substring(startIndex, endIndex) !== indentationText) {
            break;
        }
        startIndex = endIndex;
        output += 1;
    }
    return output;
};

export const parseSpecLines = (specText: string): SpecLine[] => {
    const output: SpecLine[] = [];
    let currentDefinitionLine = null;
    const lines = specText.split("\n");
    for (const untrimmedLine of lines) {
        const line = untrimmedLine.trim();
        if (line.length < 2) {
            continue;
        }
        const indentation = measureIndentation(untrimmedLine);
        const character = line.charAt(0);
        const text = line.substring(2, line.length);
        let specLine: SpecLine;
        if (character === "!") {
            specLine = new TitleLine(text);
        } else if (character === "#") {
            specLine = new DescriptionLine(text);
        } else if (character === "*") {
            specLine = new BulletLine(text);
        } else if (character === "@") {
            specLine = new IdLine(currentDefinitionLine);
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
            currentDefinitionLine = new DefinitionLine(name, id);
            specLine = currentDefinitionLine;
        } else if (character === ">") {
            let type: DataType | null;
            let statement: string;
            if (text.startsWith("(")) {
                const index = text.indexOf(")");
                const typeText = text.substring(1, index);
                type = parseDataType(typeText);
                statement = text.substring(index + 1, text.length).trim();
            } else {
                type = null;
                statement = text;
            }
            const [name, description] = splitEqualityStatement(statement);
            const memberLine = new MemberLine(name, type, description);
            currentDefinitionLine.memberLines.push(memberLine);
            specLine = memberLine;
        } else {
            throw new Error(`Unknown line prefix "${character}".`);
        }
        specLine.indentation = indentation;
        output.push(specLine);
    }
    return output;
};

export const groupLinesByIndentation = (specLines: SpecLine[]): SpecLine[][] => {
    const output: SpecLine[][] = [];
    let currentGroup: SpecLine[] = [];
    let currentIndentation = -1;
    for (const specLine of specLines) {
        const { indentation } = specLine;
        if (indentation === currentIndentation) {
            currentGroup.push(specLine);
        } else {
            currentGroup = [specLine];
            output.push(currentGroup);
            currentIndentation = indentation;
        }
    }
    return output;
};

export const convertLinesToBlocks = (specLines: SpecLine[]): SpecBlock[] => {
    const output: SpecBlock[] = [];
    let currentList: ListBlock | null = null;
    for (const specLine of specLines) {
        if (specLine.isListItem()) {
            if (currentList === null) {
                currentList = new ListBlock();
                output.push(currentList);
            }
            currentList.lines.push(specLine);
        } else {
            output.push(new LineBlock(specLine));
            currentList = null;
        }
    }
    return output;
}

export const populateTemplatePlaceholders = (
    templateText: string,
    htmlMap: { [name: string]: string },
): string => {
    let output = templateText;
    const date = new Date();
    output = output.replace("{timestamp}", date.toLocaleDateString("en-US", {
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


