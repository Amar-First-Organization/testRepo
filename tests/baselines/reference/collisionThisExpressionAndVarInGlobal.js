//// [collisionThisExpressionAndVarInGlobal.ts]
var _this = 1;
var f = () => this;

//// [collisionThisExpressionAndVarInGlobal.js]
var _this = this;
var _this = 1;
var f = function f() { return _this; };
