"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const package_config_1 = require("./package-config");
const VERSION = require('../package.json').version;
/** Add dependencies to package.json */
function addKeyPkgsToPackageJson(host) {
    package_config_1.addPackage(host, '@angular/cdk@~9.1.2');
    package_config_1.addPackage(host, 'parse5@~5.1.1', 'dev');
    package_config_1.addPackage(host, `ng-matero@~${VERSION}`);
}
exports.addKeyPkgsToPackageJson = addKeyPkgsToPackageJson;
/** Add dependencies to package.json */
function add3rdPkgsToPackageJson(host) {
    package_config_1.addPackage(host, '@angular/material@~9.1.2');
    package_config_1.addPackage(host, '@angular/flex-layout@^9.0.0-beta.29');
    // 3rd lib
    package_config_1.addPackage(host, '@ng-matero/extensions@^9.0.0');
    package_config_1.addPackage(host, '@ng-select/ng-select@^3.7.3');
    package_config_1.addPackage(host, '@ngx-formly/core@^5.5.14');
    package_config_1.addPackage(host, '@ngx-formly/material@^5.5.14');
    package_config_1.addPackage(host, '@ngx-progressbar/core@~5.3.2');
    package_config_1.addPackage(host, '@ngx-progressbar/router@~5.3.2');
    package_config_1.addPackage(host, '@ngx-translate/core@^12.1.2');
    package_config_1.addPackage(host, '@ngx-translate/http-loader@~4.0.0');
    package_config_1.addPackage(host, 'ngx-toastr@^12.0.0');
    package_config_1.addPackage(host, 'photoviewer@^3.4.0');
    package_config_1.addPackage(host, 'screenfull@^4.2.1');
    // Dev
    package_config_1.addPackage(host, '@angularclass/hmr@^2.1.3', 'dev');
    package_config_1.addPackage(host, 'prettier@^1.19.1', 'dev');
    package_config_1.addPackage(host, 'prettier-stylelint@^0.4.2', 'dev');
    package_config_1.addPackage(host, 'stylelint@^13.2.0', 'dev');
    package_config_1.addPackage(host, 'stylelint-config-recommended-scss@^4.2.0', 'dev');
    package_config_1.addPackage(host, 'stylelint-config-standard@^20.0.0', 'dev');
    package_config_1.addPackage(host, 'stylelint-scss@^3.14.2', 'dev');
}
exports.add3rdPkgsToPackageJson = add3rdPkgsToPackageJson;
//# sourceMappingURL=packages.js.map