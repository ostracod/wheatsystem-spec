
import * as fs from "fs";
import * as pathUtils from "path";
import { projectDirectoryPath } from "./constants.js";
import * as specUtils from "./specUtils.js";
import { Specification } from "./specification.js";
import { instructionSpecification } from "./instances.js";

export abstract class SpecPage {
    name: string;
    specifications: Specification[];
    
    constructor(name: string, specifications: Specification[]) {
        this.name = name;
        this.specifications = specifications;
    }
    
    createFile(): string {
        const templatePath = pathUtils.join(
            projectDirectoryPath,
            this.name + "Template.html",
        );
        const templateText = fs.readFileSync(templatePath, "utf8");
        const htmlMap: { [name: string]: string } = {};
        for (const specification of this.specifications) {
            htmlMap[specification.name] = specification.toHtml();
        }
        let pageHtml = specUtils.populateTemplatePlaceholders(templateText, htmlMap);
        pageHtml = specUtils.formatHtmlStyle(pageHtml);
        const pagePath = pathUtils.join(projectDirectoryPath, this.name + ".html");
        fs.writeFileSync(pagePath, pageHtml);
        return pagePath;
    }
}

export class BytecodePage extends SpecPage {
    
    constructor() {
        super("bytecode", [instructionSpecification]);
    }
}


