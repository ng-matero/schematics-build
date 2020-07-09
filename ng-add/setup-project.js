"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const schematics_2 = require("@angular/cdk/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const config_1 = require("@schematics/angular/utility/config");
const ng_ast_utils_1 = require("@schematics/angular/utility/ng-ast-utils");
const chalk = require("chalk");
const material_fonts_1 = require("./material-fonts");
const global_loader_1 = require("./global-loader");
const package_config_1 = require("./package-config");
const packages_1 = require("./packages");
const utils_1 = require("../utils");
/** Name of the Angular module that enables Angular browser animations. */
const browserAnimationsModuleName = 'BrowserAnimationsModule';
/** Name of the module that switches Angular animations to a noop implementation. */
const noopAnimationsModuleName = 'NoopAnimationsModule';
/**
 * Scaffolds the basics of a Angular Material application, this includes:
 *  - Add Starter files to root
 *  - Add Scripts to package.json
 *  - Add Hmr & style & proxy to angular.json
 *  - Add Browser Animation to app.module
 *  - Add Fonts & Icons to index.html
 *  - Add Preloader to index.html
 *  - Add Packages to package.json
 */
function default_1(options) {
    return schematics_1.chain([
        deleteExsitingFiles(),
        addStarterFiles(options),
        addScriptsToPackageJson(),
        addHmrToAngularJson(),
        addStyleToAngularJson(),
        addProxyToAngularJson(),
        addAnimationsModule(options),
        material_fonts_1.addFontsToIndex(options),
        global_loader_1.addLoaderToIndex(options),
        installPackages(),
    ]);
}
exports.default = default_1;
/**
 * Adds an animation module to the root module of the specified project. In case the "animations"
 * option is set to false, we still add the `NoopAnimationsModule` because otherwise various
 * components of Angular Material will throw an exception.
 */
function addAnimationsModule(options) {
    return (host) => {
        const workspace = config_1.getWorkspace(host);
        const project = schematics_2.getProjectFromWorkspace(workspace, options.project);
        const appModulePath = ng_ast_utils_1.getAppModulePath(host, schematics_2.getProjectMainFile(project));
        if (options.animations) {
            // In case the project explicitly uses the NoopAnimationsModule, we should print a warning
            // message that makes the user aware of the fact that we won't automatically set up
            // animations. If we would add the BrowserAnimationsModule while the NoopAnimationsModule
            // is already configured, we would cause unexpected behavior and runtime exceptions.
            if (schematics_2.hasNgModuleImport(host, appModulePath, noopAnimationsModuleName)) {
                return console.warn(chalk.red(`Could not set up "${chalk.bold(browserAnimationsModuleName)}" ` +
                    `because "${chalk.bold(noopAnimationsModuleName)}" is already imported. Please ` +
                    `manually set up browser animations.`));
            }
            schematics_2.addModuleImportToRootModule(host, browserAnimationsModuleName, '@angular/platform-browser/animations', project);
        }
        else if (!schematics_2.hasNgModuleImport(host, appModulePath, browserAnimationsModuleName)) {
            // Do not add the NoopAnimationsModule module if the project already explicitly uses
            // the BrowserAnimationsModule.
            schematics_2.addModuleImportToRootModule(host, noopAnimationsModuleName, '@angular/platform-browser/animations', project);
        }
        return host;
    };
}
/** delete exsiting files to be overwrite */
function deleteExsitingFiles() {
    return (host) => {
        const workspace = config_1.getWorkspace(host);
        const project = schematics_2.getProjectFromWorkspace(workspace);
        [
            `${project.root}/tsconfig.app.json`,
            `${project.root}/tsconfig.json`,
            `${project.root}/tslint.json`,
            `${project.sourceRoot}/app/app-routing.module.ts`,
            `${project.sourceRoot}/app/app.module.ts`,
            `${project.sourceRoot}/app/app.component.spec.ts`,
            `${project.sourceRoot}/app/app.component.ts`,
            `${project.sourceRoot}/app/app.component.html`,
            `${project.sourceRoot}/app/app.component.scss`,
            `${project.sourceRoot}/environments/environment.prod.ts`,
            `${project.sourceRoot}/environments/environment.ts`,
            `${project.sourceRoot}/main.ts`,
            `${project.sourceRoot}/styles.scss`,
        ]
            .filter(p => host.exists(p))
            .forEach(p => host.delete(p));
    };
}
/** Add scripts to package.json */
function addScriptsToPackageJson() {
    return (host) => {
        package_config_1.addScriptToPackageJson(host, 'postinstall', 'ngcc --properties es2015 browser module main --first-only --create-ivy-entry-points');
        package_config_1.addScriptToPackageJson(host, 'build:prod', 'ng build --prod');
        package_config_1.addScriptToPackageJson(host, 'lint:ts', `tslint -p src/tsconfig.app.json -c tslint.json 'src/**/*.ts'`);
        package_config_1.addScriptToPackageJson(host, 'lint:scss', `stylelint --syntax scss 'src/**/*.scss' --fix`);
        package_config_1.addScriptToPackageJson(host, 'hmr', `ng serve --hmr -c hmr --disable-host-check`);
    };
}
/** Add hmr to angular.json */
function addHmrToAngularJson() {
    return (host) => {
        const workspace = config_1.getWorkspace(host);
        const ngJson = Object.assign(workspace);
        const project = ngJson.projects[ngJson.defaultProject];
        // build
        project.architect.build.configurations.hmr = {
            fileReplacements: [
                {
                    replace: `${project.sourceRoot}/environments/environment.ts`,
                    with: `${project.sourceRoot}/environments/environment.hmr.ts`,
                },
            ],
        };
        // serve
        project.architect.serve.configurations.hmr = {
            hmr: true,
            browserTarget: `${workspace.defaultProject}:build:hmr`,
        };
        host.overwrite('angular.json', JSON.stringify(ngJson, null, 2));
    };
}
/** Add style to angular.json */
function addStyleToAngularJson() {
    return (host) => {
        const workspace = config_1.getWorkspace(host);
        const ngJson = Object.assign(workspace);
        const project = ngJson.projects[ngJson.defaultProject];
        const themePath = `src/styles.scss`;
        utils_1.addThemeStyleToTarget(project, 'build', host, themePath, workspace);
        utils_1.addThemeStyleToTarget(project, 'test', host, themePath, workspace);
    };
}
/** Add proxy to angular.json */
function addProxyToAngularJson() {
    return (host) => {
        const workspace = config_1.getWorkspace(host);
        const ngJson = Object.assign(workspace);
        const project = ngJson.projects[ngJson.defaultProject];
        project.architect.serve.options.proxyConfig = 'proxy.config.js';
        host.overwrite('angular.json', JSON.stringify(ngJson, null, 2));
    };
}
/** Add starter files to root */
function addStarterFiles(options) {
    return schematics_1.chain([
        schematics_1.mergeWith(schematics_1.apply(schematics_1.url('./files'), [
            schematics_1.template(Object.assign(Object.assign({}, core_1.strings), options)),
        ])),
    ]);
}
/** Install packages */
function installPackages() {
    return (host, context) => {
        // Add 3rd packages
        packages_1.add3rdPkgsToPackageJson(host);
        context.addTask(new tasks_1.NodePackageInstallTask());
        return host;
    };
}
//# sourceMappingURL=setup-project.js.map