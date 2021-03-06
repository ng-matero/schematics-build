"use strict";
/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sorts the keys of the given object.
 * @returns A new object instance with sorted keys
 */
function sortObjectByKeys(obj) {
    return Object.keys(obj)
        .sort()
        .reduce((result, key) => (result[key] = obj[key]) && result, {});
}
/** The shortcut of `addPackageToPackageJson` */
function addPackage(host, pkgverion, type = '') {
    const pos = pkgverion.lastIndexOf('@');
    const pkg = pkgverion.substring(0, pos);
    const verstion = pkgverion.substring(pos + 1);
    type === 'dev'
        ? addPackageToPackageJson(host, pkg, verstion, 'devDependencies')
        : addPackageToPackageJson(host, pkg, verstion);
}
exports.addPackage = addPackage;
/** Adds a package to the package.json in the given host tree. */
function addPackageToPackageJson(host, pkg, version, type = 'dependencies') {
    if (host.exists('package.json')) {
        const sourceText = host.read('package.json').toString('utf-8');
        const json = JSON.parse(sourceText);
        if (!json[type]) {
            json[type] = {};
        }
        if (!json[type][pkg]) {
            json[type][pkg] = version;
            json[type] = sortObjectByKeys(json[type]);
        }
        host.overwrite('package.json', JSON.stringify(json, null, 2));
    }
    return host;
}
exports.addPackageToPackageJson = addPackageToPackageJson;
/** Gets the version of the specified package by looking at the package.json in the given tree. */
function getPackageVersionFromPackageJson(tree, name) {
    if (!tree.exists('package.json')) {
        return null;
    }
    const packageJson = JSON.parse(tree.read('package.json').toString('utf8'));
    if (packageJson.dependencies && packageJson.dependencies[name]) {
        return packageJson.dependencies[name];
    }
    return null;
}
exports.getPackageVersionFromPackageJson = getPackageVersionFromPackageJson;
/** Adds scripts to the package.json */
function addScriptToPackageJson(host, name, value) {
    if (host.exists('package.json')) {
        const sourceText = host.read('package.json').toString('utf-8');
        const json = JSON.parse(sourceText);
        if (!json.scripts) {
            json.scripts = {};
        }
        if (!json.scripts[name]) {
            json.scripts[name] = value;
        }
        host.overwrite('package.json', JSON.stringify(json, null, 2));
    }
    return host;
}
exports.addScriptToPackageJson = addScriptToPackageJson;
//# sourceMappingURL=package-config.js.map