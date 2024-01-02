//// [tests/cases/conformance/es6/computedProperties/computedPropertyNames5_ES6.ts] ////

//// [computedPropertyNames5_ES6.ts]
var b: boolean;
var v = {
    [b]: 0,
    [true]: 1,
    [[]]: 0,
    [{}]: 0,
    [undefined]: undefined,
    [null]: null
}

/// [Declarations] ////



//// [computedPropertyNames5_ES6.d.ts]
declare var b: boolean;
declare var v: invalid;

/// [Errors] ////

computedPropertyNames5_ES6.ts(3,5): error TS2464: A computed property name must be of type 'string', 'number', 'symbol', or 'any'.
computedPropertyNames5_ES6.ts(3,5): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
computedPropertyNames5_ES6.ts(4,5): error TS2464: A computed property name must be of type 'string', 'number', 'symbol', or 'any'.
computedPropertyNames5_ES6.ts(5,5): error TS2464: A computed property name must be of type 'string', 'number', 'symbol', or 'any'.
computedPropertyNames5_ES6.ts(5,5): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
computedPropertyNames5_ES6.ts(6,5): error TS2464: A computed property name must be of type 'string', 'number', 'symbol', or 'any'.
computedPropertyNames5_ES6.ts(6,5): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
computedPropertyNames5_ES6.ts(7,5): error TS2464: A computed property name must be of type 'string', 'number', 'symbol', or 'any'.
computedPropertyNames5_ES6.ts(7,5): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
computedPropertyNames5_ES6.ts(8,5): error TS2464: A computed property name must be of type 'string', 'number', 'symbol', or 'any'.
computedPropertyNames5_ES6.ts(8,5): error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations


==== computedPropertyNames5_ES6.ts (11 errors) ====
    var b: boolean;
    var v = {
        [b]: 0,
        ~~~
!!! error TS2464: A computed property name must be of type 'string', 'number', 'symbol', or 'any'.
        ~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
!!! related TS9027 computedPropertyNames5_ES6.ts:2:5: Add a type annotation to the variable v
        [true]: 1,
        ~~~~~~
!!! error TS2464: A computed property name must be of type 'string', 'number', 'symbol', or 'any'.
        [[]]: 0,
        ~~~~
!!! error TS2464: A computed property name must be of type 'string', 'number', 'symbol', or 'any'.
        ~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
!!! related TS9027 computedPropertyNames5_ES6.ts:2:5: Add a type annotation to the variable v
        [{}]: 0,
        ~~~~
!!! error TS2464: A computed property name must be of type 'string', 'number', 'symbol', or 'any'.
        ~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
!!! related TS9027 computedPropertyNames5_ES6.ts:2:5: Add a type annotation to the variable v
        [undefined]: undefined,
        ~~~~~~~~~~~
!!! error TS2464: A computed property name must be of type 'string', 'number', 'symbol', or 'any'.
        ~~~~~~~~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
!!! related TS9027 computedPropertyNames5_ES6.ts:2:5: Add a type annotation to the variable v
        [null]: null
        ~~~~~~
!!! error TS2464: A computed property name must be of type 'string', 'number', 'symbol', or 'any'.
        ~~~~~~
!!! error TS9014: Computed properties must be number or string literals, variables or dotted expressions with --isolatedDeclarations
!!! related TS9027 computedPropertyNames5_ES6.ts:2:5: Add a type annotation to the variable v
    }