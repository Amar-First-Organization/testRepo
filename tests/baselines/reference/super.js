//// [super.ts]
class Base {
    constructor() {
        var x;
    }
    public foo() {
        return "base";
    }

    public bar() {
        return "basebar";
    }
}

class Sub1 extends Base {
    public foo() {
        return "sub1" + super.foo() + super.bar();
    }
}


class SubSub1 extends Sub1 {
    public foo() {
        return "subsub1" + super.foo();
    }
}

class Base2 {
    public foo() {
        super.foo();
    }
}

var s = new Sub1();
var ss = new SubSub1();
s.foo() + ss.foo();



//// [super.js]
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Base = (function () {
    function Base() {
        var x;
    }
    var proto_1 = Base.prototype;
    proto_1.foo = function () {
        return "base";
    };
    proto_1.bar = function () {
        return "basebar";
    };
    return Base;
}());
var Sub1 = (function (_super) {
    __extends(Sub1, _super);
    function Sub1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    var proto_2 = Sub1.prototype;
    proto_2.foo = function () {
        return "sub1" + _super.prototype.foo.call(this) + _super.prototype.bar.call(this);
    };
    return Sub1;
}(Base));
var SubSub1 = (function (_super) {
    __extends(SubSub1, _super);
    function SubSub1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    var proto_3 = SubSub1.prototype;
    proto_3.foo = function () {
        return "subsub1" + _super.prototype.foo.call(this);
    };
    return SubSub1;
}(Sub1));
var Base2 = (function () {
    function Base2() {
    }
    var proto_4 = Base2.prototype;
    proto_4.foo = function () {
        _super.prototype.foo.call(this);
    };
    return Base2;
}());
var s = new Sub1();
var ss = new SubSub1();
s.foo() + ss.foo();
