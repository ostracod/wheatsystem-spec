
import { DataType } from "./dataType.js";

export abstract class SpecLine {
    
    isListItem(): boolean {
        return false;
    }
    
    toHtml(): string {
        throw new Error("toHtml is not implemented for this class.");
    }
}

export class DefinitionLine extends SpecLine {
    name: string;
    id: number | null;
    memberLines: MemberLine[];
    
    constructor(name: string, id: number | null) {
        super();
        this.name = name;
        this.id = id;
        this.memberLines = [];
    }
}

export class IdLine extends SpecLine {
    definitionLine: DefinitionLine;
    
    constructor(definitionLine: DefinitionLine) {
        super();
        this.definitionLine = definitionLine;
    }
    
    isListItem(): boolean {
        return true;
    }
}

export class MemberLine extends SpecLine {
    name: string;
    type: DataType | null;
    description: string | null;
    
    constructor(name: string, type: DataType | null, description: string | null) {
        super();
        this.name = name;
        this.type = type;
        this.description = description;
    }
    
    isListItem(): boolean {
        return true;
    }
    
    toHtml(): string {
        let text = `<span class="code">${this.name}</span>`;
        if (this.description !== null) {
            text += " = " + this.description
        }
        if (this.type !== null) {
            text += ` (${this.type.toFriendlyString(false)})`;
        }
        return `<li>${text}</li>`;
    }
}

export abstract class TextLine extends SpecLine {
    text: string;
    
    constructor(text: string) {
        super();
        this.text = text;
    }
}

export class TitleLine extends TextLine {
    
    toHtml(): string {
        return `<p class="title2">${this.text}</p>`;
    }
}

export class DescriptionLine extends TextLine {
    
    toHtml(): string {
        return `<p>${this.text}</p>`;
    }
}

export class BulletLine extends TextLine {
    
    toHtml(): string {
        return `<li>${this.text}</li>`;
    }
    
    isListItem(): boolean {
        return true;
    }
}


