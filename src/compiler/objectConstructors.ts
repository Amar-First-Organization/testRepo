import {
    __String,
    BaseType,
    Debug,
    Declaration,
    DestructuringPattern,
    getLineAndCharacterOfPosition,
    getObjectFlags,
    identity,
    IndexKind,
    IndexType,
    InterfaceType,
    IntersectionType,
    isThisTypeParameter,
    JSDocSignature,
    JSDocTagInfo,
    LineAndCharacter,
    LiteralType,
    Node,
    NumberLiteralType,
    ObjectFlags,
    ObjectType,
    Signature,
    SignatureDeclaration,
    SignatureFlags,
    SignatureKind,
    SourceMapSource,
    StringLiteralType,
    Symbol,
    SymbolDisplayPart,
    SymbolFlags,
    SymbolLinks,
    symbolName,
    SymbolTable,
    Type,
    TypeChecker,
    TypeFlags,
    TypeMapper,
    TypeParameter,
    TypePredicate,
    TypeReference,
    UnionOrIntersectionType,
    UnionType,
} from "./_namespaces/ts";
import { SignatureObjectInternals } from "./signatureObjectInternals";
import { SymbolObjectInternals } from "./symbolObjectInternals";

/** @internal */
export class SymbolObject implements Symbol {
    flags: SymbolFlags = 0;
    escapedName: __String = "" as __String;
    declarations?: Declaration[] = undefined;
    valueDeclaration?: Declaration = undefined;

    // TODO: Can we remove this property? Possibly not, but most call sites use it as a key in a Map, but we could store
    //       the symbol itself.
    id = 0;

    // TODO: Can we remove this property? We could possibly just change `mergedSymbols` in checker to be a Map with this
    //       symbol as the key.
    mergeId = 0;
    parent?: Symbol = undefined;
    members?: SymbolTable = undefined;
    exports?: SymbolTable = undefined;
    exportSymbol?: Symbol = undefined;

    // TODO: Can we remove this property or turn it into a flag along with `isReplaceableByMethod`?
    constEnumOnlyModule: boolean | undefined = undefined;
    // TODO: Does this property require all symbol flags or a subset? Could we use a different enum and combine it with
    //       `constEnumOnlyModule` and `isReplaceableByMethod`?
    isReferenced?: SymbolFlags = undefined;
    // TODO: This is set by checker and not the binder. It should be moved to `SymbolLinks`.
    lastAssignmentPos?: number = undefined;
    links?: SymbolLinks = undefined; // used by TransientSymbol

    // TODO: Review these for polymorphism:
    declare isReplaceableByMethod?: boolean;
    declare assignmentDeclarationMembers?: Map<number, Declaration>;
    declare globalExports?: SymbolTable;

    constructor(flags: SymbolFlags, name: __String) {
        this.flags = flags;
        this.escapedName = name;
    }

    getFlags(): SymbolFlags {
        return this.flags;
    }

    get name(): string {
        return symbolName(this);
    }

    getEscapedName(): __String {
        return this.escapedName;
    }

    getName(): string {
        return this.name;
    }

    getDeclarations(): Declaration[] | undefined {
        return this.declarations;
    }

    getDocumentationComment(checker: TypeChecker | undefined): SymbolDisplayPart[] {
        return SymbolObjectInternals.internals.getDocumentationComment(this, checker);
    }

    getContextualDocumentationComment(context: Node | undefined, checker: TypeChecker | undefined): SymbolDisplayPart[] {
        return SymbolObjectInternals.internals.getContextualDocumentationComment(this, context, checker);
    }

    getJsDocTags(checker?: TypeChecker): JSDocTagInfo[] {
        return SymbolObjectInternals.internals.getJsDocTags(this, checker);
    }

    getContextualJsDocTags(context: Node | undefined, checker: TypeChecker | undefined): JSDocTagInfo[] {
        return SymbolObjectInternals.internals.getContextualJsDocTags(this, context, checker);
    }
}

/** @internal */
export class TypeObject implements Type {
    flags: TypeFlags;
    checker: TypeChecker;
    id = 0;

    // TODO: Review for polymorphism
    declare symbol: Symbol;
    declare pattern?: DestructuringPattern;
    declare aliasSymbol?: Symbol;
    declare aliasTypeArguments?: readonly Type[];
    declare permissiveInstantiation?: Type;
    declare restrictiveInstantiation?: Type;
    declare uniqueLiteralFilledInstantiation?: Type;
    declare immediateBaseConstraint?: Type;
    declare widened?: Type;

    constructor(checker: TypeChecker, flags: TypeFlags) {
        this.flags = flags;
        this.checker = checker;
    }

    getFlags(): TypeFlags {
        return this.flags;
    }

    getSymbol(): Symbol | undefined {
        return this.symbol;
    }

    getProperties(): Symbol[] {
        return this.checker.getPropertiesOfType(this);
    }

    getProperty(propertyName: string): Symbol | undefined {
        return this.checker.getPropertyOfType(this, propertyName);
    }

    getApparentProperties(): Symbol[] {
        return this.checker.getAugmentedPropertiesOfType(this);
    }

    getCallSignatures(): readonly Signature[] {
        return this.checker.getSignaturesOfType(this, SignatureKind.Call);
    }

    getConstructSignatures(): readonly Signature[] {
        return this.checker.getSignaturesOfType(this, SignatureKind.Construct);
    }

    getStringIndexType(): Type | undefined {
        return this.checker.getIndexTypeOfType(this, IndexKind.String);
    }

    getNumberIndexType(): Type | undefined {
        return this.checker.getIndexTypeOfType(this, IndexKind.Number);
    }

    getBaseTypes(): BaseType[] | undefined {
        return this.isClassOrInterface() ? this.checker.getBaseTypes(this) : undefined;
    }

    isNullableType(): boolean {
        return this.checker.isNullableType(this);
    }

    getNonNullableType(): Type {
        return this.checker.getNonNullableType(this);
    }

    getNonOptionalType(): Type {
        return this.checker.getNonOptionalType(this);
    }

    getConstraint(): Type | undefined {
        return this.checker.getBaseConstraintOfType(this);
    }

    getDefault(): Type | undefined {
        return this.checker.getDefaultFromTypeParameter(this);
    }

    isUnion(): this is UnionType {
        return !!(this.flags & TypeFlags.Union);
    }

    isIntersection(): this is IntersectionType {
        return !!(this.flags & TypeFlags.Intersection);
    }

    isUnionOrIntersection(): this is UnionOrIntersectionType {
        return !!(this.flags & TypeFlags.UnionOrIntersection);
    }

    isLiteral(): this is LiteralType {
        return !!(this.flags & (TypeFlags.StringLiteral | TypeFlags.NumberLiteral | TypeFlags.BigIntLiteral));
    }

    isStringLiteral(): this is StringLiteralType {
        return !!(this.flags & TypeFlags.StringLiteral);
    }

    isNumberLiteral(): this is NumberLiteralType {
        return !!(this.flags & TypeFlags.NumberLiteral);
    }

    isTypeParameter(): this is TypeParameter {
        return !!(this.flags & TypeFlags.TypeParameter);
    }

    isClassOrInterface(): this is InterfaceType {
        return !!(getObjectFlags(this) & ObjectFlags.ClassOrInterface);
    }

    isClass(): this is InterfaceType {
        return !!(getObjectFlags(this) & ObjectFlags.Class);
    }

    isIndexType(): this is IndexType {
        return isIndexType(this);
    }

    /**
     * This polyfills `referenceType.typeArguments` for API consumers
     */
    get typeArguments() {
        if (getObjectFlags(this) & ObjectFlags.Reference) {
            return this.checker.getTypeArguments(this as Type as TypeReference);
        }
        return undefined;
    }
}

/** @internal */
export class SignatureObject implements Signature {
    flags: SignatureFlags;
    checker: TypeChecker;

    // TODO: Review for polymorphism:
    declare declaration?: JSDocSignature | SignatureDeclaration;
    declare typeParameters?: readonly TypeParameter[];
    declare parameters: readonly Symbol[];
    declare thisParameter?: Symbol;
    declare resolvedReturnType?: Type;
    declare resolvedTypePredicate?: TypePredicate;
    // TODO: Could we combine `minArgumentCount` and `resolvedMinArgumentCount` as two int16 values? How much slower
    //       would getters/setters be for these?
    declare minArgumentCount: number;
    declare resolvedMinArgumentCount?: number;
    declare target?: Signature;
    declare mapper?: TypeMapper;
    declare compositeSignatures?: Signature[];
    declare compositeKind?: TypeFlags;
    declare erasedSignatureCache?: Signature;
    declare canonicalSignatureCache?: Signature;
    declare baseSignatureCache?: Signature;
    declare optionalCallSignatureCache?: { inner?: Signature; outer?: Signature; };
    declare isolatedSignatureType?: ObjectType;
    declare instantiations?: Map<string, Signature>;

    // TODO: Added by services, review for migration/polymorhpism:
    // documentationComment?: SymbolDisplayPart[];
    // jsDocTags?: JSDocTagInfo[]; // same

    constructor(checker: TypeChecker, flags: SignatureFlags) {
        this.flags = flags;
        this.checker = checker;
    }

    getDeclaration(): JSDocSignature | SignatureDeclaration {
        return this.declaration ?? Debug.fail();
    }

    getTypeParameters(): readonly TypeParameter[] | undefined {
        return this.typeParameters;
    }

    getParameters(): readonly Symbol[] {
        return this.parameters;
    }

    getReturnType(): Type {
        return this.checker.getReturnTypeOfSignature(this);
    }

    getTypeParameterAtPosition(pos: number): Type {
        const type = this.checker.getParameterType(this, pos);
        if (isIndexType(type) && isThisTypeParameter(type.type)) {
            const constraint = type.type.checker.getBaseConstraintOfType(type.type);
            if (constraint) {
                return this.checker.getIndexType(constraint);
            }
        }
        return type;
    }

    getDocumentationComment(): SymbolDisplayPart[] {
        return SignatureObjectInternals.internals.getDocumentationComment(this);
    }

    getJsDocTags(): JSDocTagInfo[] {
        return SignatureObjectInternals.internals.getJsDocTags(this);
    }
}

/** @internal */
export class SourceMapSourceObject implements SourceMapSource {
    fileName: string;
    text: string;
    skipTrivia: (pos: number) => number;

    // TODO: Review for polymorphism:
    declare lineMap: readonly number[];

    constructor(fileName: string, text: string, skipTrivia: (pos: number) => number = identity) {
        this.fileName = fileName;
        this.text = text;
        this.skipTrivia = skipTrivia;
    }

    public getLineAndCharacterOfPosition(pos: number): LineAndCharacter {
        return getLineAndCharacterOfPosition(this, pos);
    }
}

function isIndexType(type: Type): type is IndexType {
    return !!(type.flags & TypeFlags.Index);
}
