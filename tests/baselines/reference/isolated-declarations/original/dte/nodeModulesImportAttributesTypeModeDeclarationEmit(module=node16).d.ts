//// [tests/cases/conformance/node/nodeModulesImportAttributesTypeModeDeclarationEmit.ts] ////

//// [index.ts]
export type LocalInterface =
    & import("pkg", { with: {"resolution-mode": "require"} }).RequireInterface
    & import("pkg", { with: {"resolution-mode": "import"} }).ImportInterface;

export const a = (null as any as import("pkg", { with: {"resolution-mode": "require"} }).RequireInterface);
export const b = (null as any as import("pkg", { with: {"resolution-mode": "import"} }).ImportInterface);

//// [package.json]
{
    "name": "pkg",
    "version": "0.0.1",
    "exports": {
        "import": "./import.js",
        "require": "./require.js"
    }
}
//// [import.d.ts]
export interface ImportInterface {}
//// [require.d.ts]
export interface RequireInterface {}

/// [Declarations] ////



//// [/.src/out/index.d.ts]
export type LocalInterface = import("pkg", { with: { "resolution-mode": "require" } }).RequireInterface & import("pkg", { with: { "resolution-mode": "import" } }).ImportInterface;
export declare const a: import("pkg", { with: { "resolution-mode": "require" } }).RequireInterface;
export declare const b: import("pkg", { with: { "resolution-mode": "import" } }).ImportInterface;
