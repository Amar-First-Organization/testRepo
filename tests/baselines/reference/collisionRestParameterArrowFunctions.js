//// [collisionRestParameterArrowFunctions.ts]
var f1 = (_i: number, ...restParameters) => { //_i is error
    var _i = 10; // no error
}
var f1NoError = (_i: number) => { // no error
    var _i = 10; // no error
}

var f2 = (...restParameters) => {
    var _i = 10; // No Error
}
var f2NoError = () => {
    var _i = 10; // no error
}

//// [collisionRestParameterArrowFunctions.js]
var f1 = function f1(_i) {
    var restParameters = [];
    for (var _a = 1; _a < arguments.length; _a++) {
        restParameters[_a - 1] = arguments[_a];
    }
    var _i = 10; // no error
};
var f1NoError = function f1NoError(_i) {
    var _i = 10; // no error
};
var f2 = function f2() {
    var restParameters = [];
    for (var _a = 0; _a < arguments.length; _a++) {
        restParameters[_a] = arguments[_a];
    }
    var _i = 10; // No Error
};
var f2NoError = function f2NoError() {
    var _i = 10; // no error
};
