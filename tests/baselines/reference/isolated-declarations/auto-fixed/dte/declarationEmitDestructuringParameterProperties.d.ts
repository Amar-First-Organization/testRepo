//// [tests/cases/compiler/declarationEmitDestructuringParameterProperties.ts] ////

//// [declarationEmitDestructuringParameterProperties.ts]
class C1 {
    constructor(public [x, y, z]: string[]) {
    }
}

type TupleType1 =[string, number, boolean];
class C2 {
    constructor(public [x, y, z]: TupleType1) {
    }
}

type ObjType1 = { x: number; y: string; z: boolean }
class C3 {
    constructor(public { x, y, z }: ObjType1) {
    }
}

/// [Declarations] ////



//// [declarationEmitDestructuringParameterProperties.d.ts]
declare class C1 {
    x: invalid;
    y: invalid;
    z: invalid;
    constructor([x, y, z]: string[]);
}
type TupleType1 = [string, number, boolean];
declare class C2 {
    x: invalid;
    y: invalid;
    z: invalid;
    constructor([x, y, z]: TupleType1);
}
type ObjType1 = {
    x: number;
    y: string;
    z: boolean;
};
declare class C3 {
    x: invalid;
    y: invalid;
    z: invalid;
    constructor({ x, y, z }: ObjType1);
}
//# sourceMappingURL=declarationEmitDestructuringParameterProperties.d.ts.map
/// [Errors] ////

declarationEmitDestructuringParameterProperties.ts(2,17): error TS1187: A parameter property may not be declared using a binding pattern.
declarationEmitDestructuringParameterProperties.ts(8,17): error TS1187: A parameter property may not be declared using a binding pattern.
declarationEmitDestructuringParameterProperties.ts(14,17): error TS1187: A parameter property may not be declared using a binding pattern.


==== declarationEmitDestructuringParameterProperties.ts (3 errors) ====
    class C1 {
        constructor(public [x, y, z]: string[]) {
                    ~~~~~~~~~~~~~~~~~~~~~~~~~~
!!! error TS1187: A parameter property may not be declared using a binding pattern.
        }
    }
    
    type TupleType1 =[string, number, boolean];
    class C2 {
        constructor(public [x, y, z]: TupleType1) {
                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
!!! error TS1187: A parameter property may not be declared using a binding pattern.
        }
    }
    
    type ObjType1 = { x: number; y: string; z: boolean }
    class C3 {
        constructor(public { x, y, z }: ObjType1) {
                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
!!! error TS1187: A parameter property may not be declared using a binding pattern.
        }
    }