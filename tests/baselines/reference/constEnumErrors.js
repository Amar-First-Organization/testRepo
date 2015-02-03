//// [constEnumErrors.ts]
const enum E {
    A
}

module E {
    var x = 1;
}

const enum E1 {
    // illegal case
    // forward reference to the element of the same enum
    X = Y, 
    // forward reference to the element of the same enum
    Y = E1.Z,
    Y1 = E1["Z"]
}

const enum E2 {
    A
}

var y0 = E2[1]
var name = "A";
var y1 = E2[name];

var x = E2;
var y = [E2];

function foo(t: any): void {
}

foo(E2);

const enum NaNOrInfinity {
    A = 9007199254740992,
    B = A * A,
    C = B * B,
    D = C * C,
    E = D * D,
    F = E * E, // overflow
    G = 1 / 0, // overflow
    H = 0 / 0  // NaN
}

const enum E3 {
    X = 1,
    Y =baz().X // incorrect const enum initializer - should be identifier or property access
}

function baz() : typeof E3 { return undefined; }

enum E4 { V = Math.PI }
const enum E5 { V = E4.V } // initializer cannot use non-constant member of regular enums

//// [constEnumErrors.js]
var E;
(function (E) {
    var x = 1;
})(E || (E = {}));
var y0 = E2[1];
var name = "A";
var y1 = E2[name];
var x = E2;
var y = [E2];
function foo(t) {
}
foo(E2);
function baz() {
    return undefined;
}
var E4;
(function (E4) {
    E4[E4["V"] = Math.PI] = "V";
})(E4 || (E4 = {}));
