/*@internal*/
namespace ts {
    export function transformDoExpression(context: TransformationContext, node: SourceFile) {
        const { factory } = context;
        //#region contexts
        const enum ControlFlow {
            Return, Break, Continue,
        }
        interface ReturnContext {
            type: ControlFlow.Return
            signal?: [signal: Identifier, returnValue: Identifier]
        }
        type Label = Identifier | undefined;
        interface BreakContinueContext {
            type: ControlFlow.Break | ControlFlow.Continue
            signal?: Identifier
            label: Label
            // For IterationStatement and Switch, it's true; For LabelledStatement, it's false;
            allowAmbientBreak: boolean
            parent: BreakContinueContext | undefined
        }
        interface DoExpressionContext {
            completionValue: Identifier
            isAsync: boolean
            hasAwait: boolean
            hasYield: boolean
            shouldTrack: boolean
            remapExpression: ESMap<string, [Identifier, Expression]>
        }
        let currentReturnContext: ReturnContext | undefined;
        let currentBreakContext: BreakContinueContext | undefined;
        let currentContinueContext: BreakContinueContext | undefined;
        let currentDoContext: DoExpressionContext | undefined;
        function startControlFlowContext<T>(f: () => T) {
            const old = [currentReturnContext, currentBreakContext, currentContinueContext, currentDoContext] as const;
            currentReturnContext = currentBreakContext = currentContinueContext = currentDoContext = undefined;
            const result = f();
            [currentReturnContext, currentBreakContext, currentContinueContext, currentDoContext] = old;
            return result;
        }
        function startBreakContext<T>(label: Label, allowAmbientBreak: boolean, f: () => T) {
            const parent = currentBreakContext;
            currentBreakContext = { type: ControlFlow.Break, allowAmbientBreak, label, parent, signal: undefined };
            const result = f();
            currentBreakContext = parent;
            return result;
        }
        function startContinueContext<T>(label: Label, f: () => T) {
            const parent = currentContinueContext;
            currentContinueContext = { type: ControlFlow.Continue, allowAmbientBreak: true, label, parent, signal: undefined };
            const result = f();
            currentContinueContext = parent;
            return result;
        }
        function startIterationContext<T>(label: Label, f: () => T) {
            return startBreakContext(label, /* allowAmbientBreak */ true, () => startContinueContext(label, f));
        }
        function hasSignal(context: undefined | BreakContinueContext) {
            while (context) {
                if (context.signal) return true;
                context = context.parent;
            }
            return false;
        }
        function getSignals(context: undefined | BreakContinueContext) {
            const signals: Identifier[] = [];
            while (context) {
                if (context.signal) signals.push(context.signal);
                context = context.parent;
            }
            return signals;
        }
        //#endregion
        return visitSourceFile(node);

        function visitSourceFile(node: SourceFile) {
            if (node.isDeclarationFile) return node;
            if ((node.transformFlags & TransformFlags.ContainsESNext) === 0) {
                return node;
            }
            return visitEachChild(node, visitor, context);
        }

        function visitor(node: Expression): Expression;
        function visitor(node: Statement): Statement;
        function visitor(node: ConciseBody): ConciseBody;
        function visitor(node: Node): VisitResult<Node>;
        function visitor(node: Node): VisitResult<Node> {
            if (isFunctionLikeDeclaration(node)) return visitFunctionLikeDeclaration(node);
            if (isIterationStatement(node, /** lookInLabeledStatements */ false)) return visitIterationStatement(node);
            if (isClassLike(node)) return visitClassLike(node);

            if (isSuperProperty(node)) return visitSuperPropertyExpression(node);

            switch (node.kind) {
                // No need to handle new.target.
                // Because ~Yield DoExpression will be transformed into ArrowFunction which is transparent to the new.target.
                // And +Yield DoExpression requires a Yield context, meanwhile generator function is invalid target of new.target.

                // Same for super() call.
                case SyntaxKind.CallExpression:
                    return visitCallExpression(node as CallExpression);
                case SyntaxKind.DoExpression:
                    return visitDoExpression(node as DoExpression);
                case SyntaxKind.LabeledStatement:
                    return visitLabelledStatement(node as LabeledStatement);
                case SyntaxKind.TryStatement:
                    return visitTryStatement(node as TryStatement);
                case SyntaxKind.CatchClause:
                    return visitCatchClause(node as CatchClause);
                case SyntaxKind.ExpressionStatement:
                    return visitExpressionStatement(node as ExpressionStatement);
                case SyntaxKind.Block:
                    return visitBlock(node as Block, /** directChildOfDoExpr */ false);
                case SyntaxKind.SwitchStatement:
                    return visitSwitch(node as SwitchStatement);
                case SyntaxKind.Identifier:
                    return visitIdentifier(node as Identifier);
                case SyntaxKind.ReturnStatement:
                case SyntaxKind.BreakStatement:
                case SyntaxKind.ContinueStatement:
                    return visitControlFlow(node as ReturnStatement | BreakStatement | ContinueStatement);
                default:
                    return visitEachChild(node, visitor, context);
            }
        }
        function visitFunctionLikeDeclaration<T extends FunctionLikeDeclaration>(node: T): Node {
            return startControlFlowContext(() => {
                currentReturnContext = { type: ControlFlow.Return, signal: undefined };
                return visitEachChild(node, child => {
                    if (child === node.body) {
                        return visitBody(node.body);
                    }
                    return visitor(child);
                }, context);
            });
            function visitBody(child: ConciseBody): ConciseBody {
                let nextBody = visitor(child);
                if (currentReturnContext?.signal) {
                    const { signal: [currentSignal, operand] } = currentReturnContext;
                    // to code: if (signal == currentReturnContext.signal) return operand
                    nextBody = wrapBlockToHandleSignal(nextBody, [currentReturnContext], (possibleSignal) => [
                        factory.createIfStatement(
                            factory.createEquality(possibleSignal, currentSignal),
                            factory.createReturnStatement(operand),
                        )
                    ]);
                }
                return nextBody;
            }
        }
        function visitIterationStatement<T extends IterationStatement>(node: T): Node {
            const label = node.parent && isLabeledStatement(node.parent) ? node.parent.label : undefined;
            return startIterationContext(label, () => {
                return visitEachChild(node, child => {
                    if (child === node.statement) return visitStatement(node.statement);
                    return visitor(child);
                }, context);
            });
            function visitStatement(node: Statement) {
                let nextNode = visitor(node);
                const controlFlow = [currentBreakContext, currentContinueContext].filter(nonNullable).filter(x => x.signal);
                if (controlFlow.length){
                    nextNode = wrapBlockToHandleSignal(isBlock(nextNode) ? nextNode : factory.createBlock([nextNode]), controlFlow, createSignalHandler);
                }
                return nextNode;
            }
            // if (signal === currentContinueContext.signal) continue currentContinueContext.label;
            function createSignalHandler(signal: Identifier): readonly Statement[] {
                const result: Statement[] = [];
                if (currentBreakContext?.signal) {
                    result.push(factory.createIfStatement(
                        factory.createEquality(signal, currentBreakContext.signal),
                        factory.createBreakStatement(),
                    ));
                }
                if (currentContinueContext?.signal) {
                    result.push(factory.createIfStatement(
                        factory.createEquality(signal, currentContinueContext.signal),
                        factory.createContinueStatement(),
                    ));
                }
                return result;
            }
        }
        function visitClassLike<T extends ClassExpression | ClassDeclaration>(node: T): T {
            return startControlFlowContext(() => visitEachChild(node, visitor, context));
        }
        function visitLabelledStatement(node: LabeledStatement): Node {
            // why it will be undefined?
            if (!node.statement) return visitEachChild(node, visitor, context);
            if (isIterationStatement(node.statement, /** lookInLabeledStatements */ false)) return visitEachChild(node, visitor, context);
            return startBreakContext(node.label, /** allowAmbientBreak */ false, () => visitEachChild(node, child => {
                if (child === node.statement) {
                    let nextChild = visitor(node.statement);
                    const signal = currentBreakContext?.signal;
                    if (signal) {
                        if (!isStatement(nextChild)) Debug.fail();
                        nextChild = wrapBlockToHandleSignal(isBlock(nextChild) ? nextChild : factory.createBlock([nextChild]), [currentBreakContext!], signal => [
                            factory.createIfStatement(
                                factory.createEquality(signal, signal),
                                factory.createBreakStatement(currentBreakContext!.label),
                            )
                        ]);
                    }
                    return nextChild;
                }
                return visitor(child);
            }, context));
        }
        /**
         * To avoid the return/continue/break signal being caught by the user
         *
         * ```js
         * catch(e) { Block }
         * ```
         *
         * into
         *
         * ```js
         * catch(_a) {
         *     if (_a == signal) throw _a
         *     var e = _a
         *     Block
         * }
         * ```
         */
        function visitCatchClause(node: CatchClause): CatchClause {
            if (!currentReturnContext?.signal && !hasSignal(currentBreakContext) && !hasSignal(currentContinueContext)) return visitEachChild(node, visitor, context);
            node = visitEachChild(node, visitor, context);

            const catch_e = factory.createTempVariable(noop);
            const newStatements = [...node.block.statements];

            const signals = getSignals(currentBreakContext).concat(getSignals(currentContinueContext));
            if (currentReturnContext?.signal) signals.push(currentReturnContext.signal[0]);

            const oldCatch_e = node.variableDeclaration;
            if (oldCatch_e) {
                // catch(e = 1) is syntax error. no need to worry the original initializer
                const decl = factory.updateVariableDeclaration(oldCatch_e, oldCatch_e.name, oldCatch_e.exclamationToken, oldCatch_e.type, catch_e);
                newStatements.unshift(
                    factory.createVariableStatement(/** modifiers */ undefined, factory.createVariableDeclarationList([decl]))
                );
            }
            forEach(signals, signal => {
                newStatements.unshift(factory.createIfStatement(factory.createEquality(catch_e, signal), factory.createThrowStatement(catch_e)));
            });
            return factory.updateCatchClause(node, factory.createVariableDeclaration(catch_e), factory.updateBlock(node.block, newStatements));
        }
        function visitTryStatement(node: TryStatement): TryStatement {
            if (!currentDoContext) return visitEachChild(node, visitor, context);
            return visitEachChild(node, child => {
                if (child === node.finallyBlock) {
                    const old = currentDoContext!.shouldTrack;
                    currentDoContext!.shouldTrack = false;
                    const result = visitor(child);
                    currentDoContext!.shouldTrack = old;
                    return result;
                }
                return visitor(child);
            }, context);
        }
        function visitSwitch(node: SwitchStatement): SwitchStatement {
            // TODO:
            return visitEachChild(node, visitor, context);
        }

        /**
         * Turn "return val" into "throw ((operand = val), signal)"
         */
        function visitControlFlow(node: ReturnStatement | ContinueStatement | BreakStatement) {
            if (!currentDoContext || currentDoContext.isAsync) return visitEachChild(node, visitor, context);
            if (isReturnStatement(node)) {
                if (!currentReturnContext) return visitEachChild(node, visitor, context);
                const [signal, returnValue] = currentReturnContext.signal ??= [createReservedInNestedScopeTempVariable(), createReservedInNestedScopeTempVariable()];
                const setReturnValue = node.expression && factory.createBinaryExpression(returnValue, factory.createToken(SyntaxKind.EqualsToken), visitor(node.expression));
                return factory.createThrowStatement(setReturnValue ? factory.createCommaListExpression([setReturnValue, signal]) : signal);
            }
            else {
                if (
                    (node.kind === SyntaxKind.BreakStatement && !currentBreakContext)
                    || (node.kind === SyntaxKind.ContinueStatement && !currentContinueContext)
                ) return visitEachChild(node, visitor, context);
                const findJumpContext = (label: Identifier | undefined, context: BreakContinueContext | undefined) => {
                    while (context) {
                        if (!label && context.allowAmbientBreak && node.kind === SyntaxKind.BreakStatement) return context;
                        if (label?.escapedText === context.label?.escapedText) return context;
                        context = context.parent;
                    }
                    return undefined;
                };
                const jump = findJumpContext(node.label, node.kind === SyntaxKind.BreakStatement ? currentBreakContext : currentContinueContext);
                if (!jump) return visitEachChild(node, visitor, context);
                return factory.createThrowStatement(jump.signal ??= createReservedInNestedScopeTempVariable());
            }
        }

        function visitDoExpression(node: DoExpression) {
            const hasAwait = Boolean(node.transformFlags & TransformFlags.ContainsAwait);
            const hasYield = Boolean(node.transformFlags & TransformFlags.ContainsYield);
            const oldContext = currentDoContext;
            const localContext: DoExpressionContext = currentDoContext = {
                completionValue: createReservedInNestedScopeTempVariable(context.hoistVariableDeclaration),
                isAsync: node.async,
                hasAwait,
                hasYield,
                shouldTrack: false,
                remapExpression: new Map(),
            };
            const nextBlock = visitBlock(node.block, /** directChildOfDoExpr */ true);
            localContext.remapExpression.forEach(([temp, init]) => {
                context.hoistVariableDeclaration(temp);
                context.addInitializationStatement(factory.createExpressionStatement(factory.createAssignment(temp, init)));
            });
            currentDoContext = oldContext;
            if (node.async) return createAsyncDoExpressionExecutor(nextBlock, localContext.completionValue);
            return createDoExpressionExecutor(nextBlock, localContext.completionValue, hasAwait, hasYield);
        }

        function visitExpressionStatement(node: ExpressionStatement) {
            const result = visitEachChild(node, visitor, context);
            if (!currentDoContext?.shouldTrack) return result;
            return factory.updateExpressionStatement(result, factory.createAssignment(currentDoContext.completionValue, result.expression));
        }
        function visitBlock(node: Block, directChildOfDoExpr: boolean) {
            if (!currentDoContext) return visitEachChild(node, visitor, context);
            const lastMeaningfulNode = findLast(node.statements, (node) =>
                node.kind === SyntaxKind.ExpressionStatement ||
                node.kind === SyntaxKind.Block ||
                node.kind === SyntaxKind.IfStatement ||
                node.kind === SyntaxKind.SwitchStatement ||
                // TODO: ban with
                node.kind === SyntaxKind.WithStatement ||
                (isLabeledStatement(node) && !isIterationStatement(node.statement, /** lookInLabeledStatements */ true)) ||
                node.kind === SyntaxKind.TryStatement
            );
            const shouldTrackOld = currentDoContext.shouldTrack;
            const shouldTrack = shouldTrackOld || directChildOfDoExpr;
            return visitEachChild(node, child => {
                const isDirectChild = node.statements.includes(child as Statement);
                if (!shouldTrack || !isDirectChild) return visitor(child);
                currentDoContext!.shouldTrack = child === lastMeaningfulNode;
                const result = visitor(child);
                currentDoContext!.shouldTrack = shouldTrackOld;
                return result;
            }, context);
        }

        function visitIdentifier(node: Identifier) {
            if (!currentDoContext?.hasYield) return node;
            if (context.getEmitResolver().isArgumentsLocalBinding(node)) {
                const ARG = "arguments";
                return remapExpression(currentDoContext.remapExpression, ARG, () => node, id => id);
            }
            return node;
        }
        function visitSuperPropertyExpression(node: SuperProperty) {
            if (!currentDoContext?.hasYield) return visitEachChild(node, visitor, context);
            if (isElementAccessExpression(node)) {
                return remapExpression(currentDoContext.remapExpression, "super_dynamic", () => {
                    const param0 = factory.createTempVariable(noop);
                    // (_a) => super[_a]
                    return factory.createArrowFunction(
                        /** modifiers */ undefined,
                        /** generics */ undefined,
                        [
                            factory.createParameterDeclaration(
                                /** decorators */ undefined,
                                /** modifiers */ undefined,
                                /** ... */ undefined,
                                param0
                            )
                        ],
                        /** type */ undefined,
                        factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                        factory.createElementAccessExpression(factory.createSuper(), param0)
                    );
                }, delegate => createCall(delegate, [visitEachChild(node.argumentExpression, visitor, context)]));
            }
            else {
                return remapExpression(
                    currentDoContext.remapExpression,
                    "super." + node.name.escapedText,
                    // () => super.prop
                    () => createFunctionExpression(node, /** async */ false, /** yield */ false),
                    prop => createCall(prop, []));

            };
        }
        function visitCallExpression(node: CallExpression) {
            if (!currentDoContext?.hasYield) return visitEachChild(node, visitor, context);
            const inner = skipParentheses(node.expression);
            if (isSuperProperty(inner)) {
                const rest = factory.createTempVariable(noop);
                if (isElementAccessExpression(inner)) {
                    return remapExpression(currentDoContext.remapExpression, "super_dynamic_call", () => {
                        const param0 = createReservedInNestedScopeTempVariable();
                        // (_a) => (...arg) => super[_a](...args)
                        return factory.createArrowFunction(
                            /** modifiers */ undefined,
                            /** generics */ undefined,
                            [
                                factory.createParameterDeclaration(
                                    /** decorators */ undefined,
                                    /** modifiers */ undefined,
                                    /** ... */ undefined,
                                    param0
                                )
                            ],
                            /** type */ undefined,
                            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                            factory.createArrowFunction(
                                /** modifiers */ undefined,
                                /** generics */ undefined,
                                [
                                    factory.createParameterDeclaration(
                                        /** decorators */ undefined,
                                        /** modifiers */ undefined,
                                        /** ... */ factory.createToken(SyntaxKind.DotDotDotToken),
                                        rest
                                    )
                                ],
                                /** type */ undefined,
                                factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                                createCall(
                                    factory.createElementAccessExpression(factory.createSuper(), param0),
                                    [factory.createSpreadElement(rest)],
                                )
                            )
                        );
                        // _a(dynamicAccessExpr)(...call)
                    }, delegate => createCall(createCall(delegate, [visitEachChild(inner.argumentExpression, visitor, context)]), node.arguments));
                }
                else {
                    return remapExpression(
                        currentDoContext.remapExpression,
                        "super_call." + inner.name.escapedText,
                        // (...args) => super.prop(...args)
                        () => factory.createArrowFunction(
                            /** modifiers */ undefined,
                            /** generics */ undefined,
                            [
                                factory.createParameterDeclaration(
                                    /** decorators */ undefined,
                                    /** modifiers */ undefined,
                                    /** ... */ factory.createToken(SyntaxKind.DotDotDotToken),
                                    rest
                                )
                            ],
                            /** type */ undefined,
                            factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                            createCall(inner, [factory.createSpreadElement(rest)])
                        ),
                        prop => createCall(prop, node.arguments));
                };
            }
            return visitEachChild(node, visitor, context);
        }

        /**
         * ```js
         * { Block }
         * ```
         *
         * ==== transformed to ====
         *
         * ```js
         * {
         *  var signal = {}, operand
         *  try { Block }
         *  catch(e) {
         *      if (e === signal) return operand
         *      throw e
         *  }
         * }
         * ```
         */
        function wrapBlockToHandleSignal(node: ConciseBody, hoists: (ReturnContext | BreakContinueContext)[], handler: (signal: Identifier) => readonly Statement[]) {
            const catch_e = factory.createTempVariable(noop);
            return factory.createBlock([
                // var signal = {}, operand
                factory.createVariableStatement(/** modifiers */ undefined, factory.createVariableDeclarationList(
                    flatMap(hoists, x => {
                        if (!x.signal) Debug.fail();
                        const signal = factory.createVariableDeclaration(x.type === ControlFlow.Return ? x.signal[0] : x.signal, /** ! */ undefined, /** type */ undefined, factory.createObjectLiteralExpression());
                        if (x.type === ControlFlow.Return) {
                            return [signal, factory.createVariableDeclaration(x.signal[1])];
                        }
                        else {
                            return [signal];
                        }
                    })
                )),
                factory.createTryStatement(
                    factory.converters.convertToFunctionBlock(node),
                    factory.createCatchClause(factory.createVariableDeclaration(catch_e), factory.createBlock([
                        ...handler(catch_e),
                        factory.createThrowStatement(catch_e),
                    ])),
                    /** finallyBlock */ undefined
                )
            ]);
        }

        /**
         * Try to generate arrow function if possible.
         */
        function createFunctionExpression(block: ConciseBody, hasAsync: boolean, hasYield: boolean) {
            const modifiers = hasAsync ? [factory.createModifier(SyntaxKind.AsyncKeyword)] : undefined;
            if (!hasYield) {
                return factory.createArrowFunction(
                    modifiers,
                    /** generics */ undefined, [],
                    /** type */ undefined,
                    factory.createToken(SyntaxKind.EqualsGreaterThanToken),
                    block
                );
            }
            return factory.createFunctionExpression(
                modifiers,
                hasYield ? factory.createToken(SyntaxKind.AsteriskToken) : undefined,
                /* name */ undefined, /* typeParam */ undefined, /** param */[], /** type */ undefined,
                isBlock(block) ? block : factory.createBlock([factory.createReturnStatement(block)])
            );
        }
        /**
         * For async do expression, we generate code like this:
         * ```js
         * (() => { Block })(), _completion_value_container_
         * ```
         */
        function createDoExpressionExecutor(body: ConciseBody, completionValueContainer: Identifier, hasAsync: boolean, hasYield: boolean) {
            const f = createFunctionExpression(body, hasAsync, hasYield);
            // yield* expr.call(this)
            if (hasYield) {
                return factory.createCommaListExpression([
                    factory.createYieldExpression(
                        factory.createToken(SyntaxKind.AsteriskToken),
                        createCall(factory.createPropertyAccessExpression(f, "call"), [factory.createThis()])
                    ),
                    completionValueContainer
                ]);
            }
            // await expr()
            if (hasAsync) return factory.createCommaListExpression([factory.createAwaitExpression(createCall(f, [])), completionValueContainer]);
            // expr()
            return factory.createCommaListExpression([createCall(f, []), completionValueContainer]);
        }
        /**
         * For async do expression, we generate code like this:
         * ```js
         * (async () => { _block })().then(() => _completion_value_container_)
         * ```
         */
        function createAsyncDoExpressionExecutor(block: Block, completionValueContainer: Identifier) {
            const f = createFunctionExpression(block, /** await */ true, /** yield */ false);
            const invoke = createCall(f, []);
            const then = factory.createPropertyAccessExpression(invoke, "then");
            const thenBody = createFunctionExpression(completionValueContainer, /** await */ false, /** yield */ false);
            return createCall(then, [thenBody]);
        }
        function createCall(expr: Expression, args: Expression[] | NodeArray<Expression>) {
            return factory.createCallExpression(expr, /** generics */ undefined, args);
        }
        function createReservedInNestedScopeTempVariable(recordTempVariable: ((node: Identifier) => void) | undefined = noop) {
            return factory.createTempVariable(recordTempVariable, /** reservedInNestedScopes */ true);
        }
        function remapExpression<T>(map: DoExpressionContext["remapExpression"], key: string, init: (identifier: Identifier) => Expression, apply: (id: Identifier) => T) {
            if (map.has(key)) return apply(map.get(key)![0]);
            const temp = createReservedInNestedScopeTempVariable();
            const initExpr = init(temp);
            map.set(key, [temp, initExpr]);
            return apply(temp);
        }
    }
}
