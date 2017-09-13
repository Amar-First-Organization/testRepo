/// <reference path='fourslash.ts' />

// You cannot extract a function initializer into the function's body.
// The innermost scope (scope_0) is the sibling of the function, not the function itself.

//// function fn(x = /*a*/1 + 1/*b*/) {
//// }

goTo.select('a', 'b');
edit.applyRefactor({
    refactorName: "Extract Method",
    actionName: "scope_0",
    actionDescription: "Extract to function in global scope",
    newContent:
`function fn(x = /*RENAME*/newFunction()) {
}
function newFunction() {
    return 1 + 1;
}
`
});
