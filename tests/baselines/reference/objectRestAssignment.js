//// [objectRestAssignment.ts]
let ka: any;
let nested: { ki };
let other: number;
let rest: { };
let complex: { x: { ka, ki }, y: number };
({x: { ka, ...nested }, y: other, ...rest} = complex);

// should be:
let overEmit: { a: { ka: string, x: string }[], b: { z: string, ki: string, ku: string }, ke: string, ko: string };

// var _g = overEmit.a, [_h, ...y] = _g, nested2 = __rest(_h, []), _j = overEmit.b, { z } = _j, c = __rest(_j, ["z"]), rest2 = __rest(overEmit, ["a", "b"]);
var { a: [{ ...nested2 }, ...y], b: { z, ...c }, ...rest2 } = overEmit;
({ a: [{ ...nested2 }, ...y], b: { z, ...c }, ...rest2 } = overEmit);


//// [objectRestAssignment.js]
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && !e.indexOf(p))
        t[p] = s[p];
    return t;
};
let ka;
let nested;
let other;
let rest;
let complex;
(_a = complex.x, { ka } = _a, nested = __rest(_a, ["ka"]), { y: other } = complex, rest = __rest(complex, ["x", "y"]), complex);
// should be:
let overEmit;
// var _g = overEmit.a, [_h, ...y] = _g, nested2 = __rest(_h, []), _j = overEmit.b, { z } = _j, c = __rest(_j, ["z"]), rest2 = __rest(overEmit, ["a", "b"]);
var _b = overEmit.a, [_c, ...y] = _b, nested2 = __rest(_c, []), _d = overEmit.b, { z } = _d, c = __rest(_d, ["z"]), rest2 = __rest(overEmit, ["a", "b"]);
(_e = overEmit.a, [_f, ...y] = _e, nested2 = __rest(_f, []), _g = overEmit.b, { z } = _g, c = __rest(_g, ["z"]), rest2 = __rest(overEmit, ["a", "b"]), overEmit);
var _a, _e, _f, _g;
