
import { SpecLine } from "./specLine.js";
import { LineConverter } from "./lineConverter.js";

export abstract class SpecBlock {
    
    abstract toHtml(lineConverter: LineConverter): string;
}

export class LineBlock extends SpecBlock {
    line: SpecLine;
    
    constructor(line: SpecLine) {
        super();
        this.line = line;
    }
    
    toHtml(lineConverter: LineConverter): string {
        return lineConverter.convertLine(this.line);
    }
}

export class ListBlock extends SpecBlock {
    lines: SpecLine[];
    
    constructor() {
        super();
        this.lines = [];
    }
    
    toHtml(lineConverter: LineConverter): string {
        const htmlList = this.lines.map((line) => lineConverter.convertLine(line));
        return `<ul>\n${htmlList.join("\n")}\n</ul>`;
    }
}

export class IndentationBlock extends SpecBlock {
    indentation: number;
    blocks: SpecBlock[];
    
    constructor(indentation: number) {
        super();
        this.indentation = indentation;
        this.blocks = [];
    }
    
    toHtml(lineConverter: LineConverter): string {
        const htmlList = this.blocks.map((block) => block.toHtml(lineConverter));
        return `<div style="margin-left: ${this.indentation * 25}px;">\n${htmlList.join("\n")}\n</div>`;
    }
}


