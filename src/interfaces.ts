
export interface ArgumentJson {
    name: string;
    description: string;
}

export interface InstructionJson {
    name: string;
    opcode: number;
    description: string;
    argumentList: ArgumentJson[];
    noteList: string[];
}

export interface CategoryJson {
    name: string;
    instructionList: InstructionJson[];
}


