import { Tree } from '@angular-devkit/schematics';
import { addPackage } from './package-config';
import { Schema } from './schema';

const VERSION = require('../package.json').version;

/** Add dependencies to package.json */
export function addKeyPkgsToPackageJson(host: Tree) {
  addPackage(host, '@angular/cdk@~9.1.2');
  addPackage(host, 'parse5@~5.1.1', 'dev');
  addPackage(host, `ng-matero@~${VERSION}`);
}

/** Add dependencies to package.json */
export function add3rdPkgsToPackageJson(host: Tree) {
  addPackage(host, '@angular/material@~9.1.2');
  addPackage(host, '@angular/flex-layout@^9.0.0-beta.29');

  // 3rd lib
  addPackage(host, '@ng-matero/extensions@^9.0.0');
  addPackage(host, '@ng-select/ng-select@^3.7.3');
  addPackage(host, '@ngx-formly/core@^5.5.14');
  addPackage(host, '@ngx-formly/material@^5.5.14');
  addPackage(host, '@ngx-progressbar/core@~5.3.2');
  addPackage(host, '@ngx-progressbar/router@~5.3.2');
  addPackage(host, '@ngx-translate/core@^12.1.2');
  addPackage(host, '@ngx-translate/http-loader@~4.0.0');
  addPackage(host, 'ngx-toastr@^12.0.0');
  addPackage(host, 'photoviewer@^3.4.0');
  addPackage(host, 'screenfull@^4.2.1');

  // Dev
  addPackage(host, '@angularclass/hmr@^2.1.3', 'dev');
  addPackage(host, 'prettier@^1.19.1', 'dev');
  addPackage(host, 'prettier-stylelint@^0.4.2', 'dev');
  addPackage(host, 'stylelint@^13.2.0', 'dev');
  addPackage(host, 'stylelint-config-recommended-scss@^4.2.0', 'dev');
  addPackage(host, 'stylelint-config-standard@^20.0.0', 'dev');
  addPackage(host, 'stylelint-scss@^3.14.2', 'dev');
}
