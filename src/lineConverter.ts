
import * as specUtils from "./specUtils.js";
import { SpecLine, DefinitionLine, IdLine } from "./specLine.js";

export abstract class LineConverter {
    
    abstract convertDefinitionLine(definitionLine: DefinitionLine): string;
        
    convertIdLine(idLine: IdLine): string {
        throw new Error("Unexpected ID line.");
    }
    
    convertLine(specLine: SpecLine): string {
        if (specLine instanceof DefinitionLine) {
            return this.convertDefinitionLine(specLine);
        } else if (specLine instanceof IdLine) {
            return this.convertIdLine(specLine);
        } else {
            return specLine.toHtml();
        }
    }
}

export class ErrorLineConverter extends LineConverter {
    
    convertDefinitionLine(definitionLine: DefinitionLine): string {
        const valueText = specUtils.convertNumberToHexadecimal(definitionLine.id);
        return `<p><span class="code">${definitionLine.name}</span> error code = <span class="code">${valueText}</span></p>`;
    }
}

export class InstructionLineConverter extends LineConverter {
    
    convertDefinitionLine(definitionLine: DefinitionLine): string {
        const names = definitionLine.memberLines.map((memberLine) => memberLine.name);
        return `<p><span class="code">${definitionLine.name} ${names.join(", ")}</span></p>`;
    }
    
    convertIdLine(idLine: IdLine): string {
        const { definitionLine } = idLine;
        const opcodeText = specUtils.convertNumberToHexadecimal(definitionLine.id);
        return `<li><span class="code">${definitionLine.name}</span> opcode = <span class="code">${opcodeText}</span></li>`
    }
}

export class FunctionLineConverter extends LineConverter {
    
    convertDefinitionLine(definitionLine: DefinitionLine): string {
        const { memberLines } = definitionLine;
        let argsText: string;
        if (memberLines.length > 0) {
            const textList = memberLines.map((memberLine) => (
                `    ${memberLine.type.toString()} ${memberLine.name}`
            ));
            argsText = `\n${textList.join(",\n")}\n`;
        } else {
            argsText = "";
        }
        return `<pre class="code">${definitionLine.name}(${argsText})</pre>`;
    }
    
    convertIdLine(idLine: IdLine): string {
        const { definitionLine } = idLine;
        return `<li><span class="code">${definitionLine.name}</span> function ID = ${definitionLine.id}</li>`
    }
}


