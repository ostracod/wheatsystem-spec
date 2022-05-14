
const fs = require("fs");

const categoryList = [];

class Category {
    
    constructor(name) {
        this.name = name;
        this.instructionList = [];
        categoryList.push(this);
    }
    
    toJson() {
        return {
            name: this.name,
            instructionList: this.instructionList.map((instruction) => instruction.toJson()),
        };
    }
    
    toHtml() {
        const htmlList = this.instructionList.map((instruction) => instruction.toHtml())
        return `<p class="title2">${this.name}</p>
${htmlList.join("\n")}`;
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
            argumentList: this.argumentList.map((argument) => argument.toJson()),
            noteList: this.noteList,
        };
    }
    
    toHtml() {
        let opcodeText = this.opcode.toString(16).toUpperCase();
        while (opcodeText.length < 2) {
            opcodeText = "0" + opcodeText;
        }
        opcodeText = "0x" + opcodeText;
        const nameList = this.argumentList.map((argument) => argument.name)
        const htmlList = this.argumentList.map((argument) => argument.toHtml())
        for (const note of this.noteList) {
            htmlList.push(`<li>${note}</li>`);
        }
        return `<p><span class="code">${this.name} ${nameList.join(", ")}</span></p>
<div class="description">
    <p>${this.description}</p>
    <ul>
        <li><span class="code">${this.name}</span> opcode = <span class="code">${opcodeText}</span></li>
${htmlList.join("\n")}
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
            description: this.description,
        };
    }
    
    toHtml() {
        return `<li><span class="code">${this.name}</span> = ${this.description}</span></li>`;
    }
}

const splitEqualityStatement = (statement) => {
    const textList = statement.split("=");
    return textList.map((text) => text.trim());
};

const parseInstructions = (instructionText) => {
    let currentCategory = null;
    let currentInstruction = null;
    const lineList = instructionText.split("\n");
    for (const line of lineList) {
        if (line.length <= 0) {
            continue;
        }
        const character = line.charAt(0);
        const text = line.substring(2, line.length);
        if (character === "!") {
            currentCategory = new Category(text);
        }
        if (character === "$") {
            let [name, opcode] = splitEqualityStatement(text);
            opcode = opcode.substring(2, opcode.length);
            opcode = parseInt(opcode, 16);
            currentInstruction = new Instruction(name, opcode);
            currentCategory.instructionList.push(currentInstruction);
        }
        if (character === "#") {
            currentInstruction.description = text;
        }
        if (character === ">") {
            const [name, description] = splitEqualityStatement(text);
            const argument = new Argument(name, description);
            currentInstruction.argumentList.push(argument);
        }
        if (character === "*") {
            currentInstruction.noteList.push(text);
        }
    }
};

const populateTemplatePlaceholders = (templateText, instructionHtml) => {
    let output = templateText;
    const date = new Date();
    output = output.replace("{TIMESTAMP}", date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short",
    }));
    output = output.replace("{INSTRUCTIONS}", instructionHtml);
    return output;
};

const formatHtmlStyle = (documentHtml) => {
    const oldList = documentHtml.split("`");
    const newList = [];
    oldList.forEach((text, index) => {
        if (index > 0) {
            if (index % 2 == 1) {
                newList.push(`<span class="code">`);
            } else {
                newList.push(`</span>`);
            }
        }
        newList.push(text);
    });
    return newList.join("");
};

console.log("Generating documentation...");

const templateText = fs.readFileSync("./bytecodeTemplate.html", "utf8");
const instructionText = fs.readFileSync("./bytecodeInstructions.txt", "utf8");
parseInstructions(instructionText);
const instructionHtml = categoryList.map((category) => category.toHtml()).join("\n");
let documentHtml = populateTemplatePlaceholders(templateText, instructionHtml);
documentHtml = formatHtmlStyle(documentHtml);
const instructionsJson = categoryList.map((category) => category.toJson());

const fileContentMap = {
    "./bytecode.html": documentHtml,
    "./bytecodeInstructions.json": JSON.stringify(instructionsJson),
};

for (const path in fileContentMap) {
    const content = fileContentMap[path];
    console.log(`Writing file to ${path}...`);
    fs.writeFileSync(path, content);
}

console.log("Finished.");


