//// [declFileTypeAliasWithGeneric.ts]
export type Bar<X, Y> = () => [X, Y];
export type Foo<Y> = Bar<any, Y>;
export const y = (x: Foo<string>) => 1

//// [declFileTypeAliasWithGeneric.js]
"use strict";
exports.y = function (x) { return 1; };


//// [declFileTypeAliasWithGeneric.d.ts]
export declare type Bar<X, Y> = () => [X, Y];
export declare type Foo<Y> = Bar<any, Y>;
export declare const y: (x: () => [any, string]) => number;
