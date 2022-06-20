
import { CategoryJson, InstructionJson, ArgumentJson } from "./interfaces.js";

export class Category {
    name: string;
    instructions: Instruction[];
    
    constructor(name: string) {
        this.name = name;
        this.instructions = [];
    }
    
    toJson(): CategoryJson {
        return {
            name: this.name,
            instructionList: this.instructions.map((instruction) => instruction.toJson()),
        };
    }
    
    toHtml(): string {
        const htmlList = this.instructions.map((instruction) => instruction.toHtml())
        return `<p class="title2">${this.name}</p>
${htmlList.join("\n")}`;
    }
}

export class Instruction {
    name: string;
    opcode: number;
    description: string;
    arguments: Argument[];
    notes: string[];
    
    constructor(name: string, opcode: number) {
        this.name = name;
        this.opcode = opcode;
        this.description = null;
        this.arguments = [];
        this.notes = [];
    }
    
    toJson(): InstructionJson {
        return {
            name: this.name,
            opcode: this.opcode,
            description: this.description,
            argumentList: this.arguments.map((argument) => argument.toJson()),
            noteList: this.notes,
        };
    }
    
    toHtml(): string {
        let opcodeText = this.opcode.toString(16).toUpperCase();
        while (opcodeText.length < 2) {
            opcodeText = "0" + opcodeText;
        }
        opcodeText = "0x" + opcodeText;
        const names = this.arguments.map((argument) => argument.name)
        const htmlList = this.arguments.map((argument) => argument.toHtml())
        for (const note of this.notes) {
            htmlList.push(`<li>${note}</li>`);
        }
        return `<p><span class="code">${this.name} ${names.join(", ")}</span></p>
<div class="description">
    <p>${this.description}</p>
    <ul>
        <li><span class="code">${this.name}</span> opcode = <span class="code">${opcodeText}</span></li>
${htmlList.join("\n")}
    </ul>
</div>`;
    }
}

export class Argument {
    name: string;
    description: string;
    
    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }
    
    toJson(): ArgumentJson {
        return {
            name: this.name,
            description: this.description,
        };
    }
    
    toHtml(): string {
        return `<li><span class="code">${this.name}</span> = ${this.description}</span></li>`;
    }
}


