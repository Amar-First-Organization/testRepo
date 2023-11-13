//// [tests/cases/compiler/jsxNamespaceImplicitImportJSXNamespaceFromPragmaPickedOverGlobalOne.tsx] ////

//// [/node_modules/react/index.d.ts]
export = React;
export as namespace React;

declare namespace React { }

declare global {
    namespace JSX {
        interface Element { }
        interface ElementClass { }
        interface ElementAttributesProperty { }
        interface ElementChildrenAttribute { }
        type LibraryManagedAttributes<C, P> = {}
        interface IntrinsicAttributes { }
        interface IntrinsicClassAttributes<T> { }
        interface IntrinsicElements {
            div: {}
        }
    }
}
//// [/node_modules/@emotion/react/jsx-runtime/index.d.ts]
export { EmotionJSX as JSX } from './jsx-namespace'

//// [/node_modules/@emotion/react/jsx-runtime/jsx-namespace.d.ts]
import 'react'

type WithConditionalCSSProp<P> = 'className' extends keyof P
    ? (P extends { className?: string } ? P & { css?: string } : P)
    : P

type ReactJSXElement = JSX.Element
type ReactJSXElementClass = JSX.ElementClass
type ReactJSXElementAttributesProperty = JSX.ElementAttributesProperty
type ReactJSXElementChildrenAttribute = JSX.ElementChildrenAttribute
type ReactJSXLibraryManagedAttributes<C, P> = JSX.LibraryManagedAttributes<C, P>
type ReactJSXIntrinsicAttributes = JSX.IntrinsicAttributes
type ReactJSXIntrinsicClassAttributes<T> = JSX.IntrinsicClassAttributes<T>
type ReactJSXIntrinsicElements = JSX.IntrinsicElements

export namespace EmotionJSX {
    interface Element extends ReactJSXElement { }
    interface ElementClass extends ReactJSXElementClass { }
    interface ElementAttributesProperty
        extends ReactJSXElementAttributesProperty { }
    interface ElementChildrenAttribute extends ReactJSXElementChildrenAttribute { }

    type LibraryManagedAttributes<C, P> = WithConditionalCSSProp<P> &
        ReactJSXLibraryManagedAttributes<C, P>

    interface IntrinsicAttributes extends ReactJSXIntrinsicAttributes { }
    interface IntrinsicClassAttributes<T>
        extends ReactJSXIntrinsicClassAttributes<T> { }

    type IntrinsicElements = {
        [K in keyof ReactJSXIntrinsicElements]: ReactJSXIntrinsicElements[K] & {
            css?: string
        }
    }
}

//// [/index.tsx]
/* @jsxImportSource @emotion/react */
export const Comp = () => <div css="color: hotpink;"></div>;


/// [Declarations] ////



//// [/index.d.ts]
export declare const Comp: invalid;
/// [Errors] ////

/index.tsx(2,21): error TS9007: Declaration emit for this file requires type resolution. An explicit type annotation may unblock declaration emit.


==== /node_modules/react/index.d.ts (0 errors) ====
    export = React;
    export as namespace React;
    
    declare namespace React { }
    
    declare global {
        namespace JSX {
            interface Element { }
            interface ElementClass { }
            interface ElementAttributesProperty { }
            interface ElementChildrenAttribute { }
            type LibraryManagedAttributes<C, P> = {}
            interface IntrinsicAttributes { }
            interface IntrinsicClassAttributes<T> { }
            interface IntrinsicElements {
                div: {}
            }
        }
    }
==== /node_modules/@emotion/react/jsx-runtime/index.d.ts (0 errors) ====
    export { EmotionJSX as JSX } from './jsx-namespace'
    
==== /node_modules/@emotion/react/jsx-runtime/jsx-namespace.d.ts (0 errors) ====
    import 'react'
    
    type WithConditionalCSSProp<P> = 'className' extends keyof P
        ? (P extends { className?: string } ? P & { css?: string } : P)
        : P
    
    type ReactJSXElement = JSX.Element
    type ReactJSXElementClass = JSX.ElementClass
    type ReactJSXElementAttributesProperty = JSX.ElementAttributesProperty
    type ReactJSXElementChildrenAttribute = JSX.ElementChildrenAttribute
    type ReactJSXLibraryManagedAttributes<C, P> = JSX.LibraryManagedAttributes<C, P>
    type ReactJSXIntrinsicAttributes = JSX.IntrinsicAttributes
    type ReactJSXIntrinsicClassAttributes<T> = JSX.IntrinsicClassAttributes<T>
    type ReactJSXIntrinsicElements = JSX.IntrinsicElements
    
    export namespace EmotionJSX {
        interface Element extends ReactJSXElement { }
        interface ElementClass extends ReactJSXElementClass { }
        interface ElementAttributesProperty
            extends ReactJSXElementAttributesProperty { }
        interface ElementChildrenAttribute extends ReactJSXElementChildrenAttribute { }
    
        type LibraryManagedAttributes<C, P> = WithConditionalCSSProp<P> &
            ReactJSXLibraryManagedAttributes<C, P>
    
        interface IntrinsicAttributes extends ReactJSXIntrinsicAttributes { }
        interface IntrinsicClassAttributes<T>
            extends ReactJSXIntrinsicClassAttributes<T> { }
    
        type IntrinsicElements = {
            [K in keyof ReactJSXIntrinsicElements]: ReactJSXIntrinsicElements[K] & {
                css?: string
            }
        }
    }
    
==== /index.tsx (1 errors) ====
    /* @jsxImportSource @emotion/react */
    export const Comp = () => <div css="color: hotpink;"></div>;
                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
!!! error TS9007: Declaration emit for this file requires type resolution. An explicit type annotation may unblock declaration emit.
    