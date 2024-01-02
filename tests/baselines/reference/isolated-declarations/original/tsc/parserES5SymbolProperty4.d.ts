//// [tests/cases/conformance/parser/ecmascript5/Symbols/parserES5SymbolProperty4.ts] ////

//// [parserES5SymbolProperty4.ts]
declare class C {
    [Symbol.isRegExp]: string;
}

/// [Declarations] ////



//// [parserES5SymbolProperty4.d.ts]
declare class C {
}

/// [Errors] ////

parserES5SymbolProperty4.ts(2,5): error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
parserES5SymbolProperty4.ts(2,6): error TS2585: 'Symbol' only refers to a type, but is being used as a value here. Do you need to change your target library? Try changing the 'lib' compiler option to es2015 or later.


==== parserES5SymbolProperty4.ts (2 errors) ====
    declare class C {
        [Symbol.isRegExp]: string;
        ~~~~~~~~~~~~~~~~~
!!! error TS1166: A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
         ~~~~~~
!!! error TS2585: 'Symbol' only refers to a type, but is being used as a value here. Do you need to change your target library? Try changing the 'lib' compiler option to es2015 or later.
    }