
import { ArgMember, InstructionArg, FunctionArg } from "./member.js";

export abstract class Definition {
    name: string;
    
    constructor(name: string) {
        this.name = name;
    }
}

export class ErrorDefinition extends Definition {
    value: number;
    
    constructor(name: string, value: number) {
        super(name);
        this.value = value;
    }
}

export abstract class ArgsDefinition<T extends ArgMember> extends Definition {
    args: T[];
    
    constructor(name: string, args: T[]) {
        super(name);
        this.args = args;
    }
}

export class InstructionDefinition extends ArgsDefinition<InstructionArg> {
    opcode: number;
    
    constructor(name: string, opcode: number, args: InstructionArg[]) {
        super(name, args);
        this.opcode = opcode;
    }
}

export class FunctionDefinition extends ArgsDefinition<FunctionArg> {
    id: number;
    
    constructor(name: string, id: number, args: FunctionArg[]) {
        super(name, args);
        this.id = id;
    }
}


