
export abstract class SpecLine {
    
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

export class MemberLine extends SpecLine {
    name: string;
    type: string | null;
    description: string | null;
    
    constructor(name: string, type: string | null, description: string | null) {
        super();
        this.name = name;
        this.type = type;
        this.description = description;
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
    
}

export class DescriptionLine extends TextLine {
    
}

export class BulletLine extends TextLine {
    
}


