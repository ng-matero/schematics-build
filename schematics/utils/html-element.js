"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const schematics_2 = require("@angular/cdk/schematics");
const parse5_1 = require("parse5");
/** Appends the given element HTML fragment to the `<head>` element of the specified HTML file. */
function appendHtmlElement(host, htmlFilePath, elementHtml, tag) {
    const htmlFileBuffer = host.read(htmlFilePath);
    if (!htmlFileBuffer) {
        throw new schematics_1.SchematicsException(`Could not read file for path: ${htmlFilePath}`);
    }
    const htmlContent = htmlFileBuffer.toString();
    if (htmlContent.includes(elementHtml)) {
        return;
    }
    const ElemTag = getHtmlTagElement(htmlContent, tag);
    if (!ElemTag) {
        throw new Error(`Could not find '<${tag}>' element in HTML file: ${htmlFileBuffer}`);
    }
    const endTagOffset = ElemTag.sourceCodeLocation.endTag.startOffset;
    const indentationOffset = schematics_2.getChildElementIndentation(ElemTag);
    const insertion = `${' '.repeat(indentationOffset)}${elementHtml}`;
    const recordedChange = host.beginUpdate(htmlFilePath).insertRight(endTagOffset, `${insertion}\n`);
    host.commitUpdate(recordedChange);
}
exports.appendHtmlElement = appendHtmlElement;
/** Parses the given HTML file and returns the element if available. */
function getHtmlTagElement(htmlContent, tag) {
    const document = parse5_1.parse(htmlContent, { sourceCodeLocationInfo: true });
    const nodeQueue = [...document.childNodes];
    while (nodeQueue.length) {
        const node = nodeQueue.shift();
        if (node.nodeName.toLowerCase() === tag) {
            return node;
        }
        else if (node.childNodes) {
            nodeQueue.push(...node.childNodes);
        }
    }
    return null;
}
exports.getHtmlTagElement = getHtmlTagElement;
//# sourceMappingURL=html-element.js.map