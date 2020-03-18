"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
/** Entry point for the migration schematics with target of Ng-Matero v0 */
function updateToV0() {
    console.log(chalk.green('The \`ng update\` is working!'));
}
exports.updateToV0 = updateToV0;
/** Function that will be called when the migration completed. */
function onMigrationComplete(targetVersion, hasFailures) {
    console.log();
    console.log(chalk.green(`  ✓  Updated Ng-Matero to ${targetVersion}`));
    console.log();
    if (hasFailures) {
        console.log(chalk.yellow('  ⚠  Some issues were detected but could not be fixed automatically. Please check the ' +
            'output above and fix these issues manually.'));
    }
}
//# sourceMappingURL=index.js.map