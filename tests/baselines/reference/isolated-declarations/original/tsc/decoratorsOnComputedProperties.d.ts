//// [tests/cases/compiler/decoratorsOnComputedProperties.ts] ////

//// [decoratorsOnComputedProperties.ts]
function x(o: object, k: PropertyKey) { }
let i = 0;
function foo(): string { return ++i + ""; }

const fieldNameA: string = "fieldName1";
const fieldNameB: string = "fieldName2";
const fieldNameC: string = "fieldName3";

class A {
    @x ["property"]: any;
    @x [Symbol.toStringTag]: any;
    @x ["property2"]: any = 2;
    @x [Symbol.iterator]: any = null;
    ["property3"]: any;
    [Symbol.isConcatSpreadable]: any;
    ["property4"]: any = 2;
    [Symbol.match]: any = null;
    [foo()]: any;
    @x [foo()]: any;
    @x [foo()]: any = null;
    [fieldNameA]: any;
    @x [fieldNameB]: any;
    @x [fieldNameC]: any = null;
}

void class B {
    @x ["property"]: any;
    @x [Symbol.toStringTag]: any;
    @x ["property2"]: any = 2;
    @x [Symbol.iterator]: any = null;
    ["property3"]: any;
    [Symbol.isConcatSpreadable]: any;
    ["property4"]: any = 2;
    [Symbol.match]: any = null;
    [foo()]: any;
    @x [foo()]: any;
    @x [foo()]: any = null;
    [fieldNameA]: any;
    @x [fieldNameB]: any;
    @x [fieldNameC]: any = null;
};

class C {
    @x ["property"]: any;
    @x [Symbol.toStringTag]: any;
    @x ["property2"]: any = 2;
    @x [Symbol.iterator]: any = null;
    ["property3"]: any;
    [Symbol.isConcatSpreadable]: any;
    ["property4"]: any = 2;
    [Symbol.match]: any = null;
    [foo()]: any;
    @x [foo()]: any;
    @x [foo()]: any = null;
    [fieldNameA]: any;
    @x [fieldNameB]: any;
    @x [fieldNameC]: any = null;
    ["some" + "method"]() {}
}

void class D {
    @x ["property"]: any;
    @x [Symbol.toStringTag]: any;
    @x ["property2"]: any = 2;
    @x [Symbol.iterator]: any = null;
    ["property3"]: any;
    [Symbol.isConcatSpreadable]: any;
    ["property4"]: any = 2;
    [Symbol.match]: any = null;
    [foo()]: any;
    @x [foo()]: any;
    @x [foo()]: any = null;
    [fieldNameA]: any;
    @x [fieldNameB]: any;
    @x [fieldNameC]: any = null;
    ["some" + "method"]() {}
};

class E {
    @x ["property"]: any;
    @x [Symbol.toStringTag]: any;
    @x ["property2"]: any = 2;
    @x [Symbol.iterator]: any = null;
    ["property3"]: any;
    [Symbol.isConcatSpreadable]: any;
    ["property4"]: any = 2;
    [Symbol.match]: any = null;
    [foo()]: any;
    @x [foo()]: any;
    @x [foo()]: any = null;
    ["some" + "method"]() {}
    [fieldNameA]: any;
    @x [fieldNameB]: any;
    @x [fieldNameC]: any = null;
}

void class F {
    @x ["property"]: any;
    @x [Symbol.toStringTag]: any;
    @x ["property2"]: any = 2;
    @x [Symbol.iterator]: any = null;
    ["property3"]: any;
    [Symbol.isConcatSpreadable]: any;
    ["property4"]: any = 2;
    [Symbol.match]: any = null;
    [foo()]: any;
    @x [foo()]: any;
    @x [foo()]: any = null;
    ["some" + "method"]() {}
    [fieldNameA]: any;
    @x [fieldNameB]: any;
    @x [fieldNameC]: any = null;
};

class G {
    @x ["property"]: any;
    @x [Symbol.toStringTag]: any;
    @x ["property2"]: any = 2;
    @x [Symbol.iterator]: any = null;
    ["property3"]: any;
    [Symbol.isConcatSpreadable]: any;
    ["property4"]: any = 2;
    [Symbol.match]: any = null;
    [foo()]: any;
    @x [foo()]: any;
    @x [foo()]: any = null;
    ["some" + "method"]() {}
    [fieldNameA]: any;
    @x [fieldNameB]: any;
    ["some" + "method2"]() {}
    @x [fieldNameC]: any = null;
}

void class H {
    @x ["property"]: any;
    @x [Symbol.toStringTag]: any;
    @x ["property2"]: any = 2;
    @x [Symbol.iterator]: any = null;
    ["property3"]: any;
    [Symbol.isConcatSpreadable]: any;
    ["property4"]: any = 2;
    [Symbol.match]: any = null;
    [foo()]: any;
    @x [foo()]: any;
    @x [foo()]: any = null;
    ["some" + "method"]() {}
    [fieldNameA]: any;
    @x [fieldNameB]: any;
    ["some" + "method2"]() {}
    @x [fieldNameC]: any = null;
};

class I {
    @x ["property"]: any;
    @x [Symbol.toStringTag]: any;
    @x ["property2"]: any = 2;
    @x [Symbol.iterator]: any = null;
    ["property3"]: any;
    [Symbol.isConcatSpreadable]: any;
    ["property4"]: any = 2;
    [Symbol.match]: any = null;
    [foo()]: any;
    @x [foo()]: any;
    @x [foo()]: any = null;
    @x ["some" + "method"]() {}
    [fieldNameA]: any;
    @x [fieldNameB]: any;
    ["some" + "method2"]() {}
    @x [fieldNameC]: any = null;
}

void class J {
    @x ["property"]: any;
    @x [Symbol.toStringTag]: any;
    @x ["property2"]: any = 2;
    @x [Symbol.iterator]: any = null;
    ["property3"]: any;
    [Symbol.isConcatSpreadable]: any;
    ["property4"]: any = 2;
    [Symbol.match]: any = null;
    [foo()]: any;
    @x [foo()]: any;
    @x [foo()]: any = null;
    @x ["some" + "method"]() {}
    [fieldNameA]: any;
    @x [fieldNameB]: any;
    ["some" + "method2"]() {}
    @x [fieldNameC]: any = null;
};

/// [Declarations] ////



//// [decoratorsOnComputedProperties.d.ts]
declare function x(o: object, k: PropertyKey): invalid;
declare let i: number;
declare function foo(): string;
declare const fieldNameA: string;
declare const fieldNameB: string;
declare const fieldNameC: string;
declare class A {
    ["property"]: any;
    [Symbol.toStringTag]: any;
    ["property2"]: any;
    [Symbol.iterator]: any;
    ["property3"]: any;
    [Symbol.isConcatSpreadable]: any;
    ["property4"]: any;
    [Symbol.match]: any;
    [fieldNameA]: any;
    [fieldNameB]: any;
    [fieldNameC]: any;
}
declare class C {
    ["property"]: any;
    [Symbol.toStringTag]: any;
    ["property2"]: any;
    [Symbol.iterator]: any;
    ["property3"]: any;
    [Symbol.isConcatSpreadable]: any;
    ["property4"]: any;
    [Symbol.match]: any;
    [fieldNameA]: any;
    [fieldNameB]: any;
    [fieldNameC]: any;
}
declare class E {
    ["property"]: any;
    [Symbol.toStringTag]: any;
    ["property2"]: any;
    [Symbol.iterator]: any;
    ["property3"]: any;
    [Symbol.isConcatSpreadable]: any;
    ["property4"]: any;
    [Symbol.match]: any;
    [fieldNameA]: any;
    [fieldNameB]: any;
    [fieldNameC]: any;
}
declare class G {
    ["property"]: any;
    [Symbol.toStringTag]: any;
    ["property2"]: any;
    [Symbol.iterator]: any;
    ["property3"]: any;
    [Symbol.isConcatSpreadable]: any;
    ["property4"]: any;
    [Symbol.match]: any;
    [fieldNameA]: any;
    [fieldNameB]: any;
    [fieldNameC]: any;
}
declare class I {
    ["property"]: any;
    [Symbol.toStringTag]: any;
    ["property2"]: any;
    [Symbol.iterator]: any;
    ["property3"]: any;
    [Symbol.isConcatSpreadable]: any;
    ["property4"]: any;
    [Symbol.match]: any;
    [fieldNameA]: any;
    [fieldNameB]: any;
    [fieldNameC]: any;
}

/// [Errors] ////

decoratorsOnComputedProperties.ts(1,10): error TS9007: Function must have an explicit return type annotation with --isolatedDeclarations
decoratorsOnComputedProperties.ts(18,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(19,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(20,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(21,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(21,5): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
decoratorsOnComputedProperties.ts(22,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(22,8): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
decoratorsOnComputedProperties.ts(23,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(23,8): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
decoratorsOnComputedProperties.ts(27,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(28,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(29,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(30,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(35,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(36,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(37,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(38,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(39,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(40,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(52,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(53,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(54,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(55,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(55,5): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
decoratorsOnComputedProperties.ts(56,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(56,8): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
decoratorsOnComputedProperties.ts(57,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(57,8): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
decoratorsOnComputedProperties.ts(62,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(63,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(64,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(65,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(70,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(71,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(72,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(73,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(74,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(75,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(88,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(89,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(90,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(92,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(92,5): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
decoratorsOnComputedProperties.ts(93,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(93,8): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
decoratorsOnComputedProperties.ts(94,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(94,8): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
decoratorsOnComputedProperties.ts(98,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(99,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(100,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(101,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(106,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(107,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(108,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(110,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(111,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(112,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(124,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(125,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(126,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(128,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(128,5): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
decoratorsOnComputedProperties.ts(129,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(129,8): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
decoratorsOnComputedProperties.ts(131,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(131,8): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
decoratorsOnComputedProperties.ts(135,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(136,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(137,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(138,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(143,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(144,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(145,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(147,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(148,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(150,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(162,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(163,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(164,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(166,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(166,5): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
decoratorsOnComputedProperties.ts(167,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(167,8): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
decoratorsOnComputedProperties.ts(169,8): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(169,8): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
decoratorsOnComputedProperties.ts(173,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(174,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(175,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(176,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(181,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(182,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(183,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(184,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(185,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
decoratorsOnComputedProperties.ts(186,5): error TS1206: Decorators are not valid here.
decoratorsOnComputedProperties.ts(188,5): error TS1206: Decorators are not valid here.


==== decoratorsOnComputedProperties.ts (97 errors) ====
    function x(o: object, k: PropertyKey) { }
             ~
!!! error TS9007: Function must have an explicit return type annotation with --isolatedDeclarations
!!! related TS9031 decoratorsOnComputedProperties.ts:1:10: Add a return type to the function declaration
    let i = 0;
    function foo(): string { return ++i + ""; }
    
    const fieldNameA: string = "fieldName1";
    const fieldNameB: string = "fieldName2";
    const fieldNameC: string = "fieldName3";
    
    class A {
        @x ["property"]: any;
        @x [Symbol.toStringTag]: any;
        @x ["property2"]: any = 2;
        @x [Symbol.iterator]: any = null;
        ["property3"]: any;
        [Symbol.isConcatSpreadable]: any;
        ["property4"]: any = 2;
        [Symbol.match]: any = null;
        [foo()]: any;
        ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [foo()]: any;
           ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [foo()]: any = null;
           ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        [fieldNameA]: any;
        ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        ~~~~~~~~~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
        @x [fieldNameB]: any;
           ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
           ~~~~~~~~~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
        @x [fieldNameC]: any = null;
           ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
           ~~~~~~~~~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
    }
    
    void class B {
        @x ["property"]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [Symbol.toStringTag]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x ["property2"]: any = 2;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [Symbol.iterator]: any = null;
        ~
!!! error TS1206: Decorators are not valid here.
        ["property3"]: any;
        [Symbol.isConcatSpreadable]: any;
        ["property4"]: any = 2;
        [Symbol.match]: any = null;
        [foo()]: any;
        ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [foo()]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [foo()]: any = null;
        ~
!!! error TS1206: Decorators are not valid here.
        [fieldNameA]: any;
        ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [fieldNameB]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [fieldNameC]: any = null;
        ~
!!! error TS1206: Decorators are not valid here.
    };
    
    class C {
        @x ["property"]: any;
        @x [Symbol.toStringTag]: any;
        @x ["property2"]: any = 2;
        @x [Symbol.iterator]: any = null;
        ["property3"]: any;
        [Symbol.isConcatSpreadable]: any;
        ["property4"]: any = 2;
        [Symbol.match]: any = null;
        [foo()]: any;
        ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [foo()]: any;
           ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [foo()]: any = null;
           ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        [fieldNameA]: any;
        ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        ~~~~~~~~~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
        @x [fieldNameB]: any;
           ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
           ~~~~~~~~~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
        @x [fieldNameC]: any = null;
           ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
           ~~~~~~~~~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
        ["some" + "method"]() {}
    }
    
    void class D {
        @x ["property"]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [Symbol.toStringTag]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x ["property2"]: any = 2;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [Symbol.iterator]: any = null;
        ~
!!! error TS1206: Decorators are not valid here.
        ["property3"]: any;
        [Symbol.isConcatSpreadable]: any;
        ["property4"]: any = 2;
        [Symbol.match]: any = null;
        [foo()]: any;
        ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [foo()]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [foo()]: any = null;
        ~
!!! error TS1206: Decorators are not valid here.
        [fieldNameA]: any;
        ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [fieldNameB]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [fieldNameC]: any = null;
        ~
!!! error TS1206: Decorators are not valid here.
        ["some" + "method"]() {}
    };
    
    class E {
        @x ["property"]: any;
        @x [Symbol.toStringTag]: any;
        @x ["property2"]: any = 2;
        @x [Symbol.iterator]: any = null;
        ["property3"]: any;
        [Symbol.isConcatSpreadable]: any;
        ["property4"]: any = 2;
        [Symbol.match]: any = null;
        [foo()]: any;
        ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [foo()]: any;
           ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [foo()]: any = null;
           ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        ["some" + "method"]() {}
        [fieldNameA]: any;
        ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        ~~~~~~~~~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
        @x [fieldNameB]: any;
           ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
           ~~~~~~~~~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
        @x [fieldNameC]: any = null;
           ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
           ~~~~~~~~~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
    }
    
    void class F {
        @x ["property"]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [Symbol.toStringTag]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x ["property2"]: any = 2;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [Symbol.iterator]: any = null;
        ~
!!! error TS1206: Decorators are not valid here.
        ["property3"]: any;
        [Symbol.isConcatSpreadable]: any;
        ["property4"]: any = 2;
        [Symbol.match]: any = null;
        [foo()]: any;
        ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [foo()]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [foo()]: any = null;
        ~
!!! error TS1206: Decorators are not valid here.
        ["some" + "method"]() {}
        [fieldNameA]: any;
        ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [fieldNameB]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [fieldNameC]: any = null;
        ~
!!! error TS1206: Decorators are not valid here.
    };
    
    class G {
        @x ["property"]: any;
        @x [Symbol.toStringTag]: any;
        @x ["property2"]: any = 2;
        @x [Symbol.iterator]: any = null;
        ["property3"]: any;
        [Symbol.isConcatSpreadable]: any;
        ["property4"]: any = 2;
        [Symbol.match]: any = null;
        [foo()]: any;
        ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [foo()]: any;
           ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [foo()]: any = null;
           ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        ["some" + "method"]() {}
        [fieldNameA]: any;
        ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        ~~~~~~~~~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
        @x [fieldNameB]: any;
           ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
           ~~~~~~~~~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
        ["some" + "method2"]() {}
        @x [fieldNameC]: any = null;
           ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
           ~~~~~~~~~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
    }
    
    void class H {
        @x ["property"]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [Symbol.toStringTag]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x ["property2"]: any = 2;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [Symbol.iterator]: any = null;
        ~
!!! error TS1206: Decorators are not valid here.
        ["property3"]: any;
        [Symbol.isConcatSpreadable]: any;
        ["property4"]: any = 2;
        [Symbol.match]: any = null;
        [foo()]: any;
        ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [foo()]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [foo()]: any = null;
        ~
!!! error TS1206: Decorators are not valid here.
        ["some" + "method"]() {}
        [fieldNameA]: any;
        ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [fieldNameB]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        ["some" + "method2"]() {}
        @x [fieldNameC]: any = null;
        ~
!!! error TS1206: Decorators are not valid here.
    };
    
    class I {
        @x ["property"]: any;
        @x [Symbol.toStringTag]: any;
        @x ["property2"]: any = 2;
        @x [Symbol.iterator]: any = null;
        ["property3"]: any;
        [Symbol.isConcatSpreadable]: any;
        ["property4"]: any = 2;
        [Symbol.match]: any = null;
        [foo()]: any;
        ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [foo()]: any;
           ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [foo()]: any = null;
           ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x ["some" + "method"]() {}
        [fieldNameA]: any;
        ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        ~~~~~~~~~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
        @x [fieldNameB]: any;
           ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
           ~~~~~~~~~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
        ["some" + "method2"]() {}
        @x [fieldNameC]: any = null;
           ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
           ~~~~~~~~~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
    }
    
    void class J {
        @x ["property"]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [Symbol.toStringTag]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x ["property2"]: any = 2;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [Symbol.iterator]: any = null;
        ~
!!! error TS1206: Decorators are not valid here.
        ["property3"]: any;
        [Symbol.isConcatSpreadable]: any;
        ["property4"]: any = 2;
        [Symbol.match]: any = null;
        [foo()]: any;
        ~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [foo()]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        @x [foo()]: any = null;
        ~
!!! error TS1206: Decorators are not valid here.
        @x ["some" + "method"]() {}
        ~
!!! error TS1206: Decorators are not valid here.
        [fieldNameA]: any;
        ~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
        @x [fieldNameB]: any;
        ~
!!! error TS1206: Decorators are not valid here.
        ["some" + "method2"]() {}
        @x [fieldNameC]: any = null;
        ~
!!! error TS1206: Decorators are not valid here.
    };