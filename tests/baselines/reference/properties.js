//// [properties.ts]
class MyClass
{
    public get Count(): number
    {
        return 42;
    }

    public set Count(value: number)
    {
        //
    }
}

//// [properties.js]
var MyClass = /** @class */ (function () {
    function MyClass() {
    }
    var proto_1 = MyClass.prototype;
    Object.defineProperty(proto_1, "Count", {
        get: function () {
            return 42;
        },
        set: function (value) {
            //
        },
        enumerable: true,
        configurable: true
    });
    return MyClass;
}());
//# sourceMappingURL=properties.js.map

//// [properties.d.ts]
declare class MyClass {
    get Count(): number;
    set Count(value: number);
}
