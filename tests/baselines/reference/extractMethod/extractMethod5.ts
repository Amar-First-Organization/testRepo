// ==ORIGINAL==
namespace A {
    let x = 1;
    export function foo() {
    }
    namespace B {
        function a() {
            let a = 1;
        
            let y = 5;
            let z = x;
            a = y;
            foo();
        }
    }
}
// ==SCOPE::inner function in function 'a'==
namespace A {
    let x = 1;
    export function foo() {
    }
    namespace B {
        function a() {
            let a = 1;
        
            newFunction();

            function newFunction() {
                let y = 5;
                let z = x;
                a = y;
                foo();
            }
        }
    }
}
// ==SCOPE::function in namespace 'B'==
namespace A {
    let x = 1;
    export function foo() {
    }
    namespace B {
        function a() {
            let a = 1;
        
            a = newFunction(a);
        }

        function newFunction(a: number) {
            let y = 5;
            let z = x;
            a = y;
            foo();
            return a;
        }
    }
}
// ==SCOPE::function in namespace 'A'==
namespace A {
    let x = 1;
    export function foo() {
    }
    namespace B {
        function a() {
            let a = 1;
        
            a = newFunction(a);
        }
    }

    function newFunction(a: number) {
        let y = 5;
        let z = x;
        a = y;
        foo();
        return a;
    }
}
// ==SCOPE::function in global scope==
namespace A {
    let x = 1;
    export function foo() {
    }
    namespace B {
        function a() {
            let a = 1;
        
            a = newFunction(x, a);
        }
    }
}
function newFunction(x: number, a: number) {
    let y = 5;
    let z = x;
    a = y;
    A.foo();
    return a;
}
