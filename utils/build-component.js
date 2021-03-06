"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
const change_1 = require("@schematics/angular/utility/change");
const config_1 = require("@schematics/angular/utility/config");
const find_module_1 = require("@schematics/angular/utility/find-module");
const parse_name_1 = require("@schematics/angular/utility/parse-name");
const project_1 = require("@schematics/angular/utility/project");
const validation_1 = require("@schematics/angular/utility/validation");
const fs_1 = require("fs");
const path_1 = require("path");
const get_project_1 = require("@angular/cdk/schematics/utils/get-project");
const schematic_options_1 = require("@angular/cdk/schematics/utils/schematic-options");
const ts = require("@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript");
/**
 * List of style extensions which are CSS compatible. All supported CLI style extensions can be
 * found here: angular/angular-cli/master/packages/schematics/angular/ng-new/schema.json#L118-L122
 */
const supportedCssExtensions = ['css', 'scss', 'less'];
function buildRelativeComponentPath(options, modulePath) {
    const componentPath = `/${options.path}/` +
        (options.flat ? '' : core_1.strings.dasherize(options.name) + '/') +
        core_1.strings.dasherize(options.name) +
        '.component';
    return find_module_1.buildRelativePath(modulePath, componentPath);
}
function readIntoSourceFile(host, modulePath) {
    const text = host.read(modulePath);
    if (text === null) {
        throw new schematics_1.SchematicsException(`File ${modulePath} does not exist.`);
    }
    return ts.createSourceFile(modulePath, text.toString('utf-8'), ts.ScriptTarget.Latest, true);
}
/**
 * Add a new component to a declaration array (e.g. `COMPONENTS`)
 */
function addComponent(host, modulePath, fileName, symbolName) {
    const source = readIntoSourceFile(host, modulePath);
    const node = ast_utils_1.findNode(source, ts.SyntaxKind.Identifier, symbolName);
    if (!node) {
        throw new Error(`Couldn't find a ${symbolName} declaration in '${modulePath}'.`);
    }
    const nodeArr = node.parent.initializer;
    // Whether the declaration added needs a comma...
    const occurencesCount = nodeArr.elements.length;
    const text = node.getFullText(source);
    let componentName = fileName;
    if (occurencesCount > 0) {
        const identation = text.match(/\r?\n(\r?)\s*/) || [];
        componentName = `,${identation[0] || ' '}${fileName}`;
    }
    const addDeclaration = ast_utils_1.insertAfterLastOccurrence(nodeArr.elements, componentName, modulePath, nodeArr.elements.pos, ts.SyntaxKind.Identifier);
    const record = host.beginUpdate(modulePath);
    record.insertLeft(addDeclaration.pos, addDeclaration.toAdd);
    host.commitUpdate(record);
}
/**
 * Add a import declaration (i.e. insert `import ... from ...`)
 */
function addImportDeclaration(host, modulePath, fileName, filePath) {
    const source = readIntoSourceFile(host, modulePath);
    const changes = ast_utils_1.insertImport(source, modulePath, fileName, filePath);
    const declarationRecorder = host.beginUpdate(modulePath);
    if (changes instanceof change_1.InsertChange) {
        declarationRecorder.insertLeft(changes.pos, changes.toAdd);
    }
    host.commitUpdate(declarationRecorder);
}
/**
 * Add export declaration
 */
function addExportToNgModule(host, modulePath, fileName, filePath) {
    // Need to refresh the AST because we overwrote the file in the host.
    const source = readIntoSourceFile(host, modulePath);
    const exportRecorder = host.beginUpdate(modulePath);
    const exportChanges = ast_utils_1.addExportToModule(
    // TODO: TypeScript version mismatch due to @schematics/angular using a different version
    // than Material. Cast to any to avoid the type assignment failure.
    source, modulePath, fileName, filePath);
    for (const change of exportChanges) {
        if (change instanceof change_1.InsertChange) {
            exportRecorder.insertLeft(change.pos, change.toAdd);
        }
    }
    host.commitUpdate(exportRecorder);
}
/**
 * build selector with page name
 */
function buildSelector(options, projectPrefix) {
    let selector = options.pageName;
    if (options.prefix) {
        selector = `${options.prefix}-${selector}`;
    }
    else if (options.prefix === undefined && projectPrefix) {
        selector = `${projectPrefix}-${selector}`;
    }
    return selector;
}
/**
 * Build page name with module and name
 */
function buildPageName(options) {
    const tempNameArr = [];
    if (options.module) {
        tempNameArr.push(options.module);
    }
    tempNameArr.push(...options.name.split('/'));
    return tempNameArr.join('-');
}
/**
 * Add declarations to module
 */
function addDeclarationToNgModule(options) {
    return (host) => {
        if (options.skipImport || !options.module) {
            return host;
        }
        const modulePath = options.module;
        const relativePath = buildRelativeComponentPath(options, modulePath);
        const classifiedName = core_1.strings.classify(`${options.pageName}Component`);
        addImportDeclaration(host, modulePath, classifiedName, relativePath);
        if (!options.entryComponent) {
            addComponent(host, modulePath, classifiedName, 'COMPONENTS');
        }
        else {
            addComponent(host, modulePath, classifiedName, 'COMPONENTS_DYNAMIC');
        }
        if (options.export) {
            addExportToNgModule(host, modulePath, classifiedName, relativePath);
        }
        return host;
    };
}
/**
 * Add a new component route declaration
 */
function addRouteDeclarationToNgModule(options, routingModulePath) {
    return (host) => {
        if (!options.module) {
            throw new Error('Module option required.');
        }
        let path;
        if (routingModulePath) {
            path = routingModulePath;
        }
        else {
            path = options.module;
        }
        const text = host.read(path);
        if (!text) {
            throw new Error(`Couldn't find the module nor its routing module.`);
        }
        const relativePath = buildRelativeComponentPath(options, routingModulePath);
        const classifiedName = core_1.strings.classify(`${options.pageName}Component`);
        if (!options.entryComponent) {
            addImportDeclaration(host, routingModulePath, classifiedName, relativePath);
            // Update component routes array
            const source = readIntoSourceFile(host, routingModulePath);
            const componentRoute = `{ path: '${options.name}', component: ${classifiedName} }`;
            const addDeclaration = ast_utils_1.addRouteDeclarationToModule(source, path, componentRoute);
            const recorder = host.beginUpdate(path);
            recorder.insertLeft(addDeclaration.pos, addDeclaration.toAdd);
            host.commitUpdate(recorder);
        }
        return host;
    };
}
/**
 * Indents the text content with the amount of specified spaces. The spaces will be added after
 * every line-break. This utility function can be used inside of EJS templates to properly
 * include the additional files.
 */
function indentTextContent(text, numSpaces) {
    // In the Material project there should be only LF line-endings, but the schematic files
    // are not being linted and therefore there can be also CRLF or just CR line-endings.
    return text.replace(/(\r\n|\r|\n)/g, `$1${' '.repeat(numSpaces)}`);
}
/**
 * Rule that copies and interpolates the files that belong to this schematic context. Additionally
 * a list of file paths can be passed to this rule in order to expose them inside the EJS
 * template context.
 *
 * This allows inlining the external template or stylesheet files in EJS without having
 * to manually duplicate the file content.
 */
function buildComponent(options, additionalFiles = {}) {
    return (host, context) => {
        const workspace = config_1.getWorkspace(host);
        const project = get_project_1.getProjectFromWorkspace(workspace, options.project);
        const defaultComponentOptions = schematic_options_1.getDefaultComponentOptions(project);
        // TODO(devversion): Remove if we drop support for older CLI versions.
        // This handles an unreported breaking change from the @angular-devkit/schematics. Previously
        // the description path resolved to the factory file, but starting from 6.2.0, it resolves
        // to the factory directory.
        const schematicPath = fs_1.statSync(context.schematic.description.path).isDirectory()
            ? context.schematic.description.path
            : path_1.dirname(context.schematic.description.path);
        const schematicFilesUrl = './files';
        const schematicFilesPath = path_1.resolve(schematicPath, schematicFilesUrl);
        // Add the default component option values to the options if an option is not explicitly
        // specified but a default component option is available.
        Object.keys(options)
            .filter(optionName => options[optionName] == null && defaultComponentOptions[optionName])
            .forEach(optionName => (options[optionName] = defaultComponentOptions[optionName]));
        if (options.path === undefined) {
            // TODO(jelbourn): figure out if the need for this `as any` is a bug due to two different
            // incompatible `WorkspaceProject` classes in @angular-devkit
            options.path = project_1.buildDefaultPath(project);
            // Fix default path (i.e. `src/app/routes/{{modulePath}}`)
            options.path += '/routes/' + options.module;
        }
        options.pageName = buildPageName(options) || '';
        options.module = find_module_1.findModuleFromOptions(host, options);
        // Route module path
        const routingModulePath = options.module.replace('.module', '-routing.module');
        const parsedPath = parse_name_1.parseName(options.path, options.name);
        options.name = parsedPath.name;
        options.path = parsedPath.path;
        options.selector = options.selector || buildSelector(options, project.prefix);
        validation_1.validateName(options.name);
        validation_1.validateHtmlSelector(options.selector);
        // In case the specified style extension is not part of the supported CSS supersets,
        // we generate the stylesheets with the "css" extension. This ensures that we don't
        // accidentally generate invalid stylesheets (e.g. drag-drop-comp.styl) which will
        // break the Angular CLI project. See: https://github.com/angular/components/issues/15164
        if (!supportedCssExtensions.includes(options.style)) {
            // TODO: Cast is necessary as we can't use the Style enum which has been introduced
            // within CLI v7.3.0-rc.0. This would break the schematic for older CLI versions.
            options.style = 'css';
        }
        // Object that will be used as context for the EJS templates.
        const baseTemplateContext = Object.assign(Object.assign(Object.assign({}, core_1.strings), { 'if-flat': (s) => (options.flat ? '' : s) }), options);
        // Key-value object that includes the specified additional files with their loaded content.
        // The resolved contents can be used inside EJS templates.
        const resolvedFiles = {};
        for (const key in additionalFiles) {
            if (additionalFiles[key]) {
                const fileContent = fs_1.readFileSync(path_1.join(schematicFilesPath, additionalFiles[key]), 'utf-8');
                // Interpolate the additional files with the base EJS template context.
                resolvedFiles[key] = core_1.template(fileContent)(baseTemplateContext);
            }
        }
        const templateSource = schematics_1.apply(schematics_1.url(schematicFilesUrl), [
            options.skipTests ? schematics_1.filter(path => !path.endsWith('.spec.ts.template')) : schematics_1.noop(),
            options.inlineStyle ? schematics_1.filter(path => !path.endsWith('.__style__.template')) : schematics_1.noop(),
            options.inlineTemplate ? schematics_1.filter(path => !path.endsWith('.html.template')) : schematics_1.noop(),
            // Treat the template options as any, because the type definition for the template options
            // is made unnecessarily explicit. Every type of object can be used in the EJS template.
            schematics_1.applyTemplates(Object.assign({ indentTextContent, resolvedFiles }, baseTemplateContext)),
            // TODO(devversion): figure out why we cannot just remove the first parameter
            // See for example: angular-cli#schematics/angular/component/index.ts#L160
            schematics_1.move(null, parsedPath.path),
        ]);
        return schematics_1.chain([
            schematics_1.branchAndMerge(schematics_1.chain([
                addDeclarationToNgModule(options),
                addRouteDeclarationToNgModule(options, routingModulePath),
                schematics_1.mergeWith(templateSource),
            ])),
        ])(host, context);
    };
}
exports.buildComponent = buildComponent;
//# sourceMappingURL=build-component.js.map