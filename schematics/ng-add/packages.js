"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const package_config_1 = require("./package-config");
const VERSION = require('../package.json').version;
/** Add dependencies to package.json */
function addKeyPkgsToPackageJson(host) {
    package_config_1.addPackage(host, '@angular/cdk@^8.1.3');
    package_config_1.addPackage(host, 'parse5@^5.1.0', 'dev');
    package_config_1.addPackage(host, `ng-matero@~${VERSION}`);
}
exports.addKeyPkgsToPackageJson = addKeyPkgsToPackageJson;
/** Add dependencies to package.json */
function add3rdPkgsToPackageJson(host, options) {
    package_config_1.addPackage(host, '@angular/material@^8.1.3');
    package_config_1.addPackage(host, '@angular/flex-layout@^8.0.0-beta.26');
    if (options.gestures) {
        package_config_1.addPackage(host, 'hammerjs@^2.0.8');
    }
    // 3rd lib
    package_config_1.addPackage(host, '@ngx-formly/core@^5.4.0');
    package_config_1.addPackage(host, '@ngx-formly/material@^5.4.0');
    package_config_1.addPackage(host, '@ngx-progressbar/core@^5.3.2');
    package_config_1.addPackage(host, '@ngx-progressbar/router@^5.3.2');
    package_config_1.addPackage(host, '@ngx-translate/core@^11.0.1');
    package_config_1.addPackage(host, '@ngx-translate/http-loader@^4.0.0');
    package_config_1.addPackage(host, '@ng-select/ng-select@^2.20.3');
    package_config_1.addPackage(host, 'ngx-toastr@^10.0.4');
    package_config_1.addPackage(host, 'screenfull@^4.2.1');
    // Dev
    package_config_1.addPackage(host, '@angularclass/hmr@^2.1.3', 'dev');
    package_config_1.addPackage(host, 'husky@^3.0.1', 'dev');
    package_config_1.addPackage(host, 'prettier@1.18.2', 'dev');
    package_config_1.addPackage(host, 'prettier-stylelint@^0.4.2', 'dev');
    package_config_1.addPackage(host, 'stylelint@^10.1.0', 'dev');
    package_config_1.addPackage(host, 'stylelint-config-recommended-scss@^3.3.0', 'dev');
    package_config_1.addPackage(host, 'stylelint-config-standard@^18.3.0', 'dev');
    package_config_1.addPackage(host, 'stylelint-scss@^3.9.2', 'dev');
}
exports.add3rdPkgsToPackageJson = add3rdPkgsToPackageJson;
//# sourceMappingURL=packages.js.map