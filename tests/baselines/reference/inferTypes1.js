//// [inferTypes1.ts]
type Unpacked<T> =
    T extends (infer U)[] ? U :
    T extends (...args: any[]) => infer U ? U :
    T extends Promise<infer U> ? U :
    T;

type T00 = Unpacked<string>;  // string
type T01 = Unpacked<string[]>;  // string
type T02 = Unpacked<() => string>;  // string
type T03 = Unpacked<Promise<string>>;  // string
type T04 = Unpacked<Unpacked<Promise<string>[]>>;  // string
type T05 = Unpacked<any>;  // any
type T06 = Unpacked<never>;  // never

type ReturnType<T extends Function> = T extends ((...args: any[]) => infer R) | (new (...args: any[]) => infer R) ? R : any;

function f1(s: string) {
    return { a: 1, b: s };
}

class C {
    x = 0;
    y = 0;
}

type T10 = ReturnType<() => string>;  // string
type T11 = ReturnType<(s: string) => void>;  // void
type T12 = ReturnType<(<T>() => T)>;  // {}
type T13 = ReturnType<(<T extends U, U extends number[]>() => T)>;  // number[]
type T14 = ReturnType<typeof f1>;  // { a: number, b: string }
type T15 = ReturnType<typeof C>;  // C
type T16 = ReturnType<any>;  // any
type T17 = ReturnType<never>;  // any
type T18 = ReturnType<string>;  // Error
type T19 = ReturnType<Function>;  // any

type ArgumentType<T extends (x: any) => any> = T extends (a: infer A) => any ? A : any;

type T20 = ArgumentType<() => void>;  // never
type T21 = ArgumentType<(x: string) => number>;  // string
type T22 = ArgumentType<(x?: string) => number>;  // string | undefined
type T23 = ArgumentType<(...args: string[]) => number>;  // string
type T24 = ArgumentType<(x: string, y: string) => number>;  // Error
type T25 = ArgumentType<Function>;  // Error
type T26 = ArgumentType<any>;  // any
type T27 = ArgumentType<never>;  // any

type X1<T extends { x: any, y: any }> = T extends { x: infer X, y: infer Y } ? [X, Y] : any;

type T30 = X1<{ x: any, y: any }>;  // [any, any]
type T31 = X1<{ x: number, y: string }>;  // [number, string]
type T32 = X1<{ x: number, y: string, z: boolean }>;  // [number, string]

type X2<T> = T extends { a: infer U, b: infer U } ? U : never;

type T40 = X2<{}>;  // never
type T41 = X2<{ a: string }>;  // never
type T42 = X2<{ a: string, b: string }>;  // string
type T43 = X2<{ a: number, b: string }>;  // string | number
type T44 = X2<{ a: number, b: string, c: boolean }>;  // string | number

type X3<T> = T extends { a: (x: infer U) => void, b: (x: infer U) => void } ? U : never;

type T50 = X3<{}>;  // never
type T51 = X3<{ a: (x: string) => void }>;  // never
type T52 = X3<{ a: (x: string) => void, b: (x: string) => void }>;  // string
type T53 = X3<{ a: (x: number) => void, b: (x: string) => void }>;  // string & number
type T54 = X3<{ a: (x: number) => void, b: () => void }>;  // number

type T60 = infer U;  // Error
type T61<T> = infer A extends infer B ? infer C : infer D;  // Error
type T62<T> = U extends (infer U)[] ? U : U;  // Error


//// [inferTypes1.js]
"use strict";
function f1(s) {
    return { a: 1, b: s };
}
var C = /** @class */ (function () {
    function C() {
        this.x = 0;
        this.y = 0;
    }
    return C;
}());
