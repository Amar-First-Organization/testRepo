//// [tests/cases/conformance/parser/ecmascript6/ComputedPropertyNames/parserComputedPropertyName12.ts] ////

//// [parserComputedPropertyName12.ts]
class C {
   [e]() { }
}

/// [Declarations] ////



//// [parserComputedPropertyName12.d.ts]
declare class C {
}

/// [Errors] ////

parserComputedPropertyName12.ts(2,5): error TS2304: Cannot find name 'e'.


==== parserComputedPropertyName12.ts (1 errors) ====
    class C {
       [e]() { }
        ~
!!! error TS2304: Cannot find name 'e'.
    }