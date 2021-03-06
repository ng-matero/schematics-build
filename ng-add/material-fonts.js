"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@schematics/angular/utility/config");
const schematics_1 = require("@angular/cdk/schematics");
const project_index_html_1 = require("../utils/project-index-html");
/** Adds the Material Design fonts to the index HTML file. */
function addFontsToIndex(options) {
    return (host) => {
        const workspace = config_1.getWorkspace(host);
        const project = schematics_1.getProjectFromWorkspace(workspace, options.project);
        const projectIndexHtmlPath = project_index_html_1.getIndexHtmlPath(project);
        const fonts = [
            'assets/fonts/Material_Icons.css',
            'https://fonts.googleapis.com/css?family=Roboto:300,400,500&display=swap',
        ];
        fonts.forEach(font => {
            schematics_1.appendHtmlElementToHead(host, projectIndexHtmlPath, `<link rel="stylesheet" href="${font}">`);
        });
        return host;
    };
}
exports.addFontsToIndex = addFontsToIndex;
//# sourceMappingURL=material-fonts.js.map