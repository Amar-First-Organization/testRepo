//// [accessors_spec_section-4.5_error-cases.ts]
class LanguageSpec_section_4_5_error_cases {
    public set AnnotatedSetter_SetterFirst(a: number) { }
    public get AnnotatedSetter_SetterFirst() { return ""; }

    public get AnnotatedSetter_SetterLast() { return ""; }
    public set AnnotatedSetter_SetterLast(a: number) { }

    public get AnnotatedGetter_GetterFirst(): string { return ""; }
    public set AnnotatedGetter_GetterFirst(aStr) { aStr = 0; }

    public set AnnotatedGetter_GetterLast(aStr) { aStr = 0; }
    public get AnnotatedGetter_GetterLast(): string { return ""; }
}

//// [accessors_spec_section-4.5_error-cases.js]
var LanguageSpec_section_4_5_error_cases = /** @class */ (function () {
    function LanguageSpec_section_4_5_error_cases() {
    }
    var proto_1 = LanguageSpec_section_4_5_error_cases.prototype;
    Object.defineProperty(proto_1, "AnnotatedSetter_SetterFirst", {
        get: function () { return ""; },
        set: function (a) { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(proto_1, "AnnotatedSetter_SetterLast", {
        get: function () { return ""; },
        set: function (a) { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(proto_1, "AnnotatedGetter_GetterFirst", {
        get: function () { return ""; },
        set: function (aStr) { aStr = 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(proto_1, "AnnotatedGetter_GetterLast", {
        get: function () { return ""; },
        set: function (aStr) { aStr = 0; },
        enumerable: true,
        configurable: true
    });
    return LanguageSpec_section_4_5_error_cases;
}());
