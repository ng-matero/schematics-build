"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@schematics/angular/utility/config");
const schematics_1 = require("@angular/cdk/schematics");
const utils_1 = require("../utils");
/** Adds the Material Design fonts to the index HTML file. */
function addLoaderToIndex(options) {
    return (host) => {
        const workspace = config_1.getWorkspace(host);
        const project = schematics_1.getProjectFromWorkspace(workspace, options.project);
        const projectIndexHtmlPath = utils_1.getIndexHtmlPath(project);
        const loaderStyles = `
    .global-loader {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1999;
      width: 100%;
      height: 100%;
      background-color: #fff;
      opacity: 1;
      transition: opacity .5s ease-in-out;
    }

    .global-loader-fade-in {
      opacity: 0;
    }

    .global-loader-hidden {
      display: none;
    }

    .global-loader h1 {
      font-family: "Helvetica Neue", Helvetica, sans-serif;
      font-weight: normal;
      font-size: 24px;
      letter-spacing: 0.04rem;
      white-space: pre;

      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      background-image: repeating-linear-gradient(to right,
          #F44336, #9C27B0, #3F51B5, #03A9F4, #009688, #8BC34A, #FFEB3B, #FF9800);
      background-size: 750% auto;
      background-position: 0 100%;
      animation: gradient 20s infinite;
      animation-fill-mode: forwards;
      animation-timing-function: linear;
    }

    @keyframes gradient {
      0% {
        background-position: 0 0;
      }

      100% {
        background-position: -750% 0;
      }
    }
    `;
        const loaderHtml = `<div id="globalLoader" class="global-loader"><h1>LOADING</h1></div>`;
        utils_1.appendHtmlElement(host, projectIndexHtmlPath, `<style type="text/css">${loaderStyles}</style>`, 'head');
        utils_1.appendHtmlElement(host, projectIndexHtmlPath, loaderHtml, 'body');
        return host;
    };
}
exports.addLoaderToIndex = addLoaderToIndex;
//# sourceMappingURL=global-loader.js.map