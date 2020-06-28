
const fs = require("fs");

let categoryList = [];

class Category {
    
    constructor(name) {
        this.name = name;
        this.instructionList = [];
        categoryList.push(this);
    }
    
    toJson() {
        return {
            name: this.name,
            instructionList: this.instructionList.map(instruction => instruction.toJson())
        };
    }
    
    toHtml() {
        let tempHtmlList = this.instructionList.map(instruction => instruction.toHtml())
        return `<p class="title2">${this.name}</p>
${tempHtmlList.join("\n")}`;
    }
    
}

class Instruction {
    
    constructor(name, opcode) {
        this.name = name;
        this.opcode = opcode;
        this.description = null;
        this.argumentList = [];
        this.noteList = [];
    }
    
    toJson() {
        return {
            name: this.name,
            opcode: this.opcode,
            description: this.description,
            argumentList: this.argumentList.map(argument => argument.toJson()),
            noteList: this.noteList
        };
    }
    
    toHtml() {
        let tempOpcodeText = this.opcode.toString(16).toUpperCase();
        while (tempOpcodeText.length < 2) {
            tempOpcodeText = "0" + tempOpcodeText;
        }
        tempOpcodeText = "0x" + tempOpcodeText;
        let tempNameList = this.argumentList.map(argument => argument.name)
        let tempHtmlList = this.argumentList.map(argument => argument.toHtml())
        for (let note of this.noteList) {
            tempHtmlList.push(`<li>${note}</li>`);
        }
        return `<p><span class="code">${this.name} ${tempNameList.join(", ")}</span></p>
<div class="description">
    <p>${this.description}</p>
    <ul>
        <li><span class="code">${this.name}</span> opcode = <span class="code">${tempOpcodeText}</span></li>
${tempHtmlList.join("\n")}
    </ul>
</div>`;
    }
    
}

class Argument {
    
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }
    
    toJson() {
        return {
            name: this.name,
            description: this.description
        };
    }
    
    toHtml() {
        return `<li><span class="code">${this.name}</span> = ${this.description}</span></li>`;
    }
    
}

function splitEqualityStatement(statement) {
    let tempTextList = statement.split("=");
    return tempTextList.map(text => text.trim());
}

function parseInstructions(instructionText) {
    let currentCategory = null;
    let currentInstruction = null;
    let lineList = instructionText.split("\n");
    for (let line of lineList) {
        if (line.length <= 0) {
            continue;
        }
        let tempCharacter = line.charAt(0);
        let tempText = line.substring(2, line.length);
        if (tempCharacter === "!") {
            currentCategory = new Category(tempText);
        }
        if (tempCharacter === "$") {
            let [tempName, tempOpcode] = splitEqualityStatement(tempText);
            tempOpcode = tempOpcode.substring(2, tempOpcode.length);
            tempOpcode = parseInt(tempOpcode, 16);
            currentInstruction = new Instruction(tempName, tempOpcode);
            currentCategory.instructionList.push(currentInstruction);
        }
        if (tempCharacter === "#") {
            currentInstruction.description = tempText;
        }
        if (tempCharacter === ">") {
            let [tempName, tempDescription] = splitEqualityStatement(tempText);
            let tempArgument = new Argument(tempName, tempDescription);
            currentInstruction.argumentList.push(tempArgument);
        }
        if (tempCharacter === "*") {
            currentInstruction.noteList.push(tempText);
        }
    }
}

function populateTemplatePlaceholders(templateText, instructionHtml) {
    let output = templateText;
    var tempDate = new Date();
    output = output.replace("{TIMESTAMP}", tempDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short"
    }));
    output = output.replace("{INSTRUCTIONS}", instructionHtml);
    return output;
}

function formatHtmlStyle(documentHtml) {
    let tempOldList = documentHtml.split("`");
    let tempNewList = [];
    for (let index in tempOldList) {
        let tempText = tempOldList[index];
        if (index > 0) {
            if (index % 2 == 1) {
                tempNewList.push(`<span class="code">`);
            } else {
                tempNewList.push(`</span>`);
            }
        }
        tempNewList.push(tempText);
    }
    return tempNewList.join("");
}

console.log("Generating documentation...");

let templateText = fs.readFileSync("./bytecodeTemplate.html", "utf8");
let instructionText = fs.readFileSync("./bytecodeInstructions.txt", "utf8");
parseInstructions(instructionText);
let instructionHtml = categoryList.map(category => category.toHtml()).join("\n");
let documentHtml = populateTemplatePlaceholders(templateText, instructionHtml);
documentHtml = formatHtmlStyle(documentHtml);
let instructionsJson = categoryList.map(category => category.toJson());

fs.writeFileSync("./bytecode.html", documentHtml);
fs.writeFileSync("./bytecodeInstructions.json", JSON.stringify(instructionsJson));

console.log("Finished.");


