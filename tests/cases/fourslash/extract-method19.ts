/// <reference path='fourslash.ts' />

// New function names should be totally new to the file

//// function fn() {
////     /*a*/console.log("hi");/*b*/
//// }
////
//// function newFunction() { }

goTo.select('a', 'b')
edit.applyRefactor({
    refactorName: "Extract Method",
    actionName: "scope_0",
    actionDescription: "Extract function into function 'fn'",
});
verify.currentFileContentIs(`function fn() {
    newFunction_1();

    function newFunction_1() {
        console.log("hi");
    }
}

function newFunction() { }`);
