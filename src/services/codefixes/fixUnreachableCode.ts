/* @internal */
namespace ts.codefix {
    const fixId = "fixUnreachableCode";
    const errorCodes = [Diagnostics.Unreachable_code_detected.code];
    registerCodeFix({
        errorCodes,
        getCodeActions(context) {
            const changes = textChanges.ChangeTracker.with(context, t => doChange(t, context.sourceFile, context.span.start));
            return [createCodeFixAction(fixId, changes, Diagnostics.Remove_unreachable_code, fixId, Diagnostics.Remove_all_unreachable_code)];
        },
        fixIds: [fixId],
        getAllCodeActions: context => codeFixAll(context, errorCodes, (changes, diag) => doChange(changes, diag.file, diag.start)),
    });

    function doChange(changes: textChanges.ChangeTracker, sourceFile: SourceFile, start: number): void {
        const token = getTokenAtPosition(sourceFile, start, /*includeJsDocComment*/ false);
        const statement = findAncestor(token, isStatement);
        Debug.assert(statement.getStart(sourceFile) === token.getStart(sourceFile));

        const container = (isBlock(statement.parent) ? statement.parent : statement).parent;
        switch (container.kind) {
            case SyntaxKind.IfStatement:
                if ((container as IfStatement).elseStatement) {
                    if (isBlock(statement.parent)) {
                        changes.deleteNodeRange(sourceFile, first(statement.parent.statements), last(statement.parent.statements));
                    }
                    else {
                        changes.replaceNode(sourceFile, statement, createBlock(emptyArray));
                    }
                    break;
                }
                // falls through
            case SyntaxKind.WhileStatement:
            case SyntaxKind.ForStatement:
                changes.deleteNode(sourceFile, container);
                break;
            default:
                if (isBlock(statement.parent)) {
                    split(sliceAfter(statement.parent.statements, statement), s => !isFunctionDeclaration(s), (start, end) => changes.deleteNodeRange(sourceFile, start, end));
                }
                else {
                    changes.deleteNode(sourceFile, statement);
                }
        }
    }

    function sliceAfter<T>(arr: ReadonlyArray<T>, value: T): ReadonlyArray<T> {
        const index = arr.indexOf(value);
        Debug.assert(index !== -1);
        return arr.slice(index);
    }

    // Calls 'cb' with the start and end of each range where 'pred' is true.
    function split<T>(arr: ReadonlyArray<T>, pred: (t: T) => boolean, cb: (start: T, end: T) => void): void {
        let start: T | undefined;
        for (let i = 0; i < arr.length; i++) {
            const value = arr[i];
            if (pred(value)) {
                start = start || value;
            }
            else {
                if (start) {
                    cb(start, arr[i - 1]);
                    start = undefined;
                }
            }
        }
        if (start) cb(start, arr[arr.length - 1]);
    }
}
