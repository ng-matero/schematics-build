import { Tree } from '@angular-devkit/schematics';
import { addPackage } from './package-config';
import { Schema } from './schema';

const VERSION = require('../package.json').version;

/** Add dependencies to package.json */
export function addKeyPkgsToPackageJson(host: Tree) {
  addPackage(host, '@angular/cdk@^8.2.1');
  addPackage(host, 'parse5@^5.1.0', 'dev');
  addPackage(host, `ng-matero@~${VERSION}`);
}

/** Add dependencies to package.json */
export function add3rdPkgsToPackageJson(host: Tree, options: Schema) {
  addPackage(host, '@angular/material@^8.2.1');
  addPackage(host, '@angular/flex-layout@^8.0.0-beta.27');

  if (options.gestures) {
    addPackage(host, 'hammerjs@^2.0.8');
  }

  // 3rd lib
  addPackage(host, '@ngx-formly/core@^5.4.3');
  addPackage(host, '@ngx-formly/material@^5.4.3');
  addPackage(host, '@ngx-progressbar/core@^5.3.2');
  addPackage(host, '@ngx-progressbar/router@^5.3.2');
  addPackage(host, '@ngx-translate/core@^11.0.1');
  addPackage(host, '@ngx-translate/http-loader@^4.0.0');
  addPackage(host, '@ng-select/ng-select@^3.0.7');
  addPackage(host, 'ngx-toastr@^11.1.0');
  addPackage(host, 'photoviewer@^3.4.0');
  addPackage(host, 'screenfull@^4.2.1');

  // Dev
  addPackage(host, '@angularclass/hmr@^2.1.3', 'dev');
  addPackage(host, 'husky@^3.0.1', 'dev');
  addPackage(host, 'prettier@1.18.2', 'dev');
  addPackage(host, 'prettier-stylelint@^0.4.2', 'dev');
  addPackage(host, 'stylelint@^10.1.0', 'dev');
  addPackage(host, 'stylelint-config-recommended-scss@^3.3.0', 'dev');
  addPackage(host, 'stylelint-config-standard@^18.3.0', 'dev');
  addPackage(host, 'stylelint-scss@^3.9.2', 'dev');
}
