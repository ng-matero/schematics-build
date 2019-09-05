import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { Change } from '@schematics/angular/utility/change';
export declare function findRouteNode(node: ts.Node, kind: ts.SyntaxKind, textKey: string, textValue?: string): ts.Node | null;
/**
 * Adds a new route declaration to a router module (i.e. has a RouterModule declaration)
 */
export declare function addRouteDeclarationToModule(source: ts.SourceFile, fileToAdd: string, routeLiteral: string): Change;
