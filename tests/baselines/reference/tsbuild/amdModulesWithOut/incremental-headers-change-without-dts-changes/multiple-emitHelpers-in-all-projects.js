Input::
//// [/src/lib/file1.ts]
export const x = 10;function forlibfile1Rest() { }



Output::
/lib/tsc --b /src/app --verbose
[[90m12:08:00 AM[0m] Projects in this build: 
    * src/lib/tsconfig.json
    * src/app/tsconfig.json

[[90m12:08:00 AM[0m] Project 'src/lib/tsconfig.json' is out of date because oldest output 'src/lib/module.js' is older than newest input 'src/lib/file1.ts'

[[90m12:08:00 AM[0m] Building project '/src/lib/tsconfig.json'...

[[90m12:08:00 AM[0m] Project 'src/app/tsconfig.json' is out of date because output of its dependency 'src/lib' has changed

[[90m12:08:00 AM[0m] Updating output of project '/src/app/tsconfig.json'...

[[90m12:08:00 AM[0m] Updating unchanged output timestamps of project '/src/app/tsconfig.json'...

exitCode:: ExitStatus.Success


//// [/src/app/module.js]
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var myGlob = 20;
function libfile0Spread() {
    var b = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        b[_i] = arguments[_i];
    }
}
libfile0Spread.apply(void 0, [10, 20, 30]);
define("file1", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.x = void 0;
    exports.x = 10;
    function forlibfile1Rest() { }
});
define("file2", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.y = void 0;
    exports.y = 20;
});
var globalConst = 10;
define("file3", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.z = void 0;
    exports.z = 30;
    function forappfile3Rest() {
        var _a = { a: 10, b: 30, yy: 30 }, b = _a.b, rest = __rest(_a, ["b"]);
    }
});
var myVar = 30;
function appfile4Spread() {
    var b = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        b[_i] = arguments[_i];
    }
}
appfile4Spread.apply(void 0, [10, 20, 30]);
//# sourceMappingURL=module.js.map

//// [/src/app/module.js.map]
{"version":3,"file":"module.js","sourceRoot":"","sources":["../lib/file0.ts","../lib/file1.ts","../lib/file2.ts","../lib/global.ts","file3.ts","file4.ts"],"names":[],"mappings":";;;;;;;;;;;AAAA,IAAM,MAAM,GAAG,EAAE,CAAC;AAClB,SAAS,cAAc;IAAC,WAAc;SAAd,UAAc,EAAd,qBAAc,EAAd,IAAc;QAAd,sBAAc;;AAAI,CAAC;AAC3C,cAAc,eAAI,CAAC,EAAE,EAAE,EAAE,EAAE,EAAE,CAAC,EAAE;;;;;ICFnB,QAAA,CAAC,GAAG,EAAE,CAAC;IAAA,SAAS,eAAe,KAAK,CAAC;;;;;;ICArC,QAAA,CAAC,GAAG,EAAE,CAAC;;ACApB,IAAM,WAAW,GAAG,EAAE,CAAC;;;;;ICAV,QAAA,CAAC,GAAG,EAAE,CAAC;IACM,SAAS,eAAe;QAClD,IAAM,KAAiB,EAAE,CAAC,EAAE,EAAE,EAAE,CAAC,EAAE,EAAE,EAAE,EAAE,EAAE,EAAE,EAAE,EAAvC,CAAC,OAAA,EAAK,IAAI,cAAZ,KAAc,CAA2B,CAAC;IAChD,CAAC;;ACHD,IAAM,KAAK,GAAG,EAAE,CAAC;AACjB,SAAS,cAAc;IAAC,WAAc;SAAd,UAAc,EAAd,qBAAc,EAAd,IAAc;QAAd,sBAAc;;AAAI,CAAC;AAC3C,cAAc,eAAI,CAAC,EAAE,EAAE,EAAE,EAAE,EAAE,CAAC,EAAE"}

//// [/src/app/module.js.map.baseline.txt]
===================================================================
JsFile: module.js
mapUrl: module.js.map
sourceRoot: 
sources: ../lib/file0.ts,../lib/file1.ts,../lib/file2.ts,../lib/global.ts,file3.ts,file4.ts
===================================================================
-------------------------------------------------------------------
emittedFile:/src/app/module.js
sourceFile:../lib/file0.ts
-------------------------------------------------------------------
>>>var __rest = (this && this.__rest) || function (s, e) {
>>>    var t = {};
>>>    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
>>>        t[p] = s[p];
>>>    if (s != null && typeof Object.getOwnPropertySymbols === "function")
>>>        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
>>>            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
>>>                t[p[i]] = s[p[i]];
>>>        }
>>>    return t;
>>>};
>>>var myGlob = 20;
1 >
2 >^^^^
3 >    ^^^^^^
4 >          ^^^
5 >             ^^
6 >               ^
7 >                ^^^^^^^^^^^^->
1 >
2 >const 
3 >    myGlob
4 >           = 
5 >             20
6 >               ;
1 >Emitted(12, 1) Source(1, 1) + SourceIndex(0)
2 >Emitted(12, 5) Source(1, 7) + SourceIndex(0)
3 >Emitted(12, 11) Source(1, 13) + SourceIndex(0)
4 >Emitted(12, 14) Source(1, 16) + SourceIndex(0)
5 >Emitted(12, 16) Source(1, 18) + SourceIndex(0)
6 >Emitted(12, 17) Source(1, 19) + SourceIndex(0)
---
>>>function libfile0Spread() {
1->
2 >^^^^^^^^^
3 >         ^^^^^^^^^^^^^^
1->
  >
2 >function 
3 >         libfile0Spread
1->Emitted(13, 1) Source(2, 1) + SourceIndex(0)
2 >Emitted(13, 10) Source(2, 10) + SourceIndex(0)
3 >Emitted(13, 24) Source(2, 24) + SourceIndex(0)
---
>>>    var b = [];
1 >^^^^
2 >    ^^^^^^^^^^^
3 >               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^->
1 >(
2 >    ...b: number[]
1 >Emitted(14, 5) Source(2, 25) + SourceIndex(0)
2 >Emitted(14, 16) Source(2, 39) + SourceIndex(0)
---
>>>    for (var _i = 0; _i < arguments.length; _i++) {
1->^^^^^^^^^
2 >         ^^^^^^^^^^
3 >                   ^^
4 >                     ^^^^^^^^^^^^^^^^^^^^^
5 >                                          ^^
6 >                                            ^^^^
1->
2 >         ...b: number[]
3 >                   
4 >                     ...b: number[]
5 >                                          
6 >                                            ...b: number[]
1->Emitted(15, 10) Source(2, 25) + SourceIndex(0)
2 >Emitted(15, 20) Source(2, 39) + SourceIndex(0)
3 >Emitted(15, 22) Source(2, 25) + SourceIndex(0)
4 >Emitted(15, 43) Source(2, 39) + SourceIndex(0)
5 >Emitted(15, 45) Source(2, 25) + SourceIndex(0)
6 >Emitted(15, 49) Source(2, 39) + SourceIndex(0)
---
>>>        b[_i] = arguments[_i];
1 >^^^^^^^^
2 >        ^^^^^^^^^^^^^^^^^^^^^^
1 >
2 >        ...b: number[]
1 >Emitted(16, 9) Source(2, 25) + SourceIndex(0)
2 >Emitted(16, 31) Source(2, 39) + SourceIndex(0)
---
>>>    }
>>>}
1 >
2 >^
3 > ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^->
1 >) { 
2 >}
1 >Emitted(18, 1) Source(2, 43) + SourceIndex(0)
2 >Emitted(18, 2) Source(2, 44) + SourceIndex(0)
---
>>>libfile0Spread.apply(void 0, [10, 20, 30]);
1->
2 >^^^^^^^^^^^^^^
3 >              ^^^^^^^^^^^^^^^
4 >                             ^
5 >                              ^^
6 >                                ^^
7 >                                  ^^
8 >                                    ^^
9 >                                      ^^
10>                                        ^
11>                                         ^^
12>                                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^->
1->
  >
2 >libfile0Spread
3 >              (...
4 >                             [
5 >                              10
6 >                                , 
7 >                                  20
8 >                                    , 
9 >                                      30
10>                                        ]
11>                                         );
1->Emitted(19, 1) Source(3, 1) + SourceIndex(0)
2 >Emitted(19, 15) Source(3, 15) + SourceIndex(0)
3 >Emitted(19, 30) Source(3, 19) + SourceIndex(0)
4 >Emitted(19, 31) Source(3, 20) + SourceIndex(0)
5 >Emitted(19, 33) Source(3, 22) + SourceIndex(0)
6 >Emitted(19, 35) Source(3, 24) + SourceIndex(0)
7 >Emitted(19, 37) Source(3, 26) + SourceIndex(0)
8 >Emitted(19, 39) Source(3, 28) + SourceIndex(0)
9 >Emitted(19, 41) Source(3, 30) + SourceIndex(0)
10>Emitted(19, 42) Source(3, 31) + SourceIndex(0)
11>Emitted(19, 44) Source(3, 33) + SourceIndex(0)
---
-------------------------------------------------------------------
emittedFile:/src/app/module.js
sourceFile:../lib/file1.ts
-------------------------------------------------------------------
>>>define("file1", ["require", "exports"], function (require, exports) {
>>>    "use strict";
>>>    Object.defineProperty(exports, "__esModule", { value: true });
>>>    exports.x = void 0;
>>>    exports.x = 10;
1->^^^^
2 >    ^^^^^^^^
3 >            ^
4 >             ^^^
5 >                ^^
6 >                  ^
7 >                   ^^^^^^^^^^^^^^^^->
1->export const 
2 >    
3 >            x
4 >              = 
5 >                10
6 >                  ;
1->Emitted(24, 5) Source(1, 14) + SourceIndex(1)
2 >Emitted(24, 13) Source(1, 14) + SourceIndex(1)
3 >Emitted(24, 14) Source(1, 15) + SourceIndex(1)
4 >Emitted(24, 17) Source(1, 18) + SourceIndex(1)
5 >Emitted(24, 19) Source(1, 20) + SourceIndex(1)
6 >Emitted(24, 20) Source(1, 21) + SourceIndex(1)
---
>>>    function forlibfile1Rest() { }
1->^^^^
2 >    ^^^^^^^^^
3 >             ^^^^^^^^^^^^^^^
4 >                            ^^^^^
5 >                                 ^
1->
2 >    function 
3 >             forlibfile1Rest
4 >                            () { 
5 >                                 }
1->Emitted(25, 5) Source(1, 21) + SourceIndex(1)
2 >Emitted(25, 14) Source(1, 30) + SourceIndex(1)
3 >Emitted(25, 29) Source(1, 45) + SourceIndex(1)
4 >Emitted(25, 34) Source(1, 50) + SourceIndex(1)
5 >Emitted(25, 35) Source(1, 51) + SourceIndex(1)
---
-------------------------------------------------------------------
emittedFile:/src/app/module.js
sourceFile:../lib/file2.ts
-------------------------------------------------------------------
>>>});
>>>define("file2", ["require", "exports"], function (require, exports) {
>>>    "use strict";
>>>    Object.defineProperty(exports, "__esModule", { value: true });
>>>    exports.y = void 0;
>>>    exports.y = 20;
1 >^^^^
2 >    ^^^^^^^^
3 >            ^
4 >             ^^^
5 >                ^^
6 >                  ^
1 >export const 
2 >    
3 >            y
4 >              = 
5 >                20
6 >                  ;
1 >Emitted(31, 5) Source(1, 14) + SourceIndex(2)
2 >Emitted(31, 13) Source(1, 14) + SourceIndex(2)
3 >Emitted(31, 14) Source(1, 15) + SourceIndex(2)
4 >Emitted(31, 17) Source(1, 18) + SourceIndex(2)
5 >Emitted(31, 19) Source(1, 20) + SourceIndex(2)
6 >Emitted(31, 20) Source(1, 21) + SourceIndex(2)
---
-------------------------------------------------------------------
emittedFile:/src/app/module.js
sourceFile:../lib/global.ts
-------------------------------------------------------------------
>>>});
>>>var globalConst = 10;
1 >
2 >^^^^
3 >    ^^^^^^^^^^^
4 >               ^^^
5 >                  ^^
6 >                    ^
7 >                     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^->
1 >
2 >const 
3 >    globalConst
4 >                = 
5 >                  10
6 >                    ;
1 >Emitted(33, 1) Source(1, 1) + SourceIndex(3)
2 >Emitted(33, 5) Source(1, 7) + SourceIndex(3)
3 >Emitted(33, 16) Source(1, 18) + SourceIndex(3)
4 >Emitted(33, 19) Source(1, 21) + SourceIndex(3)
5 >Emitted(33, 21) Source(1, 23) + SourceIndex(3)
6 >Emitted(33, 22) Source(1, 24) + SourceIndex(3)
---
-------------------------------------------------------------------
emittedFile:/src/app/module.js
sourceFile:file3.ts
-------------------------------------------------------------------
>>>define("file3", ["require", "exports"], function (require, exports) {
>>>    "use strict";
>>>    Object.defineProperty(exports, "__esModule", { value: true });
>>>    exports.z = void 0;
>>>    exports.z = 30;
1->^^^^
2 >    ^^^^^^^^
3 >            ^
4 >             ^^^
5 >                ^^
6 >                  ^
7 >                   ^^^^^^^^^^^^^^->
1->export const 
2 >    
3 >            z
4 >              = 
5 >                30
6 >                  ;
1->Emitted(38, 5) Source(1, 14) + SourceIndex(4)
2 >Emitted(38, 13) Source(1, 14) + SourceIndex(4)
3 >Emitted(38, 14) Source(1, 15) + SourceIndex(4)
4 >Emitted(38, 17) Source(1, 18) + SourceIndex(4)
5 >Emitted(38, 19) Source(1, 20) + SourceIndex(4)
6 >Emitted(38, 20) Source(1, 21) + SourceIndex(4)
---
>>>    function forappfile3Rest() {
1->^^^^
2 >    ^^^^^^^^^
3 >             ^^^^^^^^^^^^^^^
4 >                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^->
1->
  >import { x } from "file1";
2 >    function 
3 >             forappfile3Rest
1->Emitted(39, 5) Source(2, 27) + SourceIndex(4)
2 >Emitted(39, 14) Source(2, 36) + SourceIndex(4)
3 >Emitted(39, 29) Source(2, 51) + SourceIndex(4)
---
>>>        var _a = { a: 10, b: 30, yy: 30 }, b = _a.b, rest = __rest(_a, ["b"]);
1->^^^^^^^^
2 >        ^^^^
3 >            ^^^^^
4 >                 ^^
5 >                   ^
6 >                    ^^
7 >                      ^^
8 >                        ^^
9 >                          ^
10>                           ^^
11>                             ^^
12>                               ^^
13>                                 ^^
14>                                   ^^
15>                                     ^^
16>                                       ^^
17>                                         ^^
18>                                           ^
19>                                            ^^^^^^^
20>                                                   ^^
21>                                                     ^^^^
22>                                                         ^^^^^^^^^^^^^^
23>                                                                       ^^^^^
24>                                                                            ^
25>                                                                             ^
1->() {
  >
2 >        const 
3 >            { b, ...rest } = 
4 >                 { 
5 >                   a
6 >                    : 
7 >                      10
8 >                        , 
9 >                          b
10>                           : 
11>                             30
12>                               , 
13>                                 yy
14>                                   : 
15>                                     30
16>                                        }
17>                                         
18>                                           b
19>                                            
20>                                                   , ...
21>                                                     rest
22>                                                         
23>                                                                       { b, ...rest }
24>                                                                             = { a: 10, b: 30, yy: 30 }
25>                                                                             ;
1->Emitted(40, 9) Source(3, 1) + SourceIndex(4)
2 >Emitted(40, 13) Source(3, 7) + SourceIndex(4)
3 >Emitted(40, 18) Source(3, 24) + SourceIndex(4)
4 >Emitted(40, 20) Source(3, 26) + SourceIndex(4)
5 >Emitted(40, 21) Source(3, 27) + SourceIndex(4)
6 >Emitted(40, 23) Source(3, 29) + SourceIndex(4)
7 >Emitted(40, 25) Source(3, 31) + SourceIndex(4)
8 >Emitted(40, 27) Source(3, 33) + SourceIndex(4)
9 >Emitted(40, 28) Source(3, 34) + SourceIndex(4)
10>Emitted(40, 30) Source(3, 36) + SourceIndex(4)
11>Emitted(40, 32) Source(3, 38) + SourceIndex(4)
12>Emitted(40, 34) Source(3, 40) + SourceIndex(4)
13>Emitted(40, 36) Source(3, 42) + SourceIndex(4)
14>Emitted(40, 38) Source(3, 44) + SourceIndex(4)
15>Emitted(40, 40) Source(3, 46) + SourceIndex(4)
16>Emitted(40, 42) Source(3, 48) + SourceIndex(4)
17>Emitted(40, 44) Source(3, 9) + SourceIndex(4)
18>Emitted(40, 45) Source(3, 10) + SourceIndex(4)
19>Emitted(40, 52) Source(3, 10) + SourceIndex(4)
20>Emitted(40, 54) Source(3, 15) + SourceIndex(4)
21>Emitted(40, 58) Source(3, 19) + SourceIndex(4)
22>Emitted(40, 72) Source(3, 7) + SourceIndex(4)
23>Emitted(40, 77) Source(3, 21) + SourceIndex(4)
24>Emitted(40, 78) Source(3, 48) + SourceIndex(4)
25>Emitted(40, 79) Source(3, 49) + SourceIndex(4)
---
>>>    }
1 >^^^^
2 >    ^
1 >
  >
2 >    }
1 >Emitted(41, 5) Source(4, 1) + SourceIndex(4)
2 >Emitted(41, 6) Source(4, 2) + SourceIndex(4)
---
-------------------------------------------------------------------
emittedFile:/src/app/module.js
sourceFile:file4.ts
-------------------------------------------------------------------
>>>});
>>>var myVar = 30;
1 >
2 >^^^^
3 >    ^^^^^
4 >         ^^^
5 >            ^^
6 >              ^
7 >               ^^^^^^^^^^^^^->
1 >
2 >const 
3 >    myVar
4 >          = 
5 >            30
6 >              ;
1 >Emitted(43, 1) Source(1, 1) + SourceIndex(5)
2 >Emitted(43, 5) Source(1, 7) + SourceIndex(5)
3 >Emitted(43, 10) Source(1, 12) + SourceIndex(5)
4 >Emitted(43, 13) Source(1, 15) + SourceIndex(5)
5 >Emitted(43, 15) Source(1, 17) + SourceIndex(5)
6 >Emitted(43, 16) Source(1, 18) + SourceIndex(5)
---
>>>function appfile4Spread() {
1->
2 >^^^^^^^^^
3 >         ^^^^^^^^^^^^^^
1->
  >
2 >function 
3 >         appfile4Spread
1->Emitted(44, 1) Source(2, 1) + SourceIndex(5)
2 >Emitted(44, 10) Source(2, 10) + SourceIndex(5)
3 >Emitted(44, 24) Source(2, 24) + SourceIndex(5)
---
>>>    var b = [];
1 >^^^^
2 >    ^^^^^^^^^^^
3 >               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^->
1 >(
2 >    ...b: number[]
1 >Emitted(45, 5) Source(2, 25) + SourceIndex(5)
2 >Emitted(45, 16) Source(2, 39) + SourceIndex(5)
---
>>>    for (var _i = 0; _i < arguments.length; _i++) {
1->^^^^^^^^^
2 >         ^^^^^^^^^^
3 >                   ^^
4 >                     ^^^^^^^^^^^^^^^^^^^^^
5 >                                          ^^
6 >                                            ^^^^
1->
2 >         ...b: number[]
3 >                   
4 >                     ...b: number[]
5 >                                          
6 >                                            ...b: number[]
1->Emitted(46, 10) Source(2, 25) + SourceIndex(5)
2 >Emitted(46, 20) Source(2, 39) + SourceIndex(5)
3 >Emitted(46, 22) Source(2, 25) + SourceIndex(5)
4 >Emitted(46, 43) Source(2, 39) + SourceIndex(5)
5 >Emitted(46, 45) Source(2, 25) + SourceIndex(5)
6 >Emitted(46, 49) Source(2, 39) + SourceIndex(5)
---
>>>        b[_i] = arguments[_i];
1 >^^^^^^^^
2 >        ^^^^^^^^^^^^^^^^^^^^^^
1 >
2 >        ...b: number[]
1 >Emitted(47, 9) Source(2, 25) + SourceIndex(5)
2 >Emitted(47, 31) Source(2, 39) + SourceIndex(5)
---
>>>    }
>>>}
1 >
2 >^
3 > ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^->
1 >) { 
2 >}
1 >Emitted(49, 1) Source(2, 43) + SourceIndex(5)
2 >Emitted(49, 2) Source(2, 44) + SourceIndex(5)
---
>>>appfile4Spread.apply(void 0, [10, 20, 30]);
1->
2 >^^^^^^^^^^^^^^
3 >              ^^^^^^^^^^^^^^^
4 >                             ^
5 >                              ^^
6 >                                ^^
7 >                                  ^^
8 >                                    ^^
9 >                                      ^^
10>                                        ^
11>                                         ^^
1->
  >
2 >appfile4Spread
3 >              (...
4 >                             [
5 >                              10
6 >                                , 
7 >                                  20
8 >                                    , 
9 >                                      30
10>                                        ]
11>                                         );
1->Emitted(50, 1) Source(3, 1) + SourceIndex(5)
2 >Emitted(50, 15) Source(3, 15) + SourceIndex(5)
3 >Emitted(50, 30) Source(3, 19) + SourceIndex(5)
4 >Emitted(50, 31) Source(3, 20) + SourceIndex(5)
5 >Emitted(50, 33) Source(3, 22) + SourceIndex(5)
6 >Emitted(50, 35) Source(3, 24) + SourceIndex(5)
7 >Emitted(50, 37) Source(3, 26) + SourceIndex(5)
8 >Emitted(50, 39) Source(3, 28) + SourceIndex(5)
9 >Emitted(50, 41) Source(3, 30) + SourceIndex(5)
10>Emitted(50, 42) Source(3, 31) + SourceIndex(5)
11>Emitted(50, 44) Source(3, 33) + SourceIndex(5)
---
>>>//# sourceMappingURL=module.js.map

//// [/src/app/module.tsbuildinfo]
{
  "bundle": {
    "commonSourceDirectory": "./",
    "sourceFiles": [
      "./file3.ts",
      "./file4.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 500,
          "kind": "emitHelpers",
          "data": "typescript:rest"
        },
        {
          "pos": 502,
          "end": 1183,
          "kind": "prepend",
          "data": "../lib/module.js",
          "texts": [
            {
              "pos": 502,
              "end": 1183,
              "kind": "text"
            }
          ]
        },
        {
          "pos": 1183,
          "end": 1716,
          "kind": "text"
        }
      ],
      "sources": {
        "helpers": [
          "typescript:rest"
        ]
      }
    },
    "dts": {
      "sections": [
        {
          "pos": 0,
          "end": 227,
          "kind": "prepend",
          "data": "../lib/module.d.ts",
          "texts": [
            {
              "pos": 0,
              "end": 227,
              "kind": "text"
            }
          ]
        },
        {
          "pos": 227,
          "end": 365,
          "kind": "text"
        }
      ]
    }
  },
  "version": "FakeTSVersion"
}

//// [/src/app/module.tsbuildinfo.baseline.txt]
======================================================================
File:: /src/app/module.js
----------------------------------------------------------------------
emitHelpers: (0-500):: typescript:rest
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
----------------------------------------------------------------------
prepend: (502-1183):: ../lib/module.js texts:: 1
>>--------------------------------------------------------------------
text: (502-1183)
var myGlob = 20;
function libfile0Spread() {
    var b = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        b[_i] = arguments[_i];
    }
}
libfile0Spread.apply(void 0, [10, 20, 30]);
define("file1", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.x = void 0;
    exports.x = 10;
    function forlibfile1Rest() { }
});
define("file2", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.y = void 0;
    exports.y = 20;
});
var globalConst = 10;

----------------------------------------------------------------------
text: (1183-1716)
define("file3", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.z = void 0;
    exports.z = 30;
    function forappfile3Rest() {
        var _a = { a: 10, b: 30, yy: 30 }, b = _a.b, rest = __rest(_a, ["b"]);
    }
});
var myVar = 30;
function appfile4Spread() {
    var b = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        b[_i] = arguments[_i];
    }
}
appfile4Spread.apply(void 0, [10, 20, 30]);

======================================================================
======================================================================
File:: /src/app/module.d.ts
----------------------------------------------------------------------
prepend: (0-227):: ../lib/module.d.ts texts:: 1
>>--------------------------------------------------------------------
text: (0-227)
declare const myGlob = 20;
declare function libfile0Spread(...b: number[]): void;
declare module "file1" {
    export const x = 10;
}
declare module "file2" {
    export const y = 20;
}
declare const globalConst = 10;

----------------------------------------------------------------------
text: (227-365)
declare module "file3" {
    export const z = 30;
}
declare const myVar = 30;
declare function appfile4Spread(...b: number[]): void;

======================================================================

//// [/src/lib/module.d.ts] file written with same contents
//// [/src/lib/module.d.ts.map] file written with same contents
//// [/src/lib/module.d.ts.map.baseline.txt] file written with same contents
//// [/src/lib/module.js]
var myGlob = 20;
function libfile0Spread() {
    var b = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        b[_i] = arguments[_i];
    }
}
libfile0Spread.apply(void 0, [10, 20, 30]);
define("file1", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.x = void 0;
    exports.x = 10;
    function forlibfile1Rest() { }
});
define("file2", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.y = void 0;
    exports.y = 20;
});
var globalConst = 10;
//# sourceMappingURL=module.js.map

//// [/src/lib/module.js.map]
{"version":3,"file":"module.js","sourceRoot":"","sources":["file0.ts","file1.ts","file2.ts","global.ts"],"names":[],"mappings":"AAAA,IAAM,MAAM,GAAG,EAAE,CAAC;AAClB,SAAS,cAAc;IAAC,WAAc;SAAd,UAAc,EAAd,qBAAc,EAAd,IAAc;QAAd,sBAAc;;AAAI,CAAC;AAC3C,cAAc,eAAI,CAAC,EAAE,EAAE,EAAE,EAAE,EAAE,CAAC,EAAE;;;;;ICFnB,QAAA,CAAC,GAAG,EAAE,CAAC;IAAA,SAAS,eAAe,KAAK,CAAC;;;;;;ICArC,QAAA,CAAC,GAAG,EAAE,CAAC;;ACApB,IAAM,WAAW,GAAG,EAAE,CAAC"}

//// [/src/lib/module.js.map.baseline.txt]
===================================================================
JsFile: module.js
mapUrl: module.js.map
sourceRoot: 
sources: file0.ts,file1.ts,file2.ts,global.ts
===================================================================
-------------------------------------------------------------------
emittedFile:/src/lib/module.js
sourceFile:file0.ts
-------------------------------------------------------------------
>>>var myGlob = 20;
1 >
2 >^^^^
3 >    ^^^^^^
4 >          ^^^
5 >             ^^
6 >               ^
7 >                ^^^^^^^^^^^^->
1 >
2 >const 
3 >    myGlob
4 >           = 
5 >             20
6 >               ;
1 >Emitted(1, 1) Source(1, 1) + SourceIndex(0)
2 >Emitted(1, 5) Source(1, 7) + SourceIndex(0)
3 >Emitted(1, 11) Source(1, 13) + SourceIndex(0)
4 >Emitted(1, 14) Source(1, 16) + SourceIndex(0)
5 >Emitted(1, 16) Source(1, 18) + SourceIndex(0)
6 >Emitted(1, 17) Source(1, 19) + SourceIndex(0)
---
>>>function libfile0Spread() {
1->
2 >^^^^^^^^^
3 >         ^^^^^^^^^^^^^^
1->
  >
2 >function 
3 >         libfile0Spread
1->Emitted(2, 1) Source(2, 1) + SourceIndex(0)
2 >Emitted(2, 10) Source(2, 10) + SourceIndex(0)
3 >Emitted(2, 24) Source(2, 24) + SourceIndex(0)
---
>>>    var b = [];
1 >^^^^
2 >    ^^^^^^^^^^^
3 >               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^->
1 >(
2 >    ...b: number[]
1 >Emitted(3, 5) Source(2, 25) + SourceIndex(0)
2 >Emitted(3, 16) Source(2, 39) + SourceIndex(0)
---
>>>    for (var _i = 0; _i < arguments.length; _i++) {
1->^^^^^^^^^
2 >         ^^^^^^^^^^
3 >                   ^^
4 >                     ^^^^^^^^^^^^^^^^^^^^^
5 >                                          ^^
6 >                                            ^^^^
1->
2 >         ...b: number[]
3 >                   
4 >                     ...b: number[]
5 >                                          
6 >                                            ...b: number[]
1->Emitted(4, 10) Source(2, 25) + SourceIndex(0)
2 >Emitted(4, 20) Source(2, 39) + SourceIndex(0)
3 >Emitted(4, 22) Source(2, 25) + SourceIndex(0)
4 >Emitted(4, 43) Source(2, 39) + SourceIndex(0)
5 >Emitted(4, 45) Source(2, 25) + SourceIndex(0)
6 >Emitted(4, 49) Source(2, 39) + SourceIndex(0)
---
>>>        b[_i] = arguments[_i];
1 >^^^^^^^^
2 >        ^^^^^^^^^^^^^^^^^^^^^^
1 >
2 >        ...b: number[]
1 >Emitted(5, 9) Source(2, 25) + SourceIndex(0)
2 >Emitted(5, 31) Source(2, 39) + SourceIndex(0)
---
>>>    }
>>>}
1 >
2 >^
3 > ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^->
1 >) { 
2 >}
1 >Emitted(7, 1) Source(2, 43) + SourceIndex(0)
2 >Emitted(7, 2) Source(2, 44) + SourceIndex(0)
---
>>>libfile0Spread.apply(void 0, [10, 20, 30]);
1->
2 >^^^^^^^^^^^^^^
3 >              ^^^^^^^^^^^^^^^
4 >                             ^
5 >                              ^^
6 >                                ^^
7 >                                  ^^
8 >                                    ^^
9 >                                      ^^
10>                                        ^
11>                                         ^^
12>                                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^->
1->
  >
2 >libfile0Spread
3 >              (...
4 >                             [
5 >                              10
6 >                                , 
7 >                                  20
8 >                                    , 
9 >                                      30
10>                                        ]
11>                                         );
1->Emitted(8, 1) Source(3, 1) + SourceIndex(0)
2 >Emitted(8, 15) Source(3, 15) + SourceIndex(0)
3 >Emitted(8, 30) Source(3, 19) + SourceIndex(0)
4 >Emitted(8, 31) Source(3, 20) + SourceIndex(0)
5 >Emitted(8, 33) Source(3, 22) + SourceIndex(0)
6 >Emitted(8, 35) Source(3, 24) + SourceIndex(0)
7 >Emitted(8, 37) Source(3, 26) + SourceIndex(0)
8 >Emitted(8, 39) Source(3, 28) + SourceIndex(0)
9 >Emitted(8, 41) Source(3, 30) + SourceIndex(0)
10>Emitted(8, 42) Source(3, 31) + SourceIndex(0)
11>Emitted(8, 44) Source(3, 33) + SourceIndex(0)
---
-------------------------------------------------------------------
emittedFile:/src/lib/module.js
sourceFile:file1.ts
-------------------------------------------------------------------
>>>define("file1", ["require", "exports"], function (require, exports) {
>>>    "use strict";
>>>    Object.defineProperty(exports, "__esModule", { value: true });
>>>    exports.x = void 0;
>>>    exports.x = 10;
1->^^^^
2 >    ^^^^^^^^
3 >            ^
4 >             ^^^
5 >                ^^
6 >                  ^
7 >                   ^^^^^^^^^^^^^^^^->
1->export const 
2 >    
3 >            x
4 >              = 
5 >                10
6 >                  ;
1->Emitted(13, 5) Source(1, 14) + SourceIndex(1)
2 >Emitted(13, 13) Source(1, 14) + SourceIndex(1)
3 >Emitted(13, 14) Source(1, 15) + SourceIndex(1)
4 >Emitted(13, 17) Source(1, 18) + SourceIndex(1)
5 >Emitted(13, 19) Source(1, 20) + SourceIndex(1)
6 >Emitted(13, 20) Source(1, 21) + SourceIndex(1)
---
>>>    function forlibfile1Rest() { }
1->^^^^
2 >    ^^^^^^^^^
3 >             ^^^^^^^^^^^^^^^
4 >                            ^^^^^
5 >                                 ^
1->
2 >    function 
3 >             forlibfile1Rest
4 >                            () { 
5 >                                 }
1->Emitted(14, 5) Source(1, 21) + SourceIndex(1)
2 >Emitted(14, 14) Source(1, 30) + SourceIndex(1)
3 >Emitted(14, 29) Source(1, 45) + SourceIndex(1)
4 >Emitted(14, 34) Source(1, 50) + SourceIndex(1)
5 >Emitted(14, 35) Source(1, 51) + SourceIndex(1)
---
-------------------------------------------------------------------
emittedFile:/src/lib/module.js
sourceFile:file2.ts
-------------------------------------------------------------------
>>>});
>>>define("file2", ["require", "exports"], function (require, exports) {
>>>    "use strict";
>>>    Object.defineProperty(exports, "__esModule", { value: true });
>>>    exports.y = void 0;
>>>    exports.y = 20;
1 >^^^^
2 >    ^^^^^^^^
3 >            ^
4 >             ^^^
5 >                ^^
6 >                  ^
1 >export const 
2 >    
3 >            y
4 >              = 
5 >                20
6 >                  ;
1 >Emitted(20, 5) Source(1, 14) + SourceIndex(2)
2 >Emitted(20, 13) Source(1, 14) + SourceIndex(2)
3 >Emitted(20, 14) Source(1, 15) + SourceIndex(2)
4 >Emitted(20, 17) Source(1, 18) + SourceIndex(2)
5 >Emitted(20, 19) Source(1, 20) + SourceIndex(2)
6 >Emitted(20, 20) Source(1, 21) + SourceIndex(2)
---
-------------------------------------------------------------------
emittedFile:/src/lib/module.js
sourceFile:global.ts
-------------------------------------------------------------------
>>>});
>>>var globalConst = 10;
1 >
2 >^^^^
3 >    ^^^^^^^^^^^
4 >               ^^^
5 >                  ^^
6 >                    ^
7 >                     ^^^^^^^^^^^^->
1 >
2 >const 
3 >    globalConst
4 >                = 
5 >                  10
6 >                    ;
1 >Emitted(22, 1) Source(1, 1) + SourceIndex(3)
2 >Emitted(22, 5) Source(1, 7) + SourceIndex(3)
3 >Emitted(22, 16) Source(1, 18) + SourceIndex(3)
4 >Emitted(22, 19) Source(1, 21) + SourceIndex(3)
5 >Emitted(22, 21) Source(1, 23) + SourceIndex(3)
6 >Emitted(22, 22) Source(1, 24) + SourceIndex(3)
---
>>>//# sourceMappingURL=module.js.map

//// [/src/lib/module.tsbuildinfo]
{
  "bundle": {
    "commonSourceDirectory": "./",
    "sourceFiles": [
      "./file0.ts",
      "./file1.ts",
      "./file2.ts",
      "./global.ts"
    ],
    "js": {
      "sections": [
        {
          "pos": 0,
          "end": 681,
          "kind": "text"
        }
      ]
    },
    "dts": {
      "sections": [
        {
          "pos": 0,
          "end": 227,
          "kind": "text"
        }
      ]
    }
  },
  "version": "FakeTSVersion"
}

//// [/src/lib/module.tsbuildinfo.baseline.txt]
======================================================================
File:: /src/lib/module.js
----------------------------------------------------------------------
text: (0-681)
var myGlob = 20;
function libfile0Spread() {
    var b = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        b[_i] = arguments[_i];
    }
}
libfile0Spread.apply(void 0, [10, 20, 30]);
define("file1", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.x = void 0;
    exports.x = 10;
    function forlibfile1Rest() { }
});
define("file2", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.y = void 0;
    exports.y = 20;
});
var globalConst = 10;

======================================================================
======================================================================
File:: /src/lib/module.d.ts
----------------------------------------------------------------------
text: (0-227)
declare const myGlob = 20;
declare function libfile0Spread(...b: number[]): void;
declare module "file1" {
    export const x = 10;
}
declare module "file2" {
    export const y = 20;
}
declare const globalConst = 10;

======================================================================

