
import * as fs from "fs";
import * as pathUtils from "path";
import { projectDirectoryPath } from "./constants.js";
import * as specUtils from "./specUtils.js";
import { SpecLine, DefinitionLine } from "./specLine.js";
import { Definition, ErrorDefinition, InstructionDefinition, FunctionDefinition } from "./definition.js";
import { InstructionArg, FunctionArg } from "./member.js";
import { LineConverter, ErrorLineConverter, InstructionLineConverter, FunctionLineConverter } from "./lineConverter.js";
import { SpecBlock, IndentationBlock } from "./specBlock.js";

export abstract class Specification<T extends Definition = Definition> {
    name: string;
    lineConverter: LineConverter;
    specLines: SpecLine[] | null;
    definitions: T[] | null;
    html: string | null;
    
    constructor(name: string, lineConverter: LineConverter) {
        this.name = name;
        this.lineConverter = lineConverter;
        this.specLines = null;
        this.definitions = null;
        this.html = null;
    }
    
    createSpecLines(): SpecLine[] {
        const path = pathUtils.join(projectDirectoryPath, this.name + ".txt");
        const specText = fs.readFileSync(path, "utf8");
        return specUtils.parseSpecLines(specText);
    }
    
    getSpecLines(): SpecLine[] {
        if (this.specLines === null) {
            this.specLines = this.createSpecLines();
        }
        return this.specLines;
    }
    
    abstract createDefinition(defintionLine: DefinitionLine): T;
    
    createDefinitions(): T[] {
        const definitionLines = this.getSpecLines().filter(
            (specLine) => specLine instanceof DefinitionLine,
        ) as DefinitionLine[];
        return definitionLines.map((definitionLine) => this.createDefinition(definitionLine));
    }
    
    getDefinitions(): T[] {
        if (this.definitions === null) {
            this.definitions = this.createDefinitions();
        }
        return this.definitions;
    }
    
    createHtml(): string {
        const lineGroups = specUtils.groupLinesByIndentation(this.getSpecLines());
        const topLevelBlocks: SpecBlock[] = [];
        for (const lineGroup of lineGroups) {
            const { indentation } = lineGroup[0];
            const specBlocks = specUtils.convertLinesToBlocks(lineGroup);
            if (indentation <= 0) {
                for (const specBlock of specBlocks) {
                    topLevelBlocks.push(specBlock);
                }
            } else {
                const specBlock = new IndentationBlock(indentation, specBlocks);
                topLevelBlocks.push(specBlock);
            }
        }
        return topLevelBlocks.map((specBlock) => (
            specBlock.toHtml(this.lineConverter)
        )).join("\n");
    }
    
    toHtml(): string {
        if (this.html === null) {
            this.html = this.createHtml();
        }
        return this.html;
    }
}

export class ErrorSpecification extends Specification<ErrorDefinition> {
    
    constructor() {
        super("errors", new ErrorLineConverter());
    }
    
    createDefinition(definitionLine: DefinitionLine): ErrorDefinition {
        const { name, id } = definitionLine;
        if (id === null) {
            throw new Error(`"${name}" error is missing value.`);
        }
        return new ErrorDefinition(name, id);
    }
}

export class InstructionSpecification extends Specification<InstructionDefinition> {
    
    constructor() {
        super("instructions", new InstructionLineConverter());
    }
    
    createDefinition(definitionLine: DefinitionLine): InstructionDefinition {
        const { name: definitionName, id } = definitionLine;
        if (id === null) {
            throw new Error(`"${definitionName}" instruction is missing opcode.`);
        }
        const args = definitionLine.memberLines.map((memberLine) => {
            const { name: argName, type } = memberLine;
            if (type === null) {
                throw new Error(`"${argName}" argument of "${definitionName}" instruction is missing data type.`);
            }
            return new InstructionArg(argName, type);
        });
        return new InstructionDefinition(definitionName, id, args);
    }
}

export class FunctionSpecification extends Specification<FunctionDefinition> {
    
    constructor() {
        super("functions", new FunctionLineConverter());
    }
    
    createDefinition(definitionLine: DefinitionLine): FunctionDefinition {
        const { name: definitionName, id } = definitionLine;
        if (id === null) {
            throw new Error(`"${definitionName}" function is missing ID.`);
        }
        const args = definitionLine.memberLines.map((memberLine) => {
            const { name: argName, type } = memberLine;
            if (type === null) {
                throw new Error(`"${argName}" argument of "${definitionName}" function is missing data type.`);
            }
            return new FunctionArg(argName, type);
        });
        return new FunctionDefinition(definitionName, id, args);
    }
}


