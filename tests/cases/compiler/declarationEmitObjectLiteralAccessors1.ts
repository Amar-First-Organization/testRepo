// @strict: true
// @declaration: true
// @emitDeclarationOnly: true
// @isolatedDeclarationFixedDiffReason: TS merges accessors with the same type. DTE can only merge if one type is specified.
// @isolatedDeclarationDiffReason: TS merges accessors with the same type. DTE can only merge if one type is specified.

// same type accessors
export const obj1 = {
  /** my awesome getter (first in source order) */
  get x(): string {
    return "";
  },
  /** my awesome setter (second in source order) */
  set x(a: string) {},
};

// divergent accessors
export const obj2 = {
  /** my awesome getter */
  get x(): string {
    return "";
  },
  /** my awesome setter */
  set x(a: number) {},
};

export const obj3 = {
  /** my awesome getter */
  get x(): string {
    return "";
  },
};

export const obj4 = {
  /** my awesome setter */
  set x(a: number) {},
};
