//// [tests/cases/compiler/inKeywordAndIntersection.ts] ////

//// [inKeywordAndIntersection.ts]
class A { a = 0 }
class B { b = 0 }

function f10(obj: A & { x: string } | B) {
    if (obj instanceof Object) {
        obj;  // A & { x: string } | B
    }
    else {
        obj;  // Error
    }
}

// Repro from #50844

interface InstanceOne {
    one(): void
}

interface InstanceTwo {
    two(): void
}

const instance = {} as InstanceOne | InstanceTwo

const ClassOne = {} as { new(): InstanceOne } & { foo: true };

if (instance instanceof ClassOne) {
    instance.one();
}


/// [Declarations] ////



//// [inKeywordAndIntersection.d.ts]
declare class A {
    a: number;
}
declare class B {
    b: number;
}
declare function f10(obj: A & {
    x: string;
} | B): invalid;
interface InstanceOne {
    one(): void;
}
interface InstanceTwo {
    two(): void;
}
declare const instance: InstanceOne | InstanceTwo;
declare const ClassOne: (new () => InstanceOne) & {
    foo: true;
};

/// [Errors] ////

inKeywordAndIntersection.ts(4,10): error TS9007: Function must have an explicit return type annotation with --isolatedDeclarations


==== inKeywordAndIntersection.ts (1 errors) ====
    class A { a = 0 }
    class B { b = 0 }
    
    function f10(obj: A & { x: string } | B) {
             ~~~
!!! error TS9007: Function must have an explicit return type annotation with --isolatedDeclarations
!!! related TS9031 inKeywordAndIntersection.ts:4:10: Add a return type to the function declaration
        if (obj instanceof Object) {
            obj;  // A & { x: string } | B
        }
        else {
            obj;  // Error
        }
    }
    
    // Repro from #50844
    
    interface InstanceOne {
        one(): void
    }
    
    interface InstanceTwo {
        two(): void
    }
    
    const instance = {} as InstanceOne | InstanceTwo
    
    const ClassOne = {} as { new(): InstanceOne } & { foo: true };
    
    if (instance instanceof ClassOne) {
        instance.one();
    }
    