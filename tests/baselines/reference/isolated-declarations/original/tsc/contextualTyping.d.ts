//// [tests/cases/compiler/contextualTyping.ts] ////

//// [contextualTyping.ts]
// DEFAULT INTERFACES
interface IFoo {
    n: number;
    s: string;
    f(i: number, s: string): string;
    a: number[];
}

interface IBar {
    foo: IFoo;
}

// CONTEXT: Class property declaration
class C1T5 {
    foo: (i: number, s: string) => number = function(i) {
        return i;
    }
}

// CONTEXT: Module property declaration
module C2T5 {
    export var foo: (i: number, s: string) => number = function(i) {
        return i;
    }
}

// CONTEXT: Variable declaration
var c3t1: (s: string) => string = (function(s) { return s });
var c3t2 = <IFoo>({
    n: 1
})
var c3t3: number[] = [];
var c3t4: () => IFoo = function() { return <IFoo>({}) };
var c3t5: (n: number) => IFoo = function(n) { return <IFoo>({}) };
var c3t6: (n: number, s: string) => IFoo = function(n, s) { return <IFoo>({}) };
var c3t7: {
    (n: number): number;    
    (s1: string): number;
} = function(n) { return n; };

var c3t8: (n: number, s: string) => number = function(n) { return n; };
var c3t9: number[][] = [[],[]];
var c3t10: IFoo[] = [<IFoo>({}),<IFoo>({})];
var c3t11: {(n: number, s: string): string;}[] = [function(n, s) { return s; }];
var c3t12: IBar = {
    foo: <IFoo>({})
}
var c3t13 = <IFoo>({
    f: function(i, s) { return s; }
})
var c3t14 = <IFoo>({
    a: []
})

// CONTEXT: Class property assignment
class C4T5 {
    foo: (i: number, s: string) => string;
    constructor() {
        this.foo = function(i, s) {
            return s;
        }
    }
}

// CONTEXT: Module property assignment
module C5T5 {
    export var foo: (i: number, s: string) => string;
    foo = function(i, s) {
        return s;
    }
}

// CONTEXT: Variable assignment
var c6t5: (n: number) => IFoo;
c6t5 = <(n: number) => IFoo>function(n) { return <IFoo>({}) };

// CONTEXT: Array index assignment
var c7t2: IFoo[];
c7t2[0] = <IFoo>({n: 1});

// CONTEXT: Object property assignment
interface IPlaceHolder {
    t1: (s: string) => string;
    t2: IFoo;
    t3: number[];
    t4: () => IFoo;
    t5: (n: number) => IFoo;
    t6: (n: number, s: string) => IFoo;
    t7: {
            (n: number, s: string): number;    
            //(s1: string, s2: string): number;
        };
    t8: (n: number, s: string) => number;
    t9: number[][];
    t10: IFoo[];
    t11: {(n: number, s: string): string;}[];
    t12: IBar;
    t13: IFoo;
    t14: IFoo;
    }

var objc8: {
    t1: (s: string) => string;
    t2: IFoo;
    t3: number[];
    t4: () => IFoo;
    t5: (n: number) => IFoo;
    t6: (n: number, s: string) => IFoo;
    t7: {
            (n: number, s: string): number;    
            //(s1: string, s2: string): number;
        };
    t8: (n: number, s: string) => number;
    t9: number[][];
    t10: IFoo[];
    t11: {(n: number, s: string): string;}[];
    t12: IBar;
    t13: IFoo;
    t14: IFoo;
} = <IPlaceHolder>({});

objc8.t1 = (function(s) { return s });
objc8.t2 = <IFoo>({
    n: 1
});
objc8.t3 = [];
objc8.t4 = function() { return <IFoo>({}) };
objc8.t5 = function(n) { return <IFoo>({}) };
objc8.t6 = function(n, s) { return <IFoo>({}) };
objc8.t7 = function(n: number) { return n };

objc8.t8 = function(n) { return n; };
objc8.t9 = [[],[]];
objc8.t10 = [<IFoo>({}),<IFoo>({})];
objc8.t11 = [function(n, s) { return s; }];
objc8.t12 = {
    foo: <IFoo>({})
}
objc8.t13 = <IFoo>({
    f: function(i, s) { return s; }
})
objc8.t14 = <IFoo>({
    a: []
})
// CONTEXT: Function call
function c9t5(f: (n: number) => IFoo) {};
c9t5(function(n) {
    return <IFoo>({});
});

// CONTEXT: Return statement
var c10t5: () => (n: number) => IFoo = function() { return function(n) { return <IFoo>({}) } };

// CONTEXT: Newing a class
class C11t5 { constructor(f: (n: number) => IFoo) { } };
var i = new C11t5(function(n) { return <IFoo>({}) });

// CONTEXT: Type annotated expression
var c12t1 = <(s: string) => string> (function(s) { return s });
var c12t2 = <IFoo> ({
    n: 1
});
var c12t3 = <number[]> [];
var c12t4 = <() => IFoo> function() { return <IFoo>({}) };
var c12t5 = <(n: number) => IFoo> function(n) { return <IFoo>({}) };
var c12t6 = <(n: number, s: string) => IFoo> function(n, s) { return <IFoo>({}) };
var c12t7 = <{
    (n: number, s: string): number;    
    //(s1: string, s2: string): number;
}> function(n:number) { return n };

var c12t8 = <(n: number, s: string) => number> function(n) { return n; };
var c12t9 = <number[][]> [[],[]];
var c12t10 = <IFoo[]> [<IFoo>({}),<IFoo>({})];
var c12t11 = <{(n: number, s: string): string;}[]> [function(n, s) { return s; }];
var c12t12 = <IBar> {
    foo: <IFoo>({})
}
var c12t13 = <IFoo> ({
    f: function(i, s) { return s; }
})
var c12t14 = <IFoo> ({
    a: []
})

// CONTEXT: Contextual typing declarations

// contextually typing function declarations
declare function EF1(a:number, b:number):number;

function EF1(a,b) { return a+b; }

var efv = EF1(1,2);


// contextually typing from ambient class declarations
declare class Point
{
      constructor(x: number, y: number);
      x: number;
      y: number;
      add(dx: number, dy: number): Point;
      static origin: Point;

}

Point.origin = new Point(0, 0);

Point.prototype.add = function(dx, dy) {
    return new Point(this.x + dx, this.y + dy);
};

Point.prototype = {
    x: 0,
    y: 0,
    add: function(dx, dy) {
        return new Point(this.x + dx, this.y + dy);
    }
};

interface A { x: string; }
interface B extends A { }
var x: B = { };


/// [Declarations] ////



//// [contextualTyping.d.ts]
interface IFoo {
    n: number;
    s: string;
    f(i: number, s: string): string;
    a: number[];
}
interface IBar {
    foo: IFoo;
}
declare class C1T5 {
    foo: (i: number, s: string) => number;
}
declare namespace C2T5 {
    var foo: (i: number, s: string) => number;
}
declare var c3t1: (s: string) => string;
declare var c3t2: IFoo;
declare var c3t3: number[];
declare var c3t4: () => IFoo;
declare var c3t5: (n: number) => IFoo;
declare var c3t6: (n: number, s: string) => IFoo;
declare var c3t7: {
    (n: number): number;
    (s1: string): number;
};
declare var c3t8: (n: number, s: string) => number;
declare var c3t9: number[][];
declare var c3t10: IFoo[];
declare var c3t11: {
    (n: number, s: string): string;
}[];
declare var c3t12: IBar;
declare var c3t13: IFoo;
declare var c3t14: IFoo;
declare class C4T5 {
    foo: (i: number, s: string) => string;
    constructor();
}
declare namespace C5T5 {
    var foo: (i: number, s: string) => string;
}
declare var c6t5: (n: number) => IFoo;
declare var c7t2: IFoo[];
interface IPlaceHolder {
    t1: (s: string) => string;
    t2: IFoo;
    t3: number[];
    t4: () => IFoo;
    t5: (n: number) => IFoo;
    t6: (n: number, s: string) => IFoo;
    t7: {
        (n: number, s: string): number;
    };
    t8: (n: number, s: string) => number;
    t9: number[][];
    t10: IFoo[];
    t11: {
        (n: number, s: string): string;
    }[];
    t12: IBar;
    t13: IFoo;
    t14: IFoo;
}
declare var objc8: {
    t1: (s: string) => string;
    t2: IFoo;
    t3: number[];
    t4: () => IFoo;
    t5: (n: number) => IFoo;
    t6: (n: number, s: string) => IFoo;
    t7: {
        (n: number, s: string): number;
    };
    t8: (n: number, s: string) => number;
    t9: number[][];
    t10: IFoo[];
    t11: {
        (n: number, s: string): string;
    }[];
    t12: IBar;
    t13: IFoo;
    t14: IFoo;
};
declare function c9t5(f: (n: number) => IFoo): invalid;
declare var c10t5: () => (n: number) => IFoo;
declare class C11t5 {
    constructor(f: (n: number) => IFoo);
}
declare var i: invalid;
declare var c12t1: (s: string) => string;
declare var c12t2: IFoo;
declare var c12t3: number[];
declare var c12t4: () => IFoo;
declare var c12t5: (n: number) => IFoo;
declare var c12t6: (n: number, s: string) => IFoo;
declare var c12t7: (n: number, s: string) => number;
declare var c12t8: (n: number, s: string) => number;
declare var c12t9: number[][];
declare var c12t10: IFoo[];
declare var c12t11: ((n: number, s: string) => string)[];
declare var c12t12: IBar;
declare var c12t13: IFoo;
declare var c12t14: IFoo;
declare function EF1(a: number, b: number): number;
declare var efv: invalid;
declare class Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
    add(dx: number, dy: number): Point;
    static origin: Point;
}
interface A {
    x: string;
}
interface B extends A {
}
declare var x: B;

/// [Errors] ////

contextualTyping.ts(146,10): error TS9007: Function must have an explicit return type annotation with --isolatedDeclarations
contextualTyping.ts(156,9): error TS9010: Variable must have an explicit type annotation with --isolatedDeclarations
contextualTyping.ts(189,18): error TS2384: Overload signatures must all be ambient or non-ambient.
contextualTyping.ts(193,11): error TS9010: Variable must have an explicit type annotation with --isolatedDeclarations
contextualTyping.ts(223,5): error TS2741: Property 'x' is missing in type '{}' but required in type 'B'.


==== contextualTyping.ts (5 errors) ====
    // DEFAULT INTERFACES
    interface IFoo {
        n: number;
        s: string;
        f(i: number, s: string): string;
        a: number[];
    }
    
    interface IBar {
        foo: IFoo;
    }
    
    // CONTEXT: Class property declaration
    class C1T5 {
        foo: (i: number, s: string) => number = function(i) {
            return i;
        }
    }
    
    // CONTEXT: Module property declaration
    module C2T5 {
        export var foo: (i: number, s: string) => number = function(i) {
            return i;
        }
    }
    
    // CONTEXT: Variable declaration
    var c3t1: (s: string) => string = (function(s) { return s });
    var c3t2 = <IFoo>({
        n: 1
    })
    var c3t3: number[] = [];
    var c3t4: () => IFoo = function() { return <IFoo>({}) };
    var c3t5: (n: number) => IFoo = function(n) { return <IFoo>({}) };
    var c3t6: (n: number, s: string) => IFoo = function(n, s) { return <IFoo>({}) };
    var c3t7: {
        (n: number): number;    
        (s1: string): number;
    } = function(n) { return n; };
    
    var c3t8: (n: number, s: string) => number = function(n) { return n; };
    var c3t9: number[][] = [[],[]];
    var c3t10: IFoo[] = [<IFoo>({}),<IFoo>({})];
    var c3t11: {(n: number, s: string): string;}[] = [function(n, s) { return s; }];
    var c3t12: IBar = {
        foo: <IFoo>({})
    }
    var c3t13 = <IFoo>({
        f: function(i, s) { return s; }
    })
    var c3t14 = <IFoo>({
        a: []
    })
    
    // CONTEXT: Class property assignment
    class C4T5 {
        foo: (i: number, s: string) => string;
        constructor() {
            this.foo = function(i, s) {
                return s;
            }
        }
    }
    
    // CONTEXT: Module property assignment
    module C5T5 {
        export var foo: (i: number, s: string) => string;
        foo = function(i, s) {
            return s;
        }
    }
    
    // CONTEXT: Variable assignment
    var c6t5: (n: number) => IFoo;
    c6t5 = <(n: number) => IFoo>function(n) { return <IFoo>({}) };
    
    // CONTEXT: Array index assignment
    var c7t2: IFoo[];
    c7t2[0] = <IFoo>({n: 1});
    
    // CONTEXT: Object property assignment
    interface IPlaceHolder {
        t1: (s: string) => string;
        t2: IFoo;
        t3: number[];
        t4: () => IFoo;
        t5: (n: number) => IFoo;
        t6: (n: number, s: string) => IFoo;
        t7: {
                (n: number, s: string): number;    
                //(s1: string, s2: string): number;
            };
        t8: (n: number, s: string) => number;
        t9: number[][];
        t10: IFoo[];
        t11: {(n: number, s: string): string;}[];
        t12: IBar;
        t13: IFoo;
        t14: IFoo;
        }
    
    var objc8: {
        t1: (s: string) => string;
        t2: IFoo;
        t3: number[];
        t4: () => IFoo;
        t5: (n: number) => IFoo;
        t6: (n: number, s: string) => IFoo;
        t7: {
                (n: number, s: string): number;    
                //(s1: string, s2: string): number;
            };
        t8: (n: number, s: string) => number;
        t9: number[][];
        t10: IFoo[];
        t11: {(n: number, s: string): string;}[];
        t12: IBar;
        t13: IFoo;
        t14: IFoo;
    } = <IPlaceHolder>({});
    
    objc8.t1 = (function(s) { return s });
    objc8.t2 = <IFoo>({
        n: 1
    });
    objc8.t3 = [];
    objc8.t4 = function() { return <IFoo>({}) };
    objc8.t5 = function(n) { return <IFoo>({}) };
    objc8.t6 = function(n, s) { return <IFoo>({}) };
    objc8.t7 = function(n: number) { return n };
    
    objc8.t8 = function(n) { return n; };
    objc8.t9 = [[],[]];
    objc8.t10 = [<IFoo>({}),<IFoo>({})];
    objc8.t11 = [function(n, s) { return s; }];
    objc8.t12 = {
        foo: <IFoo>({})
    }
    objc8.t13 = <IFoo>({
        f: function(i, s) { return s; }
    })
    objc8.t14 = <IFoo>({
        a: []
    })
    // CONTEXT: Function call
    function c9t5(f: (n: number) => IFoo) {};
             ~~~~
!!! error TS9007: Function must have an explicit return type annotation with --isolatedDeclarations
!!! related TS9031 contextualTyping.ts:146:10: Add a return type to the function declaration
    c9t5(function(n) {
        return <IFoo>({});
    });
    
    // CONTEXT: Return statement
    var c10t5: () => (n: number) => IFoo = function() { return function(n) { return <IFoo>({}) } };
    
    // CONTEXT: Newing a class
    class C11t5 { constructor(f: (n: number) => IFoo) { } };
    var i = new C11t5(function(n) { return <IFoo>({}) });
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
!!! error TS9010: Variable must have an explicit type annotation with --isolatedDeclarations
!!! related TS9027 contextualTyping.ts:156:5: Add a type annotation to the variable i
    
    // CONTEXT: Type annotated expression
    var c12t1 = <(s: string) => string> (function(s) { return s });
    var c12t2 = <IFoo> ({
        n: 1
    });
    var c12t3 = <number[]> [];
    var c12t4 = <() => IFoo> function() { return <IFoo>({}) };
    var c12t5 = <(n: number) => IFoo> function(n) { return <IFoo>({}) };
    var c12t6 = <(n: number, s: string) => IFoo> function(n, s) { return <IFoo>({}) };
    var c12t7 = <{
        (n: number, s: string): number;    
        //(s1: string, s2: string): number;
    }> function(n:number) { return n };
    
    var c12t8 = <(n: number, s: string) => number> function(n) { return n; };
    var c12t9 = <number[][]> [[],[]];
    var c12t10 = <IFoo[]> [<IFoo>({}),<IFoo>({})];
    var c12t11 = <{(n: number, s: string): string;}[]> [function(n, s) { return s; }];
    var c12t12 = <IBar> {
        foo: <IFoo>({})
    }
    var c12t13 = <IFoo> ({
        f: function(i, s) { return s; }
    })
    var c12t14 = <IFoo> ({
        a: []
    })
    
    // CONTEXT: Contextual typing declarations
    
    // contextually typing function declarations
    declare function EF1(a:number, b:number):number;
                     ~~~
!!! error TS2384: Overload signatures must all be ambient or non-ambient.
    
    function EF1(a,b) { return a+b; }
    
    var efv = EF1(1,2);
              ~~~~~~~~
!!! error TS9010: Variable must have an explicit type annotation with --isolatedDeclarations
!!! related TS9027 contextualTyping.ts:193:5: Add a type annotation to the variable efv
    
    
    // contextually typing from ambient class declarations
    declare class Point
    {
          constructor(x: number, y: number);
          x: number;
          y: number;
          add(dx: number, dy: number): Point;
          static origin: Point;
    
    }
    
    Point.origin = new Point(0, 0);
    
    Point.prototype.add = function(dx, dy) {
        return new Point(this.x + dx, this.y + dy);
    };
    
    Point.prototype = {
        x: 0,
        y: 0,
        add: function(dx, dy) {
            return new Point(this.x + dx, this.y + dy);
        }
    };
    
    interface A { x: string; }
    interface B extends A { }
    var x: B = { };
        ~
!!! error TS2741: Property 'x' is missing in type '{}' but required in type 'B'.
!!! related TS2728 contextualTyping.ts:221:15: 'x' is declared here.
    