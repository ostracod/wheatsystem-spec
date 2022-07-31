
import { BytecodePage } from "./specPage.js";

console.log("Generating documentation...");

const pages = [new BytecodePage()];
const paths: string[] = [];
for (const page of pages) {
    const path = page.createFile();
    paths.push(path);
}

console.log("Finished. Documentation file paths:");
for (const path of paths) {
    console.log(path);
}


