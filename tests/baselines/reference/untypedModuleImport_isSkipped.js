//// [tests/cases/conformance/moduleResolution/untypedModuleImport_isSkipped.ts] ////

//// [package.json]
{}

//// [index.d.ts]
export const x: number;

//// [a.ts]
import { x } from "bar";
x;


//// [a.js]
"use strict";
var bar_1 = require("bar");
bar_1.x;
