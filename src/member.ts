
import { DataType } from "./dataType.js";

export abstract class Member {
    name: string;
    type: DataType;
    
    constructor(name: string, type: DataType) {
        this.name = name;
        this.type = type;
    }
}

export abstract class ArgMember extends Member {
    
}

export class InstructionArg extends ArgMember {
    
}

export class FunctionArg extends ArgMember {
    
}


