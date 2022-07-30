
export class DataType {
    isConstant: boolean;
    
    constructor(isConstant: boolean) {
        this.isConstant = isConstant;
    }
}

export class IntegerType extends DataType {
    isSigned: boolean | null;
    bitAmount: number | null;
    
    constructor(
        isConstant: boolean,
        isSigned: boolean | null = null,
        bitAmount: number | null = null,
    ) {
        super(isConstant);
        this.isSigned = isSigned;
        this.bitAmount = bitAmount;
    }
}

export class PointerType extends IntegerType {
    elementType: DataType;
    
    constructor(isConstant: boolean, elementType: DataType) {
        super(isConstant, true, 32);
        this.elementType = elementType;
    }
}

export class ArrayType extends DataType {
    elementType: DataType;
    length: number | null;
    
    constructor(isConstant: boolean, elementType: DataType, length: number | null = null) {
        super(isConstant);
        this.elementType = elementType;
        this.length = length;
    }
}

export class FileHandleType extends DataType {
    
}

export class AppHandleType extends FileHandleType {
    
}


