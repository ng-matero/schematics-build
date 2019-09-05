import { WorkspaceProject, WorkspaceSchema } from '@angular-devkit/core/src/experimental/workspace';
import { Tree } from '@angular-devkit/schematics';
/** Adds a theming style entry to the given project target options. */
export declare function addThemeStyleToTarget(project: WorkspaceProject, targetName: 'test' | 'build', host: Tree, assetPath: string, workspace: WorkspaceSchema): void;
