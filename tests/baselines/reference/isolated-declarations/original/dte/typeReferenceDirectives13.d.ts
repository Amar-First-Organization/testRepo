//// [tests/cases/compiler/typeReferenceDirectives13.ts] ////

//// [app.ts]
/// <reference types="lib"/>
import {$} from "./ref";
export interface A {
    x: () => typeof $
}

//// [ref.d.ts]
export interface $ { x }

//// [index.d.ts]
declare let $: { x: number }


/// [Declarations] ////



//// [/app.d.ts]
import { $ } from "./ref";
export interface A {
    x: () => typeof $;
}

/// [Errors] ////

/app.ts(1,23): error TS9025: Reference directives are not supported with --isolatedDeclarations.


==== /app.ts (1 errors) ====
    /// <reference types="lib"/>
                          ~~~
!!! error TS9025: Reference directives are not supported with --isolatedDeclarations.
    import {$} from "./ref";
    export interface A {
        x: () => typeof $
    }
    
==== /ref.d.ts (0 errors) ====
    export interface $ { x }
    
==== /types/lib/index.d.ts (0 errors) ====
    declare let $: { x: number }
    