import { Tree } from '@angular-devkit/schematics';
import { DefaultTreeElement } from 'parse5';
/** Appends the given element HTML fragment to the `<head>` element of the specified HTML file. */
export declare function appendHtmlElement(host: Tree, htmlFilePath: string, elementHtml: string, tag: string): void;
/** Parses the given HTML file and returns the element if available. */
export declare function getHtmlTagElement(htmlContent: string, tag: string): DefaultTreeElement | null;
