//// [tests/cases/conformance/classes/members/inheritanceAndOverriding/derivedClassOverridesProtectedMembers3.ts] ////

//// [derivedClassOverridesProtectedMembers3.ts]
var x: { foo: string; }
var y: { foo: string; bar: string; }

class Base {
    a: typeof x;
    b(a: typeof x) { }
    get c() { return x; }
    set c(v: typeof x) { }
    d: (a: typeof x) => void;

    static r: typeof x;
    static s(a: typeof x) { }
    static get t() { return x; }
    static set t(v: typeof x) { }
    static u: (a: typeof x) => void;

    constructor(a: typeof x) {}
}

// Errors
// decrease visibility of all public members to protected
class Derived1 extends Base {
    protected a: typeof x;
    constructor(a: typeof x) { super(a); }
}

class Derived2 extends Base {
    protected b(a: typeof x) { }
    constructor(a: typeof x) { super(a); }
}

class Derived3 extends Base {
    protected get c() { return x; }
    constructor(a: typeof x) { super(a); }
}

class Derived4 extends Base {
    protected set c(v: typeof x) { }
    constructor(a: typeof x) { super(a); }
}

class Derived5 extends Base {
    protected d: (a: typeof x) => void ;
    constructor(a: typeof x) { super(a); }
}

class Derived6 extends Base {
    protected static r: typeof x;
    constructor(a: typeof x) { super(a); }
}

class Derived7 extends Base {
    protected static s(a: typeof x) { }
    constructor(a: typeof x) { super(a); }
}

class Derived8 extends Base {
    protected static get t() { return x; }
    constructor(a: typeof x) { super(a); }
}

class Derived9 extends Base {
    protected static set t(v: typeof x) { }
    constructor(a: typeof x) { super(a); }
}

class Derived10 extends Base {
    protected static u: (a: typeof x) => void ;
    constructor(a: typeof x) { super(a); }
}

/// [Declarations] ////



//// [derivedClassOverridesProtectedMembers3.d.ts]
declare var x: {
    foo: string;
};
declare var y: {
    foo: string;
    bar: string;
};
declare class Base {
    a: typeof x;
    b(a: typeof x): invalid;
    get c(): typeof x;
    set c(v: typeof x);
    d: (a: typeof x) => void;
    static r: typeof x;
    static s(a: typeof x): invalid;
    static get t(): typeof x;
    static set t(v: typeof x);
    static u: (a: typeof x) => void;
    constructor(a: typeof x);
}
declare class Derived1 extends Base {
    protected a: typeof x;
    constructor(a: typeof x);
}
declare class Derived2 extends Base {
    protected b(a: typeof x): invalid;
    constructor(a: typeof x);
}
declare class Derived3 extends Base {
    protected get c(): invalid;
    constructor(a: typeof x);
}
declare class Derived4 extends Base {
    protected set c(v: typeof x);
    constructor(a: typeof x);
}
declare class Derived5 extends Base {
    protected d: (a: typeof x) => void;
    constructor(a: typeof x);
}
declare class Derived6 extends Base {
    protected static r: typeof x;
    constructor(a: typeof x);
}
declare class Derived7 extends Base {
    protected static s(a: typeof x): invalid;
    constructor(a: typeof x);
}
declare class Derived8 extends Base {
    protected static get t(): invalid;
    constructor(a: typeof x);
}
declare class Derived9 extends Base {
    protected static set t(v: typeof x);
    constructor(a: typeof x);
}
declare class Derived10 extends Base {
    protected static u: (a: typeof x) => void;
    constructor(a: typeof x);
}

/// [Errors] ////

derivedClassOverridesProtectedMembers3.ts(6,5): error TS9008: Method must have an explicit return type annotation with --isolatedDeclarations.
derivedClassOverridesProtectedMembers3.ts(12,12): error TS9008: Method must have an explicit return type annotation with --isolatedDeclarations.
derivedClassOverridesProtectedMembers3.ts(22,7): error TS2415: Class 'Derived1' incorrectly extends base class 'Base'.
  Property 'a' is protected in type 'Derived1' but public in type 'Base'.
derivedClassOverridesProtectedMembers3.ts(27,7): error TS2415: Class 'Derived2' incorrectly extends base class 'Base'.
  Property 'b' is protected in type 'Derived2' but public in type 'Base'.
derivedClassOverridesProtectedMembers3.ts(28,15): error TS9008: Method must have an explicit return type annotation with --isolatedDeclarations.
derivedClassOverridesProtectedMembers3.ts(32,7): error TS2415: Class 'Derived3' incorrectly extends base class 'Base'.
  Property 'c' is protected in type 'Derived3' but public in type 'Base'.
derivedClassOverridesProtectedMembers3.ts(33,19): error TS9009: At least one accessor must have an explicit return type annotation with --isolatedDeclarations.
derivedClassOverridesProtectedMembers3.ts(37,7): error TS2415: Class 'Derived4' incorrectly extends base class 'Base'.
  Property 'c' is protected in type 'Derived4' but public in type 'Base'.
derivedClassOverridesProtectedMembers3.ts(42,7): error TS2415: Class 'Derived5' incorrectly extends base class 'Base'.
  Property 'd' is protected in type 'Derived5' but public in type 'Base'.
derivedClassOverridesProtectedMembers3.ts(47,7): error TS2417: Class static side 'typeof Derived6' incorrectly extends base class static side 'typeof Base'.
  Property 'r' is protected in type 'typeof Derived6' but public in type 'typeof Base'.
derivedClassOverridesProtectedMembers3.ts(52,7): error TS2417: Class static side 'typeof Derived7' incorrectly extends base class static side 'typeof Base'.
  Property 's' is protected in type 'typeof Derived7' but public in type 'typeof Base'.
derivedClassOverridesProtectedMembers3.ts(53,22): error TS9008: Method must have an explicit return type annotation with --isolatedDeclarations.
derivedClassOverridesProtectedMembers3.ts(57,7): error TS2417: Class static side 'typeof Derived8' incorrectly extends base class static side 'typeof Base'.
  Property 't' is protected in type 'typeof Derived8' but public in type 'typeof Base'.
derivedClassOverridesProtectedMembers3.ts(58,26): error TS9009: At least one accessor must have an explicit return type annotation with --isolatedDeclarations.
derivedClassOverridesProtectedMembers3.ts(62,7): error TS2417: Class static side 'typeof Derived9' incorrectly extends base class static side 'typeof Base'.
  Property 't' is protected in type 'typeof Derived9' but public in type 'typeof Base'.
derivedClassOverridesProtectedMembers3.ts(67,7): error TS2417: Class static side 'typeof Derived10' incorrectly extends base class static side 'typeof Base'.
  Property 'u' is protected in type 'typeof Derived10' but public in type 'typeof Base'.


==== derivedClassOverridesProtectedMembers3.ts (16 errors) ====
    var x: { foo: string; }
    var y: { foo: string; bar: string; }
    
    class Base {
        a: typeof x;
        b(a: typeof x) { }
        ~
!!! error TS9008: Method must have an explicit return type annotation with --isolatedDeclarations.
!!! related TS9034 derivedClassOverridesProtectedMembers3.ts:6:5: Add a return type to the method
        get c() { return x; }
        set c(v: typeof x) { }
        d: (a: typeof x) => void;
    
        static r: typeof x;
        static s(a: typeof x) { }
               ~
!!! error TS9008: Method must have an explicit return type annotation with --isolatedDeclarations.
!!! related TS9034 derivedClassOverridesProtectedMembers3.ts:12:12: Add a return type to the method
        static get t() { return x; }
        static set t(v: typeof x) { }
        static u: (a: typeof x) => void;
    
        constructor(a: typeof x) {}
    }
    
    // Errors
    // decrease visibility of all public members to protected
    class Derived1 extends Base {
          ~~~~~~~~
!!! error TS2415: Class 'Derived1' incorrectly extends base class 'Base'.
!!! error TS2415:   Property 'a' is protected in type 'Derived1' but public in type 'Base'.
        protected a: typeof x;
        constructor(a: typeof x) { super(a); }
    }
    
    class Derived2 extends Base {
          ~~~~~~~~
!!! error TS2415: Class 'Derived2' incorrectly extends base class 'Base'.
!!! error TS2415:   Property 'b' is protected in type 'Derived2' but public in type 'Base'.
        protected b(a: typeof x) { }
                  ~
!!! error TS9008: Method must have an explicit return type annotation with --isolatedDeclarations.
!!! related TS9034 derivedClassOverridesProtectedMembers3.ts:28:15: Add a return type to the method
        constructor(a: typeof x) { super(a); }
    }
    
    class Derived3 extends Base {
          ~~~~~~~~
!!! error TS2415: Class 'Derived3' incorrectly extends base class 'Base'.
!!! error TS2415:   Property 'c' is protected in type 'Derived3' but public in type 'Base'.
        protected get c() { return x; }
                      ~
!!! error TS9009: At least one accessor must have an explicit return type annotation with --isolatedDeclarations.
!!! related TS9032 derivedClassOverridesProtectedMembers3.ts:33:19: Add a return type to the get accessor declaration.
        constructor(a: typeof x) { super(a); }
    }
    
    class Derived4 extends Base {
          ~~~~~~~~
!!! error TS2415: Class 'Derived4' incorrectly extends base class 'Base'.
!!! error TS2415:   Property 'c' is protected in type 'Derived4' but public in type 'Base'.
        protected set c(v: typeof x) { }
        constructor(a: typeof x) { super(a); }
    }
    
    class Derived5 extends Base {
          ~~~~~~~~
!!! error TS2415: Class 'Derived5' incorrectly extends base class 'Base'.
!!! error TS2415:   Property 'd' is protected in type 'Derived5' but public in type 'Base'.
        protected d: (a: typeof x) => void ;
        constructor(a: typeof x) { super(a); }
    }
    
    class Derived6 extends Base {
          ~~~~~~~~
!!! error TS2417: Class static side 'typeof Derived6' incorrectly extends base class static side 'typeof Base'.
!!! error TS2417:   Property 'r' is protected in type 'typeof Derived6' but public in type 'typeof Base'.
        protected static r: typeof x;
        constructor(a: typeof x) { super(a); }
    }
    
    class Derived7 extends Base {
          ~~~~~~~~
!!! error TS2417: Class static side 'typeof Derived7' incorrectly extends base class static side 'typeof Base'.
!!! error TS2417:   Property 's' is protected in type 'typeof Derived7' but public in type 'typeof Base'.
        protected static s(a: typeof x) { }
                         ~
!!! error TS9008: Method must have an explicit return type annotation with --isolatedDeclarations.
!!! related TS9034 derivedClassOverridesProtectedMembers3.ts:53:22: Add a return type to the method
        constructor(a: typeof x) { super(a); }
    }
    
    class Derived8 extends Base {
          ~~~~~~~~
!!! error TS2417: Class static side 'typeof Derived8' incorrectly extends base class static side 'typeof Base'.
!!! error TS2417:   Property 't' is protected in type 'typeof Derived8' but public in type 'typeof Base'.
        protected static get t() { return x; }
                             ~
!!! error TS9009: At least one accessor must have an explicit return type annotation with --isolatedDeclarations.
!!! related TS9032 derivedClassOverridesProtectedMembers3.ts:58:26: Add a return type to the get accessor declaration.
        constructor(a: typeof x) { super(a); }
    }
    
    class Derived9 extends Base {
          ~~~~~~~~
!!! error TS2417: Class static side 'typeof Derived9' incorrectly extends base class static side 'typeof Base'.
!!! error TS2417:   Property 't' is protected in type 'typeof Derived9' but public in type 'typeof Base'.
        protected static set t(v: typeof x) { }
        constructor(a: typeof x) { super(a); }
    }
    
    class Derived10 extends Base {
          ~~~~~~~~~
!!! error TS2417: Class static side 'typeof Derived10' incorrectly extends base class static side 'typeof Base'.
!!! error TS2417:   Property 'u' is protected in type 'typeof Derived10' but public in type 'typeof Base'.
        protected static u: (a: typeof x) => void ;
        constructor(a: typeof x) { super(a); }
    }