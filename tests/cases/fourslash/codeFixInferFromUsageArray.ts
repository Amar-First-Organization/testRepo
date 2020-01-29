/// <reference path='fourslash.ts' />

// @noImplicitAny: true
//// function foo([|p, a, b, c, d, e |]) {
////     var x: string = a.pop()
////     b.reverse()
////     var rr: boolean[] = c.reverse()
////     d.some(t => t > 1); // can't infer from callbacks right now
////     var y = e.concat(12);
////     return p.push(12)
//// }

verify.rangeAfterCodeFix("p: number[], a: string[], b: any[], c: boolean[], d: any[], e: number[]", /*includeWhiteSpace*/ undefined, /*errorCode*/ undefined, /*index*/0);

