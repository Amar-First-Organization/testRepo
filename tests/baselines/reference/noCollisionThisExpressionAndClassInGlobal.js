//// [noCollisionThisExpressionAndClassInGlobal.ts]
class _this {
}
var f = () => _this;

//// [noCollisionThisExpressionAndClassInGlobal.js]
var _this = (function () {
    function _this() {
    }
    return _this;
}());
var f = function f() { return _this; };
