//// [tests/cases/compiler/numericIndexerConstraint3.ts] ////

//// [numericIndexerConstraint3.ts]
class A {
    foo: number;
}

class B extends A {
    bar: string;
}

class C {
    0: B;
    [x: number]: A;
}

//// [numericIndexerConstraint3.js]
class A {
}
class B extends A {
}
class C {
}
