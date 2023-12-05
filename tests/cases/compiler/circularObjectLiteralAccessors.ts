// @isolatedDeclarationDiffReason: TS merges accessors with the same type. DTE can only merge if one type is specified.
// @target: es5

// Repro from #6000

const a = {
    b: {
        get foo(): string {
            return a.foo;
        },
        set foo(value: string) {
            a.foo = value;
        }
    },
    foo: ''
};