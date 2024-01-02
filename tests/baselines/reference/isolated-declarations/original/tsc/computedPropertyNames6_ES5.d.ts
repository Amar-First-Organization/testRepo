//// [tests/cases/conformance/es6/computedProperties/computedPropertyNames6_ES5.ts] ////

//// [computedPropertyNames6_ES5.ts]
var p1: number | string;
var p2: number | number[];
var p3: string | boolean;
var v = {
    [p1]: 0,
    [p2]: 1,
    [p3]: 2
}

/// [Declarations] ////



//// [computedPropertyNames6_ES5.d.ts]
declare var p1: number | string;
declare var p2: number | number[];
declare var p3: string | boolean;
declare var v: invalid;

/// [Errors] ////

computedPropertyNames6_ES5.ts(5,5): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
computedPropertyNames6_ES5.ts(6,5): error TS2464: A computed property name must be of type 'string', 'number', 'symbol', or 'any'.
computedPropertyNames6_ES5.ts(6,5): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
computedPropertyNames6_ES5.ts(7,5): error TS2464: A computed property name must be of type 'string', 'number', 'symbol', or 'any'.
computedPropertyNames6_ES5.ts(7,5): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations


==== computedPropertyNames6_ES5.ts (5 errors) ====
    var p1: number | string;
    var p2: number | number[];
    var p3: string | boolean;
    var v = {
        [p1]: 0,
        ~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
!!! related TS9027 computedPropertyNames6_ES5.ts:4:5: Add a type annotation to the variable v
        [p2]: 1,
        ~~~~
!!! error TS2464: A computed property name must be of type 'string', 'number', 'symbol', or 'any'.
        ~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
!!! related TS9027 computedPropertyNames6_ES5.ts:4:5: Add a type annotation to the variable v
        [p3]: 2
        ~~~~
!!! error TS2464: A computed property name must be of type 'string', 'number', 'symbol', or 'any'.
        ~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
!!! related TS9027 computedPropertyNames6_ES5.ts:4:5: Add a type annotation to the variable v
    }