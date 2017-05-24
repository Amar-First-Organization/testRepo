//// [arrowFunctionsMissingTokens.ts]
module missingArrowsWithCurly {
    var a = () { };

    var b = (): void { }

    var c = (x) { };

    var d = (x: number, y: string) { };

    var e = (x: number, y: string): void { };
}

module missingCurliesWithArrow {
    module withStatement {
        var a = () => var k = 10;};

        var b = (): void => var k = 10;}

        var c = (x) => var k = 10;};

        var d = (x: number, y: string) => var k = 10;};

        var e = (x: number, y: string): void => var k = 10;};

        var f = () => var k = 10;}
    }

    module withoutStatement {
        var a = () => };

        var b = (): void => }

        var c = (x) => };

        var d = (x: number, y: string) => };

        var e = (x: number, y: string): void => };

        var f = () => }
    }
}

module ce_nEst_pas_une_arrow_function {
    var a = ();

    var b = (): void;

    var c = (x);

    var d = (x: number, y: string);

    var e = (x: number, y: string): void;
}

module okay {
    var a = () => { };

    var b = (): void => { }

    var c = (x) => { };

    var d = (x: number, y: string) => { };

    var e = (x: number, y: string): void => { };
}

//// [arrowFunctionsMissingTokens.js]
var missingArrowsWithCurly;
(function (missingArrowsWithCurly) {
    var a = function a() { };
    var b = function b() { };
    var c = function c(x) { };
    var d = function d(x, y) { };
    var e = function e(x, y) { };
})(missingArrowsWithCurly || (missingArrowsWithCurly = {}));
var missingCurliesWithArrow;
(function (missingCurliesWithArrow) {
    var withStatement;
    (function (withStatement) {
        var a = function a() { var k = 10; };
        var b = function b() { var k = 10; };
        var c = function c(x) { var k = 10; };
        var d = function d(x, y) { var k = 10; };
        var e = function e(x, y) { var k = 10; };
        var f = function f() { var k = 10; };
    })(withStatement || (withStatement = {}));
    var withoutStatement;
    (function (withoutStatement) {
        var a = function a() { return ; };
    })(withoutStatement || (withoutStatement = {}));
    ;
    var b = function b() { return ; };
})(missingCurliesWithArrow || (missingCurliesWithArrow = {}));
var c = function c(x) { return ; };
;
var d = function d(x, y) { return ; };
;
var e = function e(x, y) { return ; };
;
var f = function f() { return ; };
var ce_nEst_pas_une_arrow_function;
(function (ce_nEst_pas_une_arrow_function) {
    var a = ();
    var b = function b() { return ; };
    var c = (x);
    var d = function d(x, y) { return ; };
    var e = function e(x, y) { return ; };
})(ce_nEst_pas_une_arrow_function || (ce_nEst_pas_une_arrow_function = {}));
var okay;
(function (okay) {
    var a = function a() { };
    var b = function b() { };
    var c = function c(x) { };
    var d = function d(x, y) { };
    var e = function e(x, y) { };
})(okay || (okay = {}));
