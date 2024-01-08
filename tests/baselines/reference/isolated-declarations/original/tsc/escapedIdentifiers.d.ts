//// [tests/cases/compiler/escapedIdentifiers.ts] ////

//// [escapedIdentifiers.ts]
/*
    0 .. \u0030
    9 .. \u0039

    A .. \u0041
    Z .. \u005a

    a .. \u0061
    z .. \u00za
*/

// var decl
var \u0061 = 1;
a ++;
\u0061 ++;

var b = 1;
b ++;
\u0062 ++;

// modules
module moduleType1 { 
    export var baz1: number;
}
module moduleType\u0032 { 
    export var baz2: number;
}

moduleType1.baz1 = 3;
moduleType\u0031.baz1 = 3;
moduleType2.baz2 = 3;
moduleType\u0032.baz2 = 3;

// classes

class classType1 { 
    public foo1: number;
}
class classType\u0032 { 
    public foo2: number;
}

var classType1Object1 = new classType1();
classType1Object1.foo1 = 2;
var classType1Object2 = new classType\u0031();
classType1Object2.foo1 = 2;
var classType2Object1 = new classType2();
classType2Object1.foo2 = 2;
var classType2Object2 = new classType\u0032();
classType2Object2.foo2 = 2;

// interfaces
interface interfaceType1 { 
    bar1: number;
}
interface interfaceType\u0032 { 
    bar2: number;
}

var interfaceType1Object1 = <interfaceType1>{ bar1: 0 };
interfaceType1Object1.bar1 = 2;
var interfaceType1Object2 = <interfaceType\u0031>{ bar1: 0 };
interfaceType1Object2.bar1 = 2;
var interfaceType2Object1 = <interfaceType2>{ bar2: 0 };
interfaceType2Object1.bar2 = 2;
var interfaceType2Object2 = <interfaceType\u0032>{ bar2: 0 };
interfaceType2Object2.bar2 = 2;


// arguments
class testClass { 
    public func(arg1: number, arg\u0032: string, arg\u0033: boolean, arg4: number) { 
        arg\u0031 = 1;
        arg2 = 'string';
        arg\u0033 = true;
        arg4 = 2;
    }
}

// constructors
class constructorTestClass { 
    constructor (public arg1: number,public arg\u0032: string,public arg\u0033: boolean,public arg4: number) { 
    }
}
var constructorTestObject = new constructorTestClass(1, 'string', true, 2);
constructorTestObject.arg\u0031 = 1;
constructorTestObject.arg2 = 'string';
constructorTestObject.arg\u0033 = true;
constructorTestObject.arg4 = 2;

// Lables

l\u0061bel1: 
    while (false)
    {  
       while(false)
           continue label1;  // it will go to next iteration of outer loop 
    } 

label2: 
    while (false)
    {  
       while(false)
           continue l\u0061bel2;  // it will go to next iteration of outer loop 
    } 

label3: 
    while (false)
    {  
       while(false)
           continue label3;  // it will go to next iteration of outer loop 
    } 

l\u0061bel4: 
    while (false)
    {  
       while(false)
           continue l\u0061bel4;  // it will go to next iteration of outer loop 
    } 

/// [Declarations] ////



//// [escapedIdentifiers.d.ts]
declare var \u0061: number;
declare var b: number;
declare namespace moduleType1 {
    var baz1: number;
}
declare namespace moduleType\u0032 {
    var baz2: number;
}
declare class classType1 {
    foo1: number;
}
declare class classType\u0032 {
    foo2: number;
}
declare var classType1Object1: invalid;
declare var classType1Object2: invalid;
declare var classType2Object1: invalid;
declare var classType2Object2: invalid;
interface interfaceType1 {
    bar1: number;
}
interface interfaceType\u0032 {
    bar2: number;
}
declare var interfaceType1Object1: interfaceType1;
declare var interfaceType1Object2: interfaceType1;
declare var interfaceType2Object1: interfaceType\u0032;
declare var interfaceType2Object2: interfaceType\u0032;
declare class testClass {
    func(arg1: number, arg\u0032: string, arg\u0033: boolean, arg4: number): invalid;
}
declare class constructorTestClass {
    arg1: number;
    arg\u0032: string;
    arg\u0033: boolean;
    arg4: number;
    constructor(arg1: number, arg\u0032: string, arg\u0033: boolean, arg4: number);
}
declare var constructorTestObject: invalid;

/// [Errors] ////

escapedIdentifiers.ts(43,25): error TS9010: Variable must have an explicit type annotation with --isolatedDeclarations.
escapedIdentifiers.ts(45,25): error TS9010: Variable must have an explicit type annotation with --isolatedDeclarations.
escapedIdentifiers.ts(47,25): error TS9010: Variable must have an explicit type annotation with --isolatedDeclarations.
escapedIdentifiers.ts(49,25): error TS9010: Variable must have an explicit type annotation with --isolatedDeclarations.
escapedIdentifiers.ts(72,12): error TS9008: Method must have an explicit return type annotation with --isolatedDeclarations.
escapedIdentifiers.ts(85,29): error TS9010: Variable must have an explicit type annotation with --isolatedDeclarations.


==== escapedIdentifiers.ts (6 errors) ====
    /*
        0 .. \u0030
        9 .. \u0039
    
        A .. \u0041
        Z .. \u005a
    
        a .. \u0061
        z .. \u00za
    */
    
    // var decl
    var \u0061 = 1;
    a ++;
    \u0061 ++;
    
    var b = 1;
    b ++;
    \u0062 ++;
    
    // modules
    module moduleType1 { 
        export var baz1: number;
    }
    module moduleType\u0032 { 
        export var baz2: number;
    }
    
    moduleType1.baz1 = 3;
    moduleType\u0031.baz1 = 3;
    moduleType2.baz2 = 3;
    moduleType\u0032.baz2 = 3;
    
    // classes
    
    class classType1 { 
        public foo1: number;
    }
    class classType\u0032 { 
        public foo2: number;
    }
    
    var classType1Object1 = new classType1();
                            ~~~~~~~~~~~~~~~~
!!! error TS9010: Variable must have an explicit type annotation with --isolatedDeclarations.
!!! related TS9027 escapedIdentifiers.ts:43:5: Add a type annotation to the variable classType1Object1.
    classType1Object1.foo1 = 2;
    var classType1Object2 = new classType\u0031();
                            ~~~~~~~~~~~~~~~~~~~~~
!!! error TS9010: Variable must have an explicit type annotation with --isolatedDeclarations.
!!! related TS9027 escapedIdentifiers.ts:45:5: Add a type annotation to the variable classType1Object2.
    classType1Object2.foo1 = 2;
    var classType2Object1 = new classType2();
                            ~~~~~~~~~~~~~~~~
!!! error TS9010: Variable must have an explicit type annotation with --isolatedDeclarations.
!!! related TS9027 escapedIdentifiers.ts:47:5: Add a type annotation to the variable classType2Object1.
    classType2Object1.foo2 = 2;
    var classType2Object2 = new classType\u0032();
                            ~~~~~~~~~~~~~~~~~~~~~
!!! error TS9010: Variable must have an explicit type annotation with --isolatedDeclarations.
!!! related TS9027 escapedIdentifiers.ts:49:5: Add a type annotation to the variable classType2Object2.
    classType2Object2.foo2 = 2;
    
    // interfaces
    interface interfaceType1 { 
        bar1: number;
    }
    interface interfaceType\u0032 { 
        bar2: number;
    }
    
    var interfaceType1Object1 = <interfaceType1>{ bar1: 0 };
    interfaceType1Object1.bar1 = 2;
    var interfaceType1Object2 = <interfaceType\u0031>{ bar1: 0 };
    interfaceType1Object2.bar1 = 2;
    var interfaceType2Object1 = <interfaceType2>{ bar2: 0 };
    interfaceType2Object1.bar2 = 2;
    var interfaceType2Object2 = <interfaceType\u0032>{ bar2: 0 };
    interfaceType2Object2.bar2 = 2;
    
    
    // arguments
    class testClass { 
        public func(arg1: number, arg\u0032: string, arg\u0033: boolean, arg4: number) { 
               ~~~~
!!! error TS9008: Method must have an explicit return type annotation with --isolatedDeclarations.
!!! related TS9034 escapedIdentifiers.ts:72:12: Add a return type to the method
            arg\u0031 = 1;
            arg2 = 'string';
            arg\u0033 = true;
            arg4 = 2;
        }
    }
    
    // constructors
    class constructorTestClass { 
        constructor (public arg1: number,public arg\u0032: string,public arg\u0033: boolean,public arg4: number) { 
        }
    }
    var constructorTestObject = new constructorTestClass(1, 'string', true, 2);
                                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
!!! error TS9010: Variable must have an explicit type annotation with --isolatedDeclarations.
!!! related TS9027 escapedIdentifiers.ts:85:5: Add a type annotation to the variable constructorTestObject.
    constructorTestObject.arg\u0031 = 1;
    constructorTestObject.arg2 = 'string';
    constructorTestObject.arg\u0033 = true;
    constructorTestObject.arg4 = 2;
    
    // Lables
    
    l\u0061bel1: 
        while (false)
        {  
           while(false)
               continue label1;  // it will go to next iteration of outer loop 
        } 
    
    label2: 
        while (false)
        {  
           while(false)
               continue l\u0061bel2;  // it will go to next iteration of outer loop 
        } 
    
    label3: 
        while (false)
        {  
           while(false)
               continue label3;  // it will go to next iteration of outer loop 
        } 
    
    l\u0061bel4: 
        while (false)
        {  
           while(false)
               continue l\u0061bel4;  // it will go to next iteration of outer loop 
        } 