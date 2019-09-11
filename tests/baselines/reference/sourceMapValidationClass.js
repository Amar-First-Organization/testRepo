//// [sourceMapValidationClass.ts]
class Greeter {
    constructor(public greeting: string, ...b: string[]) {
    }
    greet() {
        return "<h1>" + this.greeting + "</h1>";
    }
    private x: string;
    private x1: number = 10;
    private fn() {
        return this.greeting;
    }
    get greetings() {
        return this.greeting;
    }
    set greetings(greetings: string) {
        this.greeting = greetings;
    }
}

//// [sourceMapValidationClass.js]
var Greeter = /** @class */ (function () {
    function Greeter(greeting) {
        var b = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            b[_i - 1] = arguments[_i];
        }
        this.greeting = greeting;
        this.x1 = 10;
    }
    var proto_1 = Greeter.prototype;
    proto_1.greet = function () {
        return "<h1>" + this.greeting + "</h1>";
    };
    proto_1.fn = function () {
        return this.greeting;
    };
    Object.defineProperty(proto_1, "greetings", {
        get: function () {
            return this.greeting;
        },
        set: function (greetings) {
            this.greeting = greetings;
        },
        enumerable: true,
        configurable: true
    });
    return Greeter;
}());
//# sourceMappingURL=sourceMapValidationClass.js.map