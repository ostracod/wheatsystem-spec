
export class DataType {
    isConstant: boolean;
    
    constructor() {
        this.isConstant = false;
    }
}

export class IntegerType extends DataType {
    isSigned: boolean | null;
    bitAmount: number | null;
    
    constructor(isSigned: boolean | null = null, bitAmount: number | null = null) {
        super();
        this.isSigned = isSigned;
        this.bitAmount = bitAmount;
    }
}

export class PointerType extends IntegerType {
    elementType: DataType;
    
    constructor(elementType: DataType) {
        super(true, 32);
        this.elementType = elementType;
    }
}

export class ArrayType extends DataType {
    elementType: DataType;
    length: number | null;
    
    constructor(elementType: DataType, length: number | null = null) {
        super();
        this.elementType = elementType;
        this.length = length;
    }
}

export class FileHandleType extends DataType {
    
}

export class AppHandleType extends FileHandleType {
    
}


