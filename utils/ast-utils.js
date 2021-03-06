"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript");
const ast_utils_1 = require("@schematics/angular/utility/ast-utils");
function findRouteNode(node, kind, textKey, textValue) {
    if (node.kind === kind &&
        node.getText() === textKey &&
        node.parent.initializer.text === textValue) {
        // throw new Error(node.getText());
        return node.parent.parent;
    }
    let foundNode = null;
    ts.forEachChild(node, childNode => {
        foundNode = foundNode || findRouteNode(childNode, kind, textKey, textValue);
    });
    return foundNode;
}
exports.findRouteNode = findRouteNode;
function findRouteNodeByKey(node, kind, textKey) {
    let foundNode = null;
    ts.forEachChild(node, (childNode) => {
        if (childNode.initializer.kind === kind && childNode.name.text === textKey) {
            foundNode = childNode.initializer;
        }
    });
    return foundNode;
}
exports.findRouteNodeByKey = findRouteNodeByKey;
/**
 * Adds a new route declaration to a router module (i.e. has a RouterModule declaration)
 */
function addRouteDeclarationToModule(source, fileToAdd, routeLiteral) {
    const routerModuleExpr = ast_utils_1.getRouterModuleDeclaration(source);
    if (!routerModuleExpr) {
        throw new Error(`Couldn't find a route declaration in ${fileToAdd}.`);
    }
    const scopeConfigMethodArgs = routerModuleExpr.arguments;
    if (!scopeConfigMethodArgs.length) {
        const { line } = source.getLineAndCharacterOfPosition(routerModuleExpr.getStart());
        throw new Error(`The router module method doesn't have arguments ` + `at line ${line} in ${fileToAdd}`);
    }
    let routesArr;
    const routesArg = scopeConfigMethodArgs[0];
    // Check if the route declarations array is
    // an inlined argument of RouterModule or a standalone variable
    if (ts.isArrayLiteralExpression(routesArg)) {
        routesArr = routesArg;
    }
    else {
        const routesVarName = routesArg.getText();
        let routesVar;
        if (routesArg.kind === ts.SyntaxKind.Identifier) {
            routesVar = source.statements
                .filter((s) => s.kind === ts.SyntaxKind.VariableStatement)
                .find((v) => {
                return v.declarationList.declarations[0].name.getText() === routesVarName;
            });
        }
        if (!routesVar) {
            const { line } = source.getLineAndCharacterOfPosition(routesArg.getStart());
            throw new Error(`No route declaration array was found that corresponds ` +
                `to router module at line ${line} in ${fileToAdd}`);
        }
        routesArr = ast_utils_1.findNodes(routesVar, ts.SyntaxKind.ArrayLiteralExpression, 1)[0];
    }
    const occurencesCount = routesArr.elements.length;
    const text = routesArr.getFullText(source);
    let route = routeLiteral;
    if (occurencesCount > 0) {
        const identation = text.match(/\r?\n(\r?)\s*/) || [];
        route = `,${identation[0] || ' '}${routeLiteral}`;
    }
    // Find a route which `path` equals to `''`
    const routeNodeInsertedTo = findRouteNode(routesArr, ts.SyntaxKind.Identifier, 'path', '');
    if (!routeNodeInsertedTo) {
        throw new Error(`Couldn't find a route definition which path is empty string`);
    }
    const routeNodeChildren = findRouteNodeByKey(routeNodeInsertedTo, ts.SyntaxKind.ArrayLiteralExpression, 'children');
    return ast_utils_1.insertAfterLastOccurrence(routeNodeChildren.elements, route, fileToAdd, routeNodeChildren.elements.pos, ts.SyntaxKind.ObjectLiteralExpression);
}
exports.addRouteDeclarationToModule = addRouteDeclarationToModule;
//# sourceMappingURL=ast-utils.js.map