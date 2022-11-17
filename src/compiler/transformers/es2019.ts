import {
    Bundle,
    CatchClause,
    Node,
    SourceFile,
    SyntaxKind,
    TransformFlags,
    TransformationContext,
    VisitResult,
    chainBundle,
    isBlock,
    visitEachChild,
    visitNode,
} from "../_namespaces/ts";

/** @internal */
export function transformES2019(context: TransformationContext): (x: SourceFile | Bundle) => SourceFile | Bundle {
    const factory = context.factory;
    return chainBundle(context, transformSourceFile);

    function transformSourceFile(node: SourceFile) {
        if (node.isDeclarationFile) {
            return node;
        }

        return visitEachChild(node, visitor, context);
    }

    function visitor(node: Node): VisitResult<Node> {
        if ((node.transformFlags & TransformFlags.ContainsES2019) === 0) {
            return node;
        }
        switch (node.kind) {
            case SyntaxKind.CatchClause:
                return visitCatchClause(node as CatchClause);
            default:
                return visitEachChild(node, visitor, context);
        }
    }

    function visitCatchClause(node: CatchClause): CatchClause {
        if (!node.variableDeclaration) {
            return factory.updateCatchClause(
                node,
                factory.createVariableDeclaration(factory.createTempVariable(/*recordTempVariable*/ undefined)),
                visitNode(node.block, visitor, isBlock)
            );
        }
        return visitEachChild(node, visitor, context);
    }
}
