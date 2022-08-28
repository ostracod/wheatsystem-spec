
export class DataType {
    isConstant: boolean;
    
    constructor() {
        this.isConstant = false;
    }
    
    toString(): string {
        throw new Error("toString is not yet implemented for this data type.");
    }
    
    toFriendlyStringHelper(isPlural: boolean): string {
        return "data " + (isPlural ? "buffers" : "buffer");
    }
    
    toFriendlyString(isPlural: boolean): string {
        return (this.isConstant ? "constant " : "") + this.toFriendlyStringHelper(isPlural);
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
    
    toString(): string {
        if (this.isSigned !== null && this.isSigned && this.bitAmount !== null) {
            return "s" + this.bitAmount;
        } else {
            return super.toString();
        }
    }
    
    toFriendlyStringHelper(isPlural: boolean): string {
        let text = isPlural ? "integers" : "integer";
        if (this.bitAmount !== null) {
            text = `${this.bitAmount}-bit ${text}`;
        }
        if (this.isSigned !== null) {
            if (this.isSigned) {
                text = "signed " + text;
            } else {
                text = "unsigned " + text;
            }
        }
        return text;
    }
}

export class PointerType extends IntegerType {
    elementType: DataType | null;
    
    constructor(elementType: DataType | null) {
        super(true, 32);
        this.elementType = elementType;
    }
    
    toFriendlyStringHelper(isPlural: boolean): string {
        let text = isPlural ? "pointers" : "pointer";
        if (this.elementType !== null) {
            text +=  " to " + this.elementType.toFriendlyString(false);
        }
        return text;
    }
}

export class ArrayType extends DataType {
    elementType: DataType | null;
    length: number | null;
    
    constructor(elementType: DataType, length: number | null = null) {
        super();
        this.elementType = elementType;
        this.length = length;
    }
    
    toFriendlyStringHelper(isPlural: boolean): string {
        let text = isPlural ? "arrays" : "array";
        if (this.length !== null) {
            text += " with length " + this.length;
        }
        if (this.elementType !== null) {
            text += " of " + this.elementType.toFriendlyString(true);
        }
        return text;
    }
}

export class FileHandleType extends DataType {
    
    toFriendlyStringHelper(isPlural: boolean): string {
        return "file " + (isPlural ? "handles" : "handle");
    }
}

export class AppHandleType extends FileHandleType {
    
    toFriendlyStringHelper(isPlural: boolean): string {
        return "app " + (isPlural ? "handles" : "handle");
    }
}

export class GateType extends DataType {
    
    toFriendlyStringHelper(isPlural: boolean): string {
        return isPlural ? "gates" : "gate";
    }
}


