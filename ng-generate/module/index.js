"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const ts = require("@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript");
const find_module_1 = require("@schematics/angular/utility/find-module");
const workspace_1 = require("@schematics/angular/utility/workspace");
const parse_name_1 = require("@schematics/angular/utility/parse-name");
const schema_1 = require("./schema");
const utils_1 = require("../../utils");
function buildRelativeModulePath(options, modulePath) {
    const importModulePath = core_1.normalize(`/${options.path}/` +
        (options.flat ? '' : core_1.strings.dasherize(options.name) + '/') +
        core_1.strings.dasherize(options.name) +
        '.module');
    return find_module_1.buildRelativePath(modulePath, importModulePath);
}
function buildRoute(options, modulePath) {
    const relativeModulePath = buildRelativeModulePath(options, modulePath);
    const moduleName = `${core_1.strings.classify(options.name)}Module`;
    const loadChildren = `() => import('${relativeModulePath}').then(m => m.${moduleName})`;
    return `{ path: '${options.route}', loadChildren: ${loadChildren} }`;
}
function addRouteDeclarationToNgModule(options, routingModulePath) {
    return (host) => {
        if (!options.route) {
            return host;
        }
        if (!options.module) {
            throw new Error('Module option required when creating a lazy loaded routing module.');
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
        const sourceText = text.toString();
        const addDeclaration = utils_1.addRouteDeclarationToModule(ts.createSourceFile(path, sourceText, ts.ScriptTarget.Latest, true), path, buildRoute(options, options.module));
        const recorder = host.beginUpdate(path);
        recorder.insertLeft(addDeclaration.pos, addDeclaration.toAdd);
        host.commitUpdate(recorder);
        return host;
    };
}
function getRoutingModulePath(host, options) {
    let path;
    const modulePath = options.module;
    let routingModuleName = modulePath.split('.')[0] + '-routing';
    // Fix routingModuleName
    // (i.e. `/src/app/module/module-routing.module.ts` -> `/module/module-routing.module.ts`)
    if (options.path) {
        routingModuleName = routingModuleName.replace(options.path, '');
    }
    const { module } = options, rest = __rest(options, ["module"]);
    try {
        path = find_module_1.findModuleFromOptions(host, Object.assign({ module: routingModuleName }, rest));
    }
    catch (_a) { }
    return path;
}
function default_1(options) {
    return (host) => __awaiter(this, void 0, void 0, function* () {
        if (options.path === undefined) {
            options.path = yield workspace_1.createDefaultPath(host, options.project);
        }
        // As following, the modulePath has become 'src/app/...'
        if (options.module) {
            options.module = find_module_1.findModuleFromOptions(host, options);
        }
        // Set default route
        options.route = options.route || options.name;
        let routingModulePath;
        const isLazyLoadedModuleGen = options.route && options.module; // must be true
        if (isLazyLoadedModuleGen) {
            options.routingScope = schema_1.RoutingScope.Child;
            routingModulePath = getRoutingModulePath(host, options);
        }
        // Set default path
        options.path = options.path + '/routes';
        const parsedPath = parse_name_1.parseName(options.path, options.name);
        options.name = parsedPath.name;
        options.path = parsedPath.path;
        const templateSource = schematics_1.apply(schematics_1.url('./files'), [
            // options.routing || (isLazyLoadedModuleGen && !!routingModulePath)
            //   ? noop()
            //   : filter(path => !path.endsWith('-routing.module.ts.template')),
            schematics_1.applyTemplates(Object.assign(Object.assign(Object.assign({}, core_1.strings), { 'if-flat': (s) => (options.flat ? '' : s) }), options)),
            schematics_1.move(parsedPath.path),
        ]);
        return schematics_1.chain([
            addRouteDeclarationToNgModule(options, routingModulePath),
            schematics_1.mergeWith(templateSource),
        ]);
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map