"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_1 = require("@angular-devkit/schematics/tasks");
const packages_1 = require("./packages");
// Just return the tree
function default_1(options) {
    return (host, context) => {
        // Add CDK first!
        packages_1.addKeyPkgsToPackageJson(host);
        // Since the Angular Material schematics depend on the schematic utility functions from the
        // CDK, we need to install the CDK before loading the schematic files that import from the CDK.
        const installTaskId = context.addTask(new tasks_1.NodePackageInstallTask());
        context.addTask(new tasks_1.RunSchematicTask('ng-add-setup-project', options), [installTaskId]);
        return host;
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map