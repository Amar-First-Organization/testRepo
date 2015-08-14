/// <reference path="checker.ts"/>

/* @internal */
namespace ts {
    interface NodeLinks {
        visibleChildren?: Node[];
        visited?: boolean;
        collected?: boolean;
        hasExportDeclarations?: boolean;
        errorReported?: boolean;
        isInternal?: boolean;
    }

    interface PreprocessResults {
        sourceFiles: SourceFile[];
        nodeLinks: NodeLinks[];
        resolver: EmitResolver;
    }

    const emptyHandler = () => { };

    function writeDeclarations(outputFileName: string, preprocessResults: PreprocessResults, host: EmitHost, diagnostics: Diagnostic[]): void {
        let newLine = host.getNewLine();
        let compilerOptions = host.getCompilerOptions();
        let enclosingDeclaration: Node;
        let currentSourceFile: SourceFile;

        let resolver = preprocessResults.resolver;
        let nodeLinks = preprocessResults.nodeLinks;

        // setup the writer
        let writer = createNewTextWriterWithSymbolWriter();
        let write = writer.write;
        let writeTextOfNode = writer.writeTextOfNode;
        let writeLine = writer.writeLine;
        let increaseIndent = writer.increaseIndent;
        let decreaseIndent = writer.decreaseIndent;

        // Emit any triple-slash references
        emitTripleSlashReferences(preprocessResults.sourceFiles);

        for (let sourceFile of preprocessResults.sourceFiles) {
            // emit the declarations from this file
            emitSourceFile(sourceFile);
        }

        // write the output to disk
        writeFile(host, diagnostics, outputFileName, writer.getText(), compilerOptions.emitBOM);

        return;

        function getNodeLinks(node: Node): NodeLinks {
            let nodeId = getNodeId(node);
            return nodeLinks[nodeId] || (nodeLinks[nodeId] = {});
        }

        function emitTripleSlashReferences(sourceFiles: SourceFile[]) {
            if (compilerOptions.noResolve) {
                // Nothing to do
                return;
            }

            let emittedReferencedFiles: SourceFile[] = [];
            let addedGlobalFileReference = false;

            // Emit references corresponding to this file
            for (let sourceFile of sourceFiles) {
                emitTripleSlashReferncesInFile(sourceFile);
            }

            return;

            function emitTripleSlashReferncesInFile(sourceFile: SourceFile): void {
                forEach(sourceFile.referencedFiles, fileReference => {
                    let referencedFile = tryResolveScriptReference(host, sourceFile, fileReference);

                    // Could not find the file, or has been already emitted
                    if (!referencedFile || contains(emittedReferencedFiles, referencedFile)) {
                        return false;
                    }

                    let shouldEmitRefrence: boolean

                    if (isDeclarationFile(referencedFile) || shouldEmitToOwnFile(referencedFile, compilerOptions)) {
                        // If the reference file is a declaration file or an external module,
                        // we know there is going to be a .d.ts file matching it. Emit that reference
                        shouldEmitRefrence = true;
                    }
                    else if (compilerOptions.out && !addedGlobalFileReference && isExternalModule(sourceFile)) {
                        // This is a reference to a file in the global island, since out is on, all files
                        // in the global island will be merged into one. so keep only one of these references
                        addedGlobalFileReference = true;
                        shouldEmitRefrence = true;
                    }

                    if (shouldEmitRefrence) {
                        emitReferencePath(referencedFile);
                        emittedReferencedFiles.push(referencedFile);
                    }
                });
            }

            function emitReferencePath(referencedFile: SourceFile) {
                let declFileName = referencedFile.flags & NodeFlags.DeclarationFile
                    ? referencedFile.fileName // Declaration file, use declaration file name
                    : shouldEmitToOwnFile(referencedFile, compilerOptions)
                        ? getOwnEmitOutputFilePath(referencedFile, host, ".d.ts") // Own output file so get the .d.ts file
                        : removeFileExtension(compilerOptions.out) + ".d.ts"; // Global out file

                declFileName = getRelativePathToDirectoryOrUrl(
                    getDirectoryPath(normalizeSlashes(outputFileName)),
                    declFileName,
                    host.getCurrentDirectory(),
                    host.getCanonicalFileName,
                    /*isAbsolutePathAnUrl*/ false);

                write(`/// <reference path="${ declFileName }" />`);
                writeLine();
            }
        }

        function createNewTextWriterWithSymbolWriter(): EmitTextWriter & SymbolWriter {
            let writer = <EmitTextWriter & SymbolWriter>createTextWriter(newLine);
            writer.writeKeyword = writer.write;
            writer.writeOperator = writer.write;
            writer.writePunctuation = writer.write;
            writer.writeSpace = writer.write;
            writer.writeStringLiteral = writer.writeLiteral;
            writer.writeParameter = writer.write;
            writer.writeSymbol = writer.write;
            return writer;
        }

        function emitTypeOfDeclaration(declaration: AccessorDeclaration | VariableLikeDeclaration, type: TypeNode) {
            write(": ");
            if (type) {
                // Write the type
                emitType(type);
            }
            else {
                resolver.writeTypeOfDeclaration(declaration, enclosingDeclaration, TypeFormatFlags.UseTypeOfFunction, writer);
            }
        }

        function emitReturnTypeAtSignature(signature: SignatureDeclaration) {
            write(": ");
            if (signature.type) {
                // Write the type
                emitType(signature.type);
            }
            else {
                resolver.writeReturnTypeOfSignatureDeclaration(signature, enclosingDeclaration, TypeFormatFlags.UseTypeOfFunction, writer);
            }
        }

        function emitSeparatedList(nodes: Node[], separator: string, eachNodeEmitFn: (node: Node) => void) {
            let currentWriterPos = writer.getTextPos();
            for (let node of nodes) {
                if (currentWriterPos !== writer.getTextPos()) {
                    write(separator);
                }
                currentWriterPos = writer.getTextPos();
                eachNodeEmitFn(node);
            }
        }

        function emitCommaList(nodes: Node[], eachNodeEmitFn: (node: Node) => void) {
            emitSeparatedList(nodes, ", ", eachNodeEmitFn);
        }

        function emitJsDocComments(declaration: Node) {
            if (!compilerOptions.removeComments) {
                if (declaration) {
                    let jsDocComments = getJsDocComments(declaration, currentSourceFile);
                    emitNewLineBeforeLeadingComments(currentSourceFile, writer, declaration, jsDocComments);
                    // jsDoc comments are emitted at /*leading comment1 */space/*leading comment*/space
                    emitComments(currentSourceFile, writer, jsDocComments, /*trailingSeparator*/ true, newLine, writeCommentRange);
                }
            }
        }

        function emitType(type: TypeNode | Identifier | QualifiedName) {
            switch (type.kind) {
                case SyntaxKind.AnyKeyword:
                case SyntaxKind.StringKeyword:
                case SyntaxKind.NumberKeyword:
                case SyntaxKind.BooleanKeyword:
                case SyntaxKind.SymbolKeyword:
                case SyntaxKind.VoidKeyword:
                case SyntaxKind.StringLiteral:
                    return writeTextOfNode(currentSourceFile, type);
                case SyntaxKind.ExpressionWithTypeArguments:
                    return emitExpressionWithTypeArguments(<ExpressionWithTypeArguments>type);
                case SyntaxKind.TypeReference:
                    return emitTypeReference(<TypeReferenceNode>type);
                case SyntaxKind.TypeQuery:
                    return emitTypeQuery(<TypeQueryNode>type);
                case SyntaxKind.ArrayType:
                    return emitArrayType(<ArrayTypeNode>type);
                case SyntaxKind.TupleType:
                    return emitTupleType(<TupleTypeNode>type);
                case SyntaxKind.UnionType:
                    return emitUnionType(<UnionTypeNode>type);
                case SyntaxKind.IntersectionType:
                    return emitIntersectionType(<IntersectionTypeNode>type);
                case SyntaxKind.ParenthesizedType:
                    return emitParenType(<ParenthesizedTypeNode>type);
                case SyntaxKind.FunctionType:
                case SyntaxKind.ConstructorType:
                    return emitSignatureDeclarationWithJsDocComments(<FunctionOrConstructorTypeNode>type);
                case SyntaxKind.TypeLiteral:
                    return emitTypeLiteral(<TypeLiteralNode>type);
                case SyntaxKind.Identifier:
                    return emitEntityName(<Identifier>type);
                case SyntaxKind.QualifiedName:
                    return emitEntityName(<QualifiedName>type);
                case SyntaxKind.TypePredicate:
                    return emitTypePredicate(<TypePredicateNode>type);
            }

            function writeEntityName(entityName: EntityName | Expression) {
                if (entityName.kind === SyntaxKind.Identifier) {
                    writeTextOfNode(currentSourceFile, entityName);
                }
                else {
                    let left = entityName.kind === SyntaxKind.QualifiedName ? (<QualifiedName>entityName).left : (<PropertyAccessExpression>entityName).expression;
                    let right = entityName.kind === SyntaxKind.QualifiedName ? (<QualifiedName>entityName).right : (<PropertyAccessExpression>entityName).name;
                    writeEntityName(left);
                    write(".");
                    writeTextOfNode(currentSourceFile, right);
                }
            }

            function emitEntityName(entityName: EntityName | Expression) {

                if (entityName.kind === SyntaxKind.Identifier) {
                    writeTextOfNode(currentSourceFile, entityName);
                }
                else {
                    let left = entityName.kind === SyntaxKind.QualifiedName ? (<QualifiedName>entityName).left : (<PropertyAccessExpression>entityName).expression;
                    let right = entityName.kind === SyntaxKind.QualifiedName ? (<QualifiedName>entityName).right : (<PropertyAccessExpression>entityName).name;
                    emitEntityName(left);
                    write(".");
                    writeTextOfNode(currentSourceFile, right);
                }
            }

            function emitExpressionWithTypeArguments(node: ExpressionWithTypeArguments) {
                if (isSupportedExpressionWithTypeArguments(node)) {
                    Debug.assert(node.expression.kind === SyntaxKind.Identifier || node.expression.kind === SyntaxKind.PropertyAccessExpression);
                    emitEntityName(<Identifier | PropertyAccessExpression>node.expression);
                    if (node.typeArguments) {
                        write("<");
                        emitCommaList(node.typeArguments, emitType);
                        write(">");
                    }
                }
            }

            function emitTypeReference(type: TypeReferenceNode) {
                emitEntityName(type.typeName);
                if (type.typeArguments) {
                    write("<");
                    emitCommaList(type.typeArguments, emitType);
                    write(">");
                }
            }

            function emitTypePredicate(type: TypePredicateNode) {
                writeTextOfNode(currentSourceFile, type.parameterName);
                write(" is ");
                emitType(type.type);
            }

            function emitTypeQuery(type: TypeQueryNode) {
                write("typeof ");
                emitEntityName(type.exprName);
            }

            function emitArrayType(type: ArrayTypeNode) {
                emitType(type.elementType);
                write("[]");
            }

            function emitTupleType(type: TupleTypeNode) {
                write("[");
                emitCommaList(type.elementTypes, emitType);
                write("]");
            }

            function emitUnionType(type: UnionTypeNode) {
                emitSeparatedList(type.types, " | ", emitType);
            }

            function emitIntersectionType(type: IntersectionTypeNode) {
                emitSeparatedList(type.types, " & ", emitType);
            }

            function emitParenType(type: ParenthesizedTypeNode) {
                write("(");
                emitType(type.type);
                write(")");
            }

            function emitTypeLiteral(type: TypeLiteralNode) {
                write("{");
                if (type.members.length) {
                    writeLine();
                    increaseIndent();
                    // write members
                    forEach(type.members, emitNode);
                    decreaseIndent();
                }
                write("}");
            }
        }
        
        // Return a temp variable name to be used in `export default` statements.
        // The temp name will be of the form _default_counter.
        // Note that export default is only allowed at most once in a module, so we
        // do not need to keep track of created temp names.
        function getExportDefaultTempVariableName(): string {
            let baseName = "_default";
            if (!hasProperty(currentSourceFile.identifiers, baseName)) {
                return baseName;
            }
            let count = 0;
            while (true) {
                let name = baseName + "_" + (++count);
                if (!hasProperty(currentSourceFile.identifiers, name)) {
                    return name;
                }
            }
        }

        function emitExportAssignment(node: ExportAssignment) {
            if (node.expression.kind === SyntaxKind.Identifier) {
                write(node.isExportEquals ? "export = " : "export default ");
                writeTextOfNode(currentSourceFile, node.expression);
            }
            else {
                // Expression
                let tempVarName = getExportDefaultTempVariableName();
                write("declare var ");
                write(tempVarName);
                write(": ");
                resolver.writeTypeOfExpression(node.expression, enclosingDeclaration, TypeFormatFlags.UseTypeOfFunction, writer);
                write(";");
                writeLine();
                write(node.isExportEquals ? "export = " : "export default ");
                write(tempVarName);
            }
            write(";");
            writeLine();
        }

        function emitModuleElementDeclarationFlags(node: Node) {
            // If the node is parented in the current source file we need to emit export declare or just export
            if (node.parent === currentSourceFile) {
                // If the node is exported
                if (node.flags & NodeFlags.Export) {
                    write("export ");
                }

                if (node.flags & NodeFlags.Default) {
                    write("default ");
                }
                else if (node.kind !== SyntaxKind.InterfaceDeclaration) {
                    write("declare ");
                }
            }
        }

        function emitClassMemberDeclarationFlags(node: Declaration) {
            if (node.flags & NodeFlags.Private) {
                write("private ");
            }
            else if (node.flags & NodeFlags.Protected) {
                write("protected ");
            }

            if (node.flags & NodeFlags.Static) {
                write("static ");
            }
            if (node.flags & NodeFlags.Abstract) {
                write("abstract ");
            }
        }

        function emitImportEqualsDeclaration(node: ImportEqualsDeclaration) {
            // note usage of writer. methods instead of aliases created, just to make sure we are using 
            // correct writer especially to handle asynchronous alias writing
            emitJsDocComments(node);
            if (node.flags & NodeFlags.Export) {
                write("export ");
            }
            write("import ");
            writeTextOfNode(currentSourceFile, node.name);
            write(" = ");
            if (isInternalModuleImportEqualsDeclaration(node)) {
                emitType(<EntityName>node.moduleReference);
                write(";");
            }
            else {
                write("require(");
                writeTextOfNode(currentSourceFile, getExternalModuleImportEqualsDeclarationExpression(node));
                write(");");
            }
            writer.writeLine();
        }

        function emitImportDeclaration(node: ImportDeclaration) {
            var children = sortDeclarations(getNodeLinks(node).visibleChildren);
            if (!children) {
                return;
            }

            emitJsDocComments(node);
            write("import ");


            let index: number;
            if ((index = indexOf(children, node.importClause)) === 0) {
                children.shift(); // remove it
                writeTextOfNode(currentSourceFile, node.importClause.name);
                if (children.length) {
                    // If the default binding was emitted, write the separated
                    write(", ");
                }
            }

            if (node.importClause.namedBindings) {
                if (node.importClause.namedBindings.kind === SyntaxKind.NamespaceImport &&
                    indexOf(children, node.importClause.namedBindings) >= 0) {
                    write("* as ");
                    writeTextOfNode(currentSourceFile, (<NamespaceImport>node.importClause.namedBindings).name);
                }
                else if (children.length) {
                    write("{ ");
                    emitCommaList(children, emitImportOrExportSpecifier);
                    write(" }");
                }
            }

            write(" from ");
            writeTextOfNode(currentSourceFile, node.moduleSpecifier);
            write(";");
            writer.writeLine();
        }

        function emitImportOrExportSpecifier(node: ImportOrExportSpecifier) {
            if (node.propertyName) {
                writeTextOfNode(currentSourceFile, node.propertyName);
                write(" as ");
            }
            writeTextOfNode(currentSourceFile, node.name);
        }

        function emitExportSpecifier(node: ExportSpecifier) {
            emitImportOrExportSpecifier(node);
        }

        function emitExportDeclaration(node: ExportDeclaration) {
            emitJsDocComments(node);
            write("export ");
            if (node.exportClause) {
                write("{ ");
                emitCommaList(node.exportClause.elements, emitExportSpecifier);
                write(" }");
            }
            else {
                write("*");
            }
            if (node.moduleSpecifier) {
                write(" from ");
                writeTextOfNode(currentSourceFile, node.moduleSpecifier);
            }
            write(";");
            writer.writeLine();
        }

        function emitModuleDeclaration(node: ModuleDeclaration) {
            emitJsDocComments(node);
            emitModuleElementDeclarationFlags(node);
            if (node.flags & NodeFlags.Namespace) {
                write("namespace ");
            }
            else {
                write("module ");
            }
            writeTextOfNode(currentSourceFile, node.name);
            while (node.body.kind !== SyntaxKind.ModuleBlock) {
                node = <ModuleDeclaration>node.body;
                write(".");
                writeTextOfNode(currentSourceFile, node.name);
            }
            let prevEnclosingDeclaration = enclosingDeclaration;
            enclosingDeclaration = node;
            write(" {");
            writeLine();
            increaseIndent();
            //emitLines((<ModuleBlock>node.body).statements);
            writeChildDeclarations(node);
            decreaseIndent();
            write("}");
            writeLine();
            enclosingDeclaration = prevEnclosingDeclaration;
        }

        function emitTypeAliasDeclaration(node: TypeAliasDeclaration) {
            let prevEnclosingDeclaration = enclosingDeclaration;
            enclosingDeclaration = node;
            emitJsDocComments(node);
            emitModuleElementDeclarationFlags(node);
            write("type ");
            writeTextOfNode(currentSourceFile, node.name);
            emitTypeParameters(node.typeParameters);
            write(" = ");
            emitType(node.type);
            write(";");
            writeLine();
            enclosingDeclaration = prevEnclosingDeclaration;
        }

        function emitEnumDeclaration(node: EnumDeclaration) {
            emitJsDocComments(node);
            emitModuleElementDeclarationFlags(node);
            if (isConst(node)) {
                write("const ");
            }
            write("enum ");
            writeTextOfNode(currentSourceFile, node.name);
            write(" {");
            writeLine();
            increaseIndent();
            //emitLines(node.members);
            writeChildDeclarations(node);
            decreaseIndent();
            write("}");
            writeLine();
        }

        function emitEnumMemberDeclaration(node: EnumMember) {
            emitJsDocComments(node);
            writeTextOfNode(currentSourceFile, node.name);
            let enumMemberValue = resolver.getConstantValue(node);
            if (enumMemberValue !== undefined) {
                write(" = ");
                write(enumMemberValue.toString());
            }
            write(",");
            writeLine();
        }

        function isPrivateMethodTypeParameter(node: TypeParameterDeclaration) {
            return node.parent.kind === SyntaxKind.MethodDeclaration && (node.parent.flags & NodeFlags.Private);
        }

        function emitTypeParameters(typeParameters: TypeParameterDeclaration[]) {
            function emitTypeParameter(node: TypeParameterDeclaration) {
                increaseIndent();
                emitJsDocComments(node);
                decreaseIndent();
                writeTextOfNode(currentSourceFile, node.name);
                // If there is constraint present and this is not a type parameter of the private method emit the constraint
                if (node.constraint && !isPrivateMethodTypeParameter(node)) {
                    write(" extends ");
                    emitType(node.constraint);
                }
            }

            if (typeParameters) {
                write("<");
                emitCommaList(typeParameters, emitTypeParameter);
                write(">");
            }
        }

        function emitHeritageClause(typeReferences: ExpressionWithTypeArguments[], isImplementsList: boolean) {
            if (typeReferences) {
                write(isImplementsList ? " implements " : " extends ");
                emitCommaList(typeReferences, emitTypeOfTypeReference);
            }

            function emitTypeOfTypeReference(node: ExpressionWithTypeArguments) {
                if (isSupportedExpressionWithTypeArguments(node)) {
                    emitType(node);
                }
                else {
                    resolver.writeBaseConstructorTypeOfClass(<ClassLikeDeclaration>enclosingDeclaration, enclosingDeclaration, TypeFormatFlags.UseTypeOfFunction, writer);
                }
            }
        }

        function emitClassDeclaration(node: ClassDeclaration) {
            function emitParameterProperties(constructorDeclaration: ConstructorDeclaration) {
                if (constructorDeclaration) {
                    forEach(constructorDeclaration.parameters, param => {
                        if (param.flags & NodeFlags.AccessibilityModifier) {
                            emitPropertyDeclaration(param);
                        }
                    });
                }
            }

            emitJsDocComments(node);
            emitModuleElementDeclarationFlags(node);
            if (node.flags & NodeFlags.Abstract) {
                write("abstract ");
            }

            write("class ");
            writeTextOfNode(currentSourceFile, node.name);
            let prevEnclosingDeclaration = enclosingDeclaration;
            enclosingDeclaration = node;
            emitTypeParameters(node.typeParameters);
            let baseTypeNode = getClassExtendsHeritageClauseElement(node);
            if (baseTypeNode) {
                emitHeritageClause([baseTypeNode], /*isImplementsList*/ false);
            }
            emitHeritageClause(getClassImplementsHeritageClauseElements(node), /*isImplementsList*/ true);
            write(" {");
            writeLine();
            increaseIndent();
            emitParameterProperties(getFirstConstructorWithBody(node));
            //emitLines(node.members);
            writeChildDeclarations(node);
            decreaseIndent();
            write("}");
            writeLine();
            enclosingDeclaration = prevEnclosingDeclaration;
        }

        function emitInterfaceDeclaration(node: InterfaceDeclaration) {
            emitJsDocComments(node);
            emitModuleElementDeclarationFlags(node);
            write("interface ");
            writeTextOfNode(currentSourceFile, node.name);
            let prevEnclosingDeclaration = enclosingDeclaration;
            enclosingDeclaration = node;
            emitTypeParameters(node.typeParameters);
            emitHeritageClause(getInterfaceBaseTypeNodes(node), /*isImplementsList*/ false);
            write(" {");
            writeLine();
            increaseIndent();
            //emitLines(node.members);
            writeChildDeclarations(node);
            decreaseIndent();
            write("}");
            writeLine();
            enclosingDeclaration = prevEnclosingDeclaration;
        }

        function emitPropertyDeclaration(node: Declaration) {
            if (hasDynamicName(node)) {
                return;
            }

            emitJsDocComments(node);
            emitClassMemberDeclarationFlags(node);
            emitVariableDeclaration(<VariableDeclaration>node);
            write(";");
            writeLine();
        }

        function emitVariableDeclaration(node: VariableDeclaration) {
            // If we are emitting property it isn't moduleElement and hence we already know it needs to be emitted
            // so there is no check needed to see if declaration is visible
            //if (node.kind !== SyntaxKind.VariableDeclaration) {
            if (isBindingPattern(node.name)) {
                emitBindingPattern(<BindingPattern>node.name);
            }
            else {
                // If this node is a computed name, it can only be a symbol, because we've already skipped
                // it if it's not a well known symbol. In that case, the text of the name will be exactly
                // what we want, namely the name expression enclosed in brackets.
                writeTextOfNode(currentSourceFile, node.name);
                // If optional property emit ?
                if ((node.kind === SyntaxKind.PropertyDeclaration || node.kind === SyntaxKind.PropertySignature) && hasQuestionToken(node)) {
                    write("?");
                }
                if ((node.kind === SyntaxKind.PropertyDeclaration || node.kind === SyntaxKind.PropertySignature) && node.parent.kind === SyntaxKind.TypeLiteral) {
                    emitTypeOfVariableDeclarationFromTypeLiteral(node);
                }
                else if (!(node.flags & NodeFlags.Private)) {
                    emitTypeOfDeclaration(node, node.type);
                }
            }
            //}

            function emitBindingPattern(bindingPattern: BindingPattern) {
                // Only select non-omitted expression from the bindingPattern's elements.
                // We have to do this to avoid emitting trailing commas.
                // For example:
                //      original: var [, c,,] = [ 2,3,4]
                //      emitted: declare var c: number; // instead of declare var c:number, ;
                let elements: Node[] = [];
                for (let element of bindingPattern.elements) {
                    if (element.kind !== SyntaxKind.OmittedExpression) {
                        elements.push(element);
                    }
                }
                emitCommaList(elements, emitBindingElement);
            }

            function emitBindingElement(bindingElement: BindingElement) {
                if (bindingElement.name) {
                    if (isBindingPattern(bindingElement.name)) {
                        emitBindingPattern(<BindingPattern>bindingElement.name);
                    }
                    else {
                        writeTextOfNode(currentSourceFile, bindingElement.name);
                        emitTypeOfDeclaration(bindingElement, /*type*/ undefined);
                    }
                }
            }
        }

        function emitTypeOfVariableDeclarationFromTypeLiteral(node: VariableLikeDeclaration) {
            // if this is property of type literal,
            // or is parameter of method/call/construct/index signature of type literal
            // emit only if type is specified
            if (node.type) {
                write(": ");
                emitType(node.type);
            }
        }

        function hasChildDeclaration(node: VariableStatement): boolean {
            return forEach(<VariableDeclaration[]>getNodeLinks(node).visibleChildren, child => {
                if (isBindingPattern(child.name)) {
                    return forEach((<BindingPattern>child.name).elements, e => {
                        return e.kind !== SyntaxKind.OmittedExpression;
                    });
                }
                return true;
            });
        }

        function emitVariableStatement(node: VariableStatement) {
            let children = sortDeclarations(getNodeLinks(node).visibleChildren);
            if (hasChildDeclaration(node)) {
                emitJsDocComments(node);
                emitModuleElementDeclarationFlags(node);
                if (isLet(node.declarationList)) {
                    write("let ");
                }
                else if (isConst(node.declarationList)) {
                    write("const ");
                }
                else {
                    write("var ");
                }
                emitCommaList(children, emitVariableDeclaration);
                write(";");
                writeLine();
            }
        }

        function emitAccessorDeclaration(node: AccessorDeclaration) {
            if (hasDynamicName(node)) {
                return;
            }

            let accessors = getAllAccessorDeclarations((<ClassDeclaration>node.parent).members, node);

            if (node === accessors.firstAccessor) {
                emitJsDocComments(accessors.getAccessor);
                emitJsDocComments(accessors.setAccessor);
                emitClassMemberDeclarationFlags(node);
                writeTextOfNode(currentSourceFile, node.name);
                if (!(node.flags & NodeFlags.Private)) {
                    let type = getTypeAnnotationFromAccessor(accessors.getAccessor, accessors.setAccessor);
                    emitTypeOfDeclaration(node, type);
                }
                write(";");
                writeLine();
            }
        }

        function emitFunctionDeclaration(node: FunctionLikeDeclaration) {
            if (hasDynamicName(node)) {
                return;
            }

            // If we are emitting Method/Constructor it isn't moduleElement and hence already determined to be emitting
            // so no need to verify if the declaration is visible
            if (!resolver.isImplementationOfOverload(node)) {
                emitJsDocComments(node);
                if (node.kind === SyntaxKind.FunctionDeclaration) {
                    emitModuleElementDeclarationFlags(node);
                }
                else if (node.kind === SyntaxKind.MethodDeclaration) {
                    emitClassMemberDeclarationFlags(node);
                }
                if (node.kind === SyntaxKind.FunctionDeclaration) {
                    write("function ");
                    writeTextOfNode(currentSourceFile, node.name);
                }
                else if (node.kind === SyntaxKind.Constructor) {
                    write("constructor");
                }
                else {
                    writeTextOfNode(currentSourceFile, node.name);
                    if (hasQuestionToken(node)) {
                        write("?");
                    }
                }
                emitSignatureDeclaration(node);
            }
        }

        function emitSignatureDeclarationWithJsDocComments(node: SignatureDeclaration) {
            emitJsDocComments(node);
            emitSignatureDeclaration(node);
        }

        function emitSignatureDeclaration(node: SignatureDeclaration) {
            // Construct signature or constructor type write new Signature
            if (node.kind === SyntaxKind.ConstructSignature || node.kind === SyntaxKind.ConstructorType) {
                write("new ");
            }
            emitTypeParameters(node.typeParameters);
            if (node.kind === SyntaxKind.IndexSignature) {
                write("[");
            }
            else {
                write("(");
            }

            let prevEnclosingDeclaration = enclosingDeclaration;
            enclosingDeclaration = node;

            // Parameters
            emitCommaList(node.parameters, emitParameterDeclaration);

            if (node.kind === SyntaxKind.IndexSignature) {
                write("]");
            }
            else {
                write(")");
            }

            // If this is not a constructor and is not private, emit the return type
            let isFunctionTypeOrConstructorType = node.kind === SyntaxKind.FunctionType || node.kind === SyntaxKind.ConstructorType;
            if (isFunctionTypeOrConstructorType || node.parent.kind === SyntaxKind.TypeLiteral) {
                // Emit type literal signature return type only if specified
                if (node.type) {
                    write(isFunctionTypeOrConstructorType ? " => " : ": ");
                    emitType(node.type);
                }
            }
            else if (node.kind !== SyntaxKind.Constructor && !(node.flags & NodeFlags.Private)) {
                emitReturnTypeAtSignature(node);
            }

            enclosingDeclaration = prevEnclosingDeclaration;

            if (!isFunctionTypeOrConstructorType) {
                write(";");
                writeLine();
            }
        }

        function emitParameterDeclaration(node: ParameterDeclaration) {
            increaseIndent();
            emitJsDocComments(node);
            if (node.dotDotDotToken) {
                write("...");
            }
            if (isBindingPattern(node.name)) {
                // For bindingPattern, we can't simply writeTextOfNode from the source file
                // because we want to omit the initializer and using writeTextOfNode will result in initializer get emitted.
                // Therefore, we will have to recursively emit each element in the bindingPattern.
                emitBindingPattern(<BindingPattern>node.name);
            }
            else {
                writeTextOfNode(currentSourceFile, node.name);
            }
            if (resolver.isOptionalParameter(node)) {
                write("?");
            }
            decreaseIndent();

            if (node.parent.kind === SyntaxKind.FunctionType ||
                node.parent.kind === SyntaxKind.ConstructorType ||
                node.parent.parent.kind === SyntaxKind.TypeLiteral) {
                emitTypeOfVariableDeclarationFromTypeLiteral(node);
            }
            else if (!(node.parent.flags & NodeFlags.Private)) {
                emitTypeOfDeclaration(node, node.type);
            }

            function emitBindingPattern(bindingPattern: BindingPattern) {
                // We have to explicitly emit square bracket and bracket because these tokens are not store inside the node.
                if (bindingPattern.kind === SyntaxKind.ObjectBindingPattern) {
                    write("{");
                    emitCommaList(bindingPattern.elements, emitBindingElement);
                    write("}");
                }
                else if (bindingPattern.kind === SyntaxKind.ArrayBindingPattern) {
                    write("[");
                    let elements = bindingPattern.elements;
                    emitCommaList(elements, emitBindingElement);
                    if (elements && elements.hasTrailingComma) {
                        write(", ");
                    }
                    write("]");
                }
            }

            function emitBindingElement(bindingElement: BindingElement) {
                if (bindingElement.kind === SyntaxKind.OmittedExpression) {
                    // If bindingElement is an omittedExpression (i.e. containing elision),
                    // we will emit blank space (although this may differ from users' original code,
                    // it allows emitSeparatedList to write separator appropriately)
                    // Example:
                    //      original: function foo([, x, ,]) {}
                    //      emit    : function foo([ , x,  , ]) {}
                    write(" ");
                }
                else if (bindingElement.kind === SyntaxKind.BindingElement) {
                    if (bindingElement.propertyName) {
                        // bindingElement has propertyName property in the following case:
                        //      { y: [a,b,c] ...} -> bindingPattern will have a property called propertyName for "y"
                        // We have to explicitly emit the propertyName before descending into its binding elements.
                        // Example:
                        //      original: function foo({y: [a,b,c]}) {}
                        //      emit    : declare function foo({y: [a, b, c]}: { y: [any, any, any] }) void;
                        writeTextOfNode(currentSourceFile, bindingElement.propertyName);
                        write(": ");
                    }
                    if (bindingElement.name) {
                        if (isBindingPattern(bindingElement.name)) {
                            // If it is a nested binding pattern, we will recursively descend into each element and emit each one separately.
                            // In the case of rest element, we will omit rest element.
                            // Example:
                            //      original: function foo([a, [[b]], c] = [1,[["string"]], 3]) {}
                            //      emit    : declare function foo([a, [[b]], c]: [number, [[string]], number]): void;
                            //      original with rest: function foo([a, ...c]) {}
                            //      emit              : declare function foo([a, ...c]): void;
                            emitBindingPattern(<BindingPattern>bindingElement.name);
                        }
                        else {
                            Debug.assert(bindingElement.name.kind === SyntaxKind.Identifier);
                            // If the node is just an identifier, we will simply emit the text associated with the node's name
                            // Example:
                            //      original: function foo({y = 10, x}) {}
                            //      emit    : declare function foo({y, x}: {number, any}): void;
                            if (bindingElement.dotDotDotToken) {
                                write("...");
                            }
                            writeTextOfNode(currentSourceFile, bindingElement.name);
                        }
                    }
                }
            }
        }

        function emitNode(node: Node) {
            switch (node.kind) {
                case SyntaxKind.FunctionDeclaration:
                    return emitFunctionDeclaration(<FunctionLikeDeclaration>node);
                case SyntaxKind.VariableStatement:
                    return emitVariableStatement(<VariableStatement>node);
                case SyntaxKind.InterfaceDeclaration:
                    return emitInterfaceDeclaration(<InterfaceDeclaration>node);
                case SyntaxKind.ClassDeclaration:
                    return emitClassDeclaration(<ClassDeclaration>node);
                case SyntaxKind.TypeAliasDeclaration:
                    return emitTypeAliasDeclaration(<TypeAliasDeclaration>node);
                case SyntaxKind.EnumDeclaration:
                    return emitEnumDeclaration(<EnumDeclaration>node);
                case SyntaxKind.ModuleDeclaration:
                    return emitModuleDeclaration(<ModuleDeclaration>node);
                case SyntaxKind.ImportEqualsDeclaration:
                    return emitImportEqualsDeclaration(<ImportEqualsDeclaration>node);
                case SyntaxKind.ImportDeclaration:
                    return emitImportDeclaration(<ImportDeclaration>node);
                case SyntaxKind.ExportDeclaration:
                    return emitExportDeclaration(<ExportDeclaration>node);
                case SyntaxKind.Constructor:
                case SyntaxKind.MethodDeclaration:
                case SyntaxKind.MethodSignature:
                    return emitFunctionDeclaration(<FunctionLikeDeclaration>node);
                case SyntaxKind.ConstructSignature:
                case SyntaxKind.CallSignature:
                case SyntaxKind.IndexSignature:
                    return emitSignatureDeclarationWithJsDocComments(<SignatureDeclaration>node);
                case SyntaxKind.GetAccessor:
                case SyntaxKind.SetAccessor:
                    return emitAccessorDeclaration(<AccessorDeclaration>node);
                case SyntaxKind.PropertyDeclaration:
                case SyntaxKind.PropertySignature:
                    return emitPropertyDeclaration(<PropertyDeclaration>node);
                case SyntaxKind.EnumMember:
                    return emitEnumMemberDeclaration(<EnumMember>node);
                case SyntaxKind.ExportAssignment:
                    return emitExportAssignment(<ExportAssignment>node);
                case SyntaxKind.SourceFile:
                    return emitSourceFile(<SourceFile>node);
                default:
                    Debug.fail(`unknown SyntaxKind: ${node.kind} (${ (<any>ts).SyntaxKind ? (<any>ts).SyntaxKind[node.kind] : ""})`);
            }
        }

        function writeChildDeclarations(node: Node): void {
            forEach(sortDeclarations(getNodeLinks(node).visibleChildren), emitNode);
        }

        function emitSourceFile(sourceFile: SourceFile): void {
            currentSourceFile = sourceFile;
            enclosingDeclaration = sourceFile;

            // write the declarations
            writeChildDeclarations(sourceFile);
        }

        function compareDeclarations(d1: Node, d2: Node): Comparison {
            return compareValues(d1.pos, d2.pos) || Comparison.EqualTo;
        }

        function sortDeclarations(nodes: Node[]): Node[] {
            return nodes && nodes.sort(compareDeclarations);
        }
    }

    function preprocessDeclarations(sourceFiles: SourceFile[], resolver: EmitResolver, diagnostics: Diagnostic[], compilerOptions: CompilerOptions): PreprocessResults {
        let currentSourceFile: SourceFile;
        let nodeLinks: NodeLinks[] = [];
        let declarationsToProcess: { declaration: Node; errorNode?: Node }[] = [];

        let typeWriter = createVoidSymbolWriter(undefined, undefined);

        for (let sourceFile of sourceFiles) {
            preprocessSourceFile(sourceFile);
        }

        return {
            sourceFiles,
            nodeLinks,
            resolver
        };

        function getNodeLinks(node: Node): NodeLinks {
            let nodeId = getNodeId(node);
            return nodeLinks[nodeId] || (nodeLinks[nodeId] = {});
        }

        function isInternal(node: Node): boolean {
            let links = getNodeLinks(node);
            if (links.isInternal === undefined) {
                let sourceText = getSourceFileOfNode(node).text;
                links.isInternal = forEach(getLeadingCommentRanges(sourceText, node.pos), range => {
                    let comment = sourceText.substring(range.pos, range.end);
                    return comment.indexOf("@internal") >= 0;
                });
            }
            return links.isInternal;
        }

        function createVoidSymbolWriter(trackTypeSymbol: (s: Symbol) => void, trackInaccesibleSymbol: (s: Symbol) => void): SymbolWriter {
            return {
                writeLine: emptyHandler,
                writeKeyword: emptyHandler,
                writeOperator: emptyHandler,
                writePunctuation: emptyHandler,
                writeSpace: emptyHandler,
                writeStringLiteral: emptyHandler,
                writeParameter: emptyHandler,
                writeSymbol: emptyHandler,
                decreaseIndent: emptyHandler,
                increaseIndent: emptyHandler,
                clear: emptyHandler,
                trackTypeSymbol,
                trackInaccesibleSymbol
            };
        }

        function collectReferencedDeclarations(node: Node): void {
            let currentErrorNode: Node;
            typeWriter.trackInaccesibleSymbol = trackInaccesibleSymbol;
            typeWriter.trackTypeSymbol = trackTypeSymbol;

            visitNode(node);

            typeWriter.trackInaccesibleSymbol = typeWriter.trackTypeSymbol = undefined;

            return;

            function trackTypeSymbol(symbol: Symbol) {
                if (currentErrorNode) {
                    collectDeclarations(symbol, currentErrorNode);
                }
            }

            function trackInaccesibleSymbol(symbol: Symbol): void {
                if (currentErrorNode) {
                    reportUnamedDeclarationMessage(currentErrorNode);
                }
            }

            function visitNode(node: Node): void {
                if (!node) return;

                switch (node.kind) {
                    case SyntaxKind.ExportDeclaration:
                        return visitExportDeclaration(<ExportDeclaration>node);
                    case SyntaxKind.ImportEqualsDeclaration:
                        return visitImportEqualsDeclaration(<ImportEqualsDeclaration>node);
                    case SyntaxKind.ExportAssignment:
                        return visitExportAssignment(<ExportAssignment>node);
                    case SyntaxKind.ImportDeclaration:
                    case SyntaxKind.ImportClause:
                    case SyntaxKind.ImportSpecifier:
                        // Nothing to visit, import declarations are only pulled in if referenced
                        return;

                    case SyntaxKind.InterfaceDeclaration:
                    case SyntaxKind.ClassDeclaration:
                        return visitNodes((<InterfaceDeclaration|ClassDeclaration>node).typeParameters) ||
                            forEach((<InterfaceDeclaration|ClassDeclaration>node).heritageClauses, visitHeritageClause);

                    case SyntaxKind.VariableStatement:
                    case SyntaxKind.ModuleDeclaration:
                    case SyntaxKind.EnumDeclaration:
                    case SyntaxKind.EnumMember:
                        // Nothing to visit here
                        return;

                    case SyntaxKind.TypeAliasDeclaration:
                        return visitNodes((<TypeAliasDeclaration>node).typeParameters) ||
                            visitNode((<TypeAliasDeclaration>node).type);

                    case SyntaxKind.TypeParameter:
                        return visitNode((<TypeParameterDeclaration>node).constraint);

                    case SyntaxKind.FunctionDeclaration:
                    case SyntaxKind.Constructor:
                    case SyntaxKind.MethodDeclaration:
                    case SyntaxKind.MethodSignature:
                    case SyntaxKind.ConstructSignature:
                    case SyntaxKind.CallSignature:
                    case SyntaxKind.IndexSignature:
                    case SyntaxKind.FunctionType:
                    case SyntaxKind.ConstructorType:
                        return visitSignatureDeclaration(<FunctionLikeDeclaration>node);

                    case SyntaxKind.GetAccessor:
                    case SyntaxKind.SetAccessor:
                        return visitAccessorDeclaration(<AccessorDeclaration>node);

                    case SyntaxKind.Parameter:
                    case SyntaxKind.VariableDeclaration:
                    case SyntaxKind.PropertyDeclaration:
                    case SyntaxKind.PropertySignature:
                    case SyntaxKind.BindingElement:
                        return visitPropertyDeclaration(<PropertyDeclaration>node);

                    case SyntaxKind.Identifier:
                        return visitTypeName(<Identifier>node);

                    default:
                        return forEachChild(node, visitNode);
                }

            }

            function visitExportDeclaration(node: ExportDeclaration): void {
                if (!node.moduleSpecifier) {
                    forEach(node.exportClause.elements, e => collectAliasDeclaration(e, node));
                }
            }

            function visitImportEqualsDeclaration(node: ImportEqualsDeclaration): void {
                if (node.moduleReference.kind !== SyntaxKind.ExternalModuleReference) {
                    collectAliasDeclaration(node, node.moduleReference);
                }
            }

            function visitExportAssignment(node: ExportAssignment): void {
                if (node.expression.kind === SyntaxKind.Identifier) {
                    collectAliasDeclaration(node, node.expression);
                }
                else if (!node.isExportEquals) { 
                    // handel expressions
                    let previousErrorNode = currentErrorNode;
                    currentErrorNode = node.expression;
                    resolver.writeTypeOfExpression(node.expression, getEnclosingDeclaration(node), TypeFormatFlags.UseTypeOfFunction, typeWriter);
                    currentErrorNode = previousErrorNode;
                }
            }

            function visitSignatureDeclaration(node: SignatureDeclaration): void {
                if (hasDynamicName(node) || node.flags & NodeFlags.Private) {
                    return;
                }

                visitNodes(node.typeParameters);
                visitNodes(node.parameters);

                if (node.type) {
                    visitNode(node.type);
                }
                else if (node.kind !== SyntaxKind.Constructor) {
                    // handel infered type
                    let previousErrorNode = currentErrorNode;
                    currentErrorNode = node.name || node;
                    resolver.writeReturnTypeOfSignatureDeclaration(node, getEnclosingDeclaration(node), TypeFormatFlags.UseTypeOfFunction, typeWriter);
                    currentErrorNode = previousErrorNode;
                }
            }

            function visitAccessorDeclaration(node: AccessorDeclaration) {
                if (hasDynamicName(node) || node.flags & NodeFlags.Private) {
                    return;
                }

                let accessors = getAllAccessorDeclarations((<ClassDeclaration>node.parent).members, node);

                if (accessors.firstAccessor === node) {
                    let type = getTypeAnnotationFromAccessor(accessors.getAccessor, accessors.setAccessor);
                    if (type) {
                        visitNode(type);
                    }
                    else {
                        // handel infered type
                        let previousErrorNode = currentErrorNode;
                        currentErrorNode = accessors.getAccessor ? accessors.getAccessor.name : node.name;
                        resolver.writeTypeOfDeclaration(node, getEnclosingDeclaration(node), TypeFormatFlags.UseTypeOfFunction, typeWriter);
                        currentErrorNode = previousErrorNode;
                    }
                }
            }

            function visitPropertyDeclaration(node: PropertyDeclaration): void {
                if (hasDynamicName(node)) {
                    return;
                }

                if (node.flags & NodeFlags.Private && node.parent.kind !== SyntaxKind.Constructor) {
                    return;
                }

                if (isBindingPattern(node.name)) {
                    return visitNode(node.name);
                }

                if (node.type) {
                    visitNode(node.type);
                }
                else {
                    // handel infered type
                    let previousErrorNode = currentErrorNode;
                    currentErrorNode = node.name;
                    resolver.writeTypeOfDeclaration(node, getEnclosingDeclaration(node), TypeFormatFlags.UseTypeOfFunction, typeWriter);
                    currentErrorNode = previousErrorNode;
                }
            }

            function visitHeritageClause(node: HeritageClause) {
                let firstEntry = node.types && node.types[0];
                if (node.token === SyntaxKind.ExtendsKeyword &&
                    firstEntry && !isSupportedExpressionWithTypeArguments(firstEntry)) {
                    // An expression in an extends clause
                    let previousErrorNode = currentErrorNode;
                    currentErrorNode = firstEntry;
                    resolver.writeBaseConstructorTypeOfClass((<ClassLikeDeclaration>node.parent), getEnclosingDeclaration(node), TypeFormatFlags.UseTypeOfFunction, typeWriter);
                    currentErrorNode = previousErrorNode;
                }
                else {
                    // regular type references
                    forEach(node.types, visitExpressionWithTypeArguments);
                }
            }

            function visitExpressionWithTypeArguments(node: ExpressionWithTypeArguments): void {
                Debug.assert(node.expression.kind === SyntaxKind.Identifier || node.expression.kind === SyntaxKind.PropertyAccessExpression);
                visitNode(node.expression);
                visitNodes(node.typeArguments);
            }

            function visitTypeName(node: Identifier): void {
                let symbol = resolver.getSymbolAtLocation(node);
                if (symbol) {
                    collectDeclarations(symbol, node);
                }
            }

            function visitNodes(nodes: NodeArray<any>): void {
                forEach(nodes, visitNode);
            }

            function collectAliasDeclaration(node: ImportOrExportSpecifier|ImportEqualsDeclaration|ExportAssignment, errorNode: Node) {
                let target = getLocalTargetOfAliasDeclaration(node);
                if (target) {
                    collectDeclarations(target, errorNode);
                }
            }

            function getLocalTargetOfAliasDeclaration(node: Declaration): Symbol {
                switch (node.kind) {
                    case SyntaxKind.ImportEqualsDeclaration:
                        return resolver.getSymbolAtLocation((<ImportEqualsDeclaration>node).moduleReference);
                    case SyntaxKind.ExportSpecifier:
                        let target = (<ExportDeclaration>(<ExportSpecifier>node).parent.parent).moduleSpecifier ? undefined :
                            resolver.getSymbolAtLocation((<ExportSpecifier>node).propertyName || (<ExportSpecifier>node).name);
                        return target && resolver.getAliasedSymbol(target);
                    case SyntaxKind.ExportAssignment:
                        return resolver.getSymbolAtLocation(<Identifier>(<ExportAssignment>node).expression);
                }
            }
        }

        function collectDeclarations(symbol: Symbol, errorNode: Node): void {
            forEach(symbol.declarations, declaration => {
                collectDeclatation(declaration, errorNode);
            });
        }

        function collectDeclatation(declaration:Node, errorNode?: Node) {
            declarationsToProcess.push({ declaration, errorNode });
        }

        function isDeclarationExported(node: Node): boolean {
            if (compilerOptions.stripInternal && isInternal(node)) {
                return false;
            }

            switch (node.kind) {
                case SyntaxKind.PropertySignature:
                case SyntaxKind.PropertyDeclaration:
                case SyntaxKind.MethodSignature:
                case SyntaxKind.MethodDeclaration:
                case SyntaxKind.Constructor:
                case SyntaxKind.GetAccessor:
                case SyntaxKind.SetAccessor:
                case SyntaxKind.CallSignature:
                case SyntaxKind.ConstructSignature:
                case SyntaxKind.IndexSignature:
                case SyntaxKind.EnumMember:
                case SyntaxKind.ExportAssignment:
                case SyntaxKind.ExportDeclaration:
                case SyntaxKind.NamespaceImport:
                case SyntaxKind.ImportClause:
                case SyntaxKind.ImportSpecifier:
                case SyntaxKind.VariableDeclaration:
                    return true;

                case SyntaxKind.VariableStatement:
                case SyntaxKind.ClassDeclaration:
                case SyntaxKind.EnumDeclaration:
                case SyntaxKind.FunctionDeclaration:
                case SyntaxKind.ImportEqualsDeclaration:
                case SyntaxKind.InterfaceDeclaration:
                case SyntaxKind.ModuleDeclaration:
                case SyntaxKind.TypeAliasDeclaration:
                    if (node.flags & NodeFlags.Export) {
                        return true;
                    }
                    else if (node.parent.kind === SyntaxKind.SourceFile && !isExternalModule(<SourceFile>node.parent)) {
                        return true;
                    }
                    else if (node.parent.kind === SyntaxKind.ModuleBlock && isInAmbientContext(node.parent)) {
                        return !hasExportDeclatations(node.parent.parent);
                    }
                    break;
            }

            return false;
        }

        function forEachTopLevelDeclaration<T>(node: Node, action: (node: Node) => T): T {
            switch (node.kind) {
                case SyntaxKind.SourceFile:
                    return forEach((<SourceFile>node).statements, action);
                case SyntaxKind.InterfaceDeclaration:
                case SyntaxKind.EnumDeclaration:
                case SyntaxKind.ClassDeclaration:
                    return forEach((<InterfaceDeclaration|EnumDeclaration|ClassDeclaration>node).members, action);
                case SyntaxKind.VariableStatement:
                    return forEach((<VariableStatement>node).declarationList.declarations, action);
                case SyntaxKind.ModuleDeclaration:
                    if ((<ModuleDeclaration>node).body.kind === SyntaxKind.ModuleBlock) {
                        return forEach((<ModuleBlock>(<ModuleDeclaration>node).body).statements, action);
                    }
                    else {
                        return action((<ModuleDeclaration>node).body);
                    }
            }
        }

        function getEnclosingDeclaration(node: Node): Node {
            while (node.parent) {
                switch (node.parent.kind) {
                    case SyntaxKind.SourceFile:
                    case SyntaxKind.EnumDeclaration:
                    case SyntaxKind.ModuleDeclaration:
                    case SyntaxKind.ClassDeclaration:
                    case SyntaxKind.InterfaceDeclaration:
                    case SyntaxKind.ImportDeclaration:
                    case SyntaxKind.VariableStatement:
                        return node.parent;
                    default:
                        node = node.parent;
                }
            }
            return undefined;
        }

        function isExternalModuleDeclaration(node: Node) {
            return (node.kind === SyntaxKind.ModuleDeclaration && (<ModuleDeclaration>node).name.kind === SyntaxKind.StringLiteral) ||
                (node.kind === SyntaxKind.SourceFile && isExternalModule(<SourceFile>node));
        }

        function hasExportDeclatations(node: Node): boolean {
            if (!isExternalModuleDeclaration(node)) {
                return false;
            }

            let links = getNodeLinks(node);
            if (links.hasExportDeclarations === undefined) {
                links.hasExportDeclarations = !!forEachTopLevelDeclaration(node, n => {
                    return (n.kind === SyntaxKind.ExportAssignment || n.kind === SyntaxKind.ExportDeclaration);
                });
            }
            return links.hasExportDeclarations;
        }

        /**
         * Can the the declaration of this node be emitted without causing it 
         * to be exported from its parent in the .d.ts where it was not in the .ts
         *
         * This is caused by the scoping rules withen an ambient module or namespace
         * declaration where *all* top-level declarations are considered exported wether
         * they have an export modifier or not.
         *
         */
        function canWriteDeclaration(node: Node): boolean {
            if (node.kind === SyntaxKind.SourceFile ||
                node.kind === SyntaxKind.ImportEqualsDeclaration || node.kind === SyntaxKind.ImportDeclaration) {
                return true;
            }

            if (node.kind === SyntaxKind.VariableDeclaration || node.kind === SyntaxKind.BindingElement) {
                node = node.parent.parent;
            }

            let parent = getEnclosingDeclaration(node);

            if (!isDeclarationExported(node)) {
                // If the parent module has an export declaration  or export
                // assingment, then the scoping rules change, and only declarations
                // with export modifier are visible, so we can safely write 
                // a declaration of a non-exported entity without exposing it
                if (! hasExportDeclatations(parent)) {
                    return false;
                }
            }

            // The declaration is exported from its parent, or can be written without
            // an export modifier. Now check if the parent is visible as well.
            return canWriteDeclaration(parent);
        }

        function getNameText(node: ParameterDeclaration|PropertyDeclaration|VariableDeclaration|FunctionDeclaration| AccessorDeclaration| MethodDeclaration): string {
            if (node.name.kind === SyntaxKind.Identifier) {
                return (<Identifier>node.name).text;
            }
            else if (node.name.kind === SyntaxKind.ComputedPropertyName) {
                return getTextOfNode(node.name);
            }
        }

        function reportDeclarationAccessiblityMessage(referencedDeclaration: Declaration, errorNode: Node): void {
            Debug.assert(referencedDeclaration.name && referencedDeclaration.name.kind === SyntaxKind.Identifier);

            let referencedDeclarationName = (<Identifier>referencedDeclaration.name).text;
            let container = errorNode;

            while (container) {
                switch (container.kind) {
                    case SyntaxKind.HeritageClause:
                        if ((<HeritageClause>container).token === SyntaxKind.ExtendsKeyword) {
                            diagnostics.push(createDiagnosticForNode(errorNode,
                                Diagnostics.Extends_clause_references_inaccessible_name_0, referencedDeclarationName));
                        }
                        else {
                            diagnostics.push(createDiagnosticForNode(errorNode,
                                Diagnostics.Implements_clause_references_inaccessible_name_0, referencedDeclarationName));
                        }
                        return;
                    case SyntaxKind.BindingElement:
                    case SyntaxKind.VariableDeclaration:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Type_of_variable_0_references_inaccessible_name_1,
                            getNameText(<VariableDeclaration>container), referencedDeclarationName));
                        return;
                    case SyntaxKind.PropertySignature:
                    case SyntaxKind.PropertyDeclaration:
                    case SyntaxKind.SetAccessor:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Type_of_property_0_references_inaccessible_name_1,
                            getNameText(<PropertyDeclaration>container), referencedDeclarationName));
                        return;
                    case SyntaxKind.Parameter:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Type_of_parameter_0_references_inaccessible_name_1,
                            getNameText(<ParameterDeclaration>container), referencedDeclarationName));
                        return;
                    case SyntaxKind.GetAccessor:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Return_type_of_property_getter_0_references_inaccessible_name_1,
                            getNameText(<AccessorDeclaration>container), referencedDeclarationName));
                        return;
                    case SyntaxKind.ConstructSignature:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Return_type_of_construct_signature_references_inaccessible_name_0,
                            referencedDeclarationName));
                        return;
                    case SyntaxKind.CallSignature:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Return_type_of_call_signature_references_inaccessible_name_0,
                            referencedDeclarationName));
                        return;
                    case SyntaxKind.IndexSignature:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Return_type_of_index_signature_references_inaccessible_name_0,
                            referencedDeclarationName));
                        return;
                    case SyntaxKind.MethodDeclaration:
                    case SyntaxKind.MethodSignature:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Return_type_of_method_0_references_inaccessible_name_1,
                            getNameText(<MethodDeclaration>container), referencedDeclarationName));
                        return;
                    case SyntaxKind.FunctionDeclaration:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Return_type_of_function_0_references_inaccessible_name_1,
                            getNameText(<FunctionDeclaration>container), referencedDeclarationName));
                        return;
                    case SyntaxKind.TypeAliasDeclaration:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Type_alias_0_references_inaccessible_name_1,
                            (<TypeAliasDeclaration>container).name.text, referencedDeclarationName));
                        return;
                    case SyntaxKind.ExportAssignment:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Default_export_of_the_module_references_inaccessible_name_0,
                            referencedDeclarationName));
                        return;
                    case SyntaxKind.TypeParameter:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Constraint_of_type_parameter_0_references_inaccessible_name_1,
                            (<TypeParameterDeclaration>container).name.text, referencedDeclarationName));
                        return;
                    case SyntaxKind.ImportEqualsDeclaration:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Import_declaration_0_references_inaccessible_name_1,
                            (<ImportEqualsDeclaration>container).name.text, referencedDeclarationName));
                        return;
                }
                container = container.parent;
            }

            Debug.fail("Could not find container node");
        }

        function reportUnamedDeclarationMessage(errorNode: Node): void {
            let container = errorNode;

            while (container) {
                switch (container.kind) {
                    case SyntaxKind.BindingElement:
                    case SyntaxKind.VariableDeclaration:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Name_of_inferred_type_of_variable_0_could_not_be_written_Consider_adding_an_explicit_type_annotation,
                            getNameText(<VariableDeclaration>container)));
                        return;
                    case SyntaxKind.PropertySignature:
                    case SyntaxKind.PropertyDeclaration:
                    case SyntaxKind.SetAccessor:
                    case SyntaxKind.GetAccessor:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Name_of_inferred_type_of_property_0_could_not_be_written_Consider_adding_an_explicit_type_annotation,
                            getNameText(<PropertyDeclaration>container)));
                        return;
                    case SyntaxKind.Parameter:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Name_of_inferred_type_of_parameter_0_could_not_be_written_Consider_adding_an_explicit_type_annotation,
                            getNameText(<ParameterDeclaration>container)));
                        return;
                    case SyntaxKind.MethodDeclaration:
                    case SyntaxKind.MethodSignature:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Name_of_inferred_return_type_of_method_0_could_not_be_written_Consider_adding_an_explicit_type_annotation,
                            getNameText(<MethodDeclaration>container)));
                        return;
                    case SyntaxKind.FunctionDeclaration:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Name_of_inferred_return_type_of_function_0_could_not_be_written_Consider_adding_an_explicit_type_annotation,
                            getNameText(<FunctionDeclaration>container)));
                        return;
                    case SyntaxKind.ExportAssignment:
                        diagnostics.push(createDiagnosticForNode(errorNode,
                            Diagnostics.Name_of_inferred_type_of_default_export_could_not_be_written_Consider_exporting_a_declaration_instead));
                        return;
                }
                container = container.parent;
            }

            Debug.fail("Could not find container node");
        }

        function preprocessDeclaration(declaration: Node, errorNode?: Node): void {
            if (declaration.kind === SyntaxKind.TypeParameter || declaration.kind === SyntaxKind.Parameter) {
                return;
            }

            // Always report the error, even if the node was visited before, so that 
            // diffrent references to the same declaration are flagged
            if (errorNode && reportDeclarationAccessiblityError(declaration, errorNode)) {
                return;
            }

            // If this declaration is from a diffrent file, we will get to it later. 
            // Skip it for now.
            if (getSourceFileOfNode(declaration) !== currentSourceFile) {
                return;
            }

            let links = getNodeLinks(declaration);
            if (!links.collected) {
                links.collected = true;

                // Make sure this declaration can be emitted, that is it is accessible
                // and is connected to its parent, or else report a accessibility error
                ensureDeclarationVisible(declaration);

                // Collect any dependencies
                collectReferencedDeclarations(declaration);

                // Collect children as well
                switch (declaration.kind) {
                    case SyntaxKind.ModuleDeclaration:
                    case SyntaxKind.InterfaceDeclaration:
                    case SyntaxKind.ClassDeclaration:
                    case SyntaxKind.EnumDeclaration:
                    case SyntaxKind.VariableStatement:
                        collectTopLevelChildDeclarations(declaration);
                        break;
                }
            }
        }

        function reportDeclarationAccessiblityError(declaration: Node, errorNode: Node): boolean {
            let node = errorNode;
            while (node.parent.kind === SyntaxKind.QualifiedName || node.parent.kind === SyntaxKind.PropertyAccessExpression) {
                node = node.parent;
            }
            let links = getNodeLinks(node);
            if (!links.errorReported && !canWriteDeclaration(declaration)) {
                links.errorReported = true;
                reportDeclarationAccessiblityMessage(<Declaration>declaration, errorNode);
            }
            return links.errorReported;
        }

        function collectTopLevelChildDeclarations(node: Node): void {
            forEachTopLevelDeclaration(node, child => {
                if (isDeclarationExported(child)) {
                    collectDeclatation(child);
                }
            });
        }

        function ensureDeclarationVisible(node: Node): void {
            let links = getNodeLinks(node);
            if (!links.visited) {
                links.visited = true;

                // Make the declaration visble by attaching it to its
                // parent's visible declarations.
                // also make sure the parent is reachable from a top-level
                // declaration
                let parent = getEnclosingDeclaration(node);
                attachVisibleChild(parent, node);
                if (parent.kind !== SyntaxKind.SourceFile) {
                    ensureDeclarationVisible(parent);
                }
            }
        }

        function attachVisibleChild(node: Node, child: Node): void {
            let links = getNodeLinks(node);
            if (!links.visibleChildren) {
                links.visibleChildren = [child];
            }
            else {
                links.visibleChildren.push(child);
            }
        }

        function preprocessSourceFile(sourceFile: SourceFile): void {
            currentSourceFile = sourceFile;

            // Collect all visible declarations
            collectTopLevelChildDeclarations(sourceFile);

            while (declarationsToProcess.length > 0) {
                let {declaration, errorNode} = declarationsToProcess.shift();
                preprocessDeclaration(declaration, errorNode);
            }
        }
    }

    function forEachExpectedOutputFile(host: EmitHost, targetSourceFile: SourceFile, action: (name: string, sources: SourceFile[]) => void) {
        let compilerOptions = host.getCompilerOptions();

        if (targetSourceFile) {
            // If we have a targetSourceFile (e.g calling emitter from language service to getEmitOutput)
            // only emit the outputs of this file
            if (shouldEmitToOwnFile(targetSourceFile, compilerOptions)) {
                let outputFilePath = getOwnEmitOutputFilePath(targetSourceFile, host, ".d.ts");
                action(outputFilePath, [targetSourceFile]);
                return;
            }
            // Fall through to the --out case, i.e. shouldEmitToOwnFile()=== false
        }
        else {
            // No targetSourceFile, we need to emit all files
            for (let sourceFile of host.getSourceFiles()) {
                if (shouldEmitToOwnFile(sourceFile, compilerOptions)) {
                    let outputFilePath = getOwnEmitOutputFilePath(sourceFile, host, ".d.ts");
                    action(outputFilePath, [sourceFile]);
                }
            }
        }

        if (compilerOptions.out) {
            // Emit any files that did not have their own output file
            // all these files will emit to a single output file specified by compiler options.out
            let outputFilePath = removeFileExtension(compilerOptions.out) + ".d.ts"
            let sourceFiles = filter(host.getSourceFiles(), sourceFile => !isExternalModuleOrDeclarationFile(sourceFile));
            action(outputFilePath, sourceFiles);
        }
    }

    export function getDeclarationDiagnostics(host: EmitHost, resolver: EmitResolver, targetSourceFile: SourceFile): Diagnostic[] {
        let diagnostics: Diagnostic[] = [];
        forEachExpectedOutputFile(host, targetSourceFile, (outputFileName, sourceFiles) => {
            preprocessDeclarations(sourceFiles, resolver, diagnostics, host.getCompilerOptions());
        });
        
        if (targetSourceFile) {
            return filter(diagnostics, d => d.file === targetSourceFile);
        }
        else {
            return diagnostics;
        }
    }

    /* @internal */
    export function emitDeclarations(host: EmitHost, resolver: EmitResolver, targetSourceFile: SourceFile, diagnostics: Diagnostic[]): void {
        forEachExpectedOutputFile(host, targetSourceFile, (outputFileName, sourceFiles) => {
            let fileDiagnostics: Diagnostic[] = [];
            let preprocessResult = preprocessDeclarations(sourceFiles, resolver, fileDiagnostics, host.getCompilerOptions());
            if (fileDiagnostics.length === 0) {
                writeDeclarations(outputFileName, preprocessResult, host, fileDiagnostics);
            }
            diagnostics.push.apply(diagnostics, fileDiagnostics);
        });
    }
}
