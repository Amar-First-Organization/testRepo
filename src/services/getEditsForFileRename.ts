/* @internal */
namespace ts {
    export function getEditsForFileRename(program: Program, oldFileOrDirPath: string, newFileOrDirPath: string, host: LanguageServiceHost, formatContext: formatting.FormatContext, preferences: UserPreferences): ReadonlyArray<FileTextChanges> {
        const oldToNew = getPathUpdater(oldFileOrDirPath, newFileOrDirPath);
        const newToOld = getPathUpdater(newFileOrDirPath, oldFileOrDirPath);
        return textChanges.ChangeTracker.with({ host, formatContext }, changeTracker => {
            updateTsconfigFiles(program, changeTracker, oldToNew);
            updateImports(program, changeTracker, oldToNew, newToOld, host, preferences);
        });
    }

    /** If 'path' refers to an old directory, returns path in the new directory. */
    type PathUpdater = (path: string) => string | undefined;
    function getPathUpdater(oldFileOrDirPath: string, newFileOrDirPath: string): PathUpdater {
        return path => {
            if (path === oldFileOrDirPath) return newFileOrDirPath;
            const suffix = tryRemovePrefix(path, oldFileOrDirPath);
            return suffix === undefined ? undefined : newFileOrDirPath + suffix;
        };
    }

    function updateTsconfigFiles(program: Program, changeTracker: textChanges.ChangeTracker, oldToNew: PathUpdater): void {
        const configFile = program.getCompilerOptions().configFile;
        if (!configFile) return;
        for (const property of getTsConfigPropArray(configFile, "files")) {
            if (!isArrayLiteralExpression(property.initializer)) continue;

            for (const element of property.initializer.elements) {
                if (!isStringLiteral(element)) continue;

                const updated = oldToNew(element.text);
                if (updated !== undefined) {
                    changeTracker.replaceRangeWithText(configFile, createStringRange(element, configFile), updated);
                }
            }
        }
    }

    function updateImports(program: Program, changeTracker: textChanges.ChangeTracker, oldToNew: PathUpdater, newToOld: PathUpdater, host: LanguageServiceHost, preferences: UserPreferences): void {
        const getCanonicalFileName = hostGetCanonicalFileName(host);

        for (const sourceFile of program.getSourceFiles()) {
            const newImportFromPath = oldToNew(sourceFile.fileName) || sourceFile.fileName;
            const newImportFromDirectory = getDirectoryPath(newImportFromPath);

            const oldFromNew: string | undefined = newToOld(sourceFile.fileName);
            const oldImportFromPath: string = oldFromNew || sourceFile.fileName;
            const oldImportFromDirectory = getDirectoryPath(oldImportFromPath);

            updateImportsWorker(sourceFile, changeTracker,
                referenceText => {
                    if (!pathIsRelative(referenceText)) return undefined;
                    const oldAbsolute = combinePathsSafe(oldImportFromDirectory, referenceText);
                    const newAbsolute = oldToNew(oldAbsolute);
                    return newAbsolute === undefined ? undefined : ensurePathIsNonModuleName(getRelativePathFromDirectory(newImportFromDirectory, newAbsolute, getCanonicalFileName));
                },
                importLiteral => {
                    const toImport = oldFromNew !== undefined
                        // If we're at the new location (file was already renamed), need to redo module resolution starting from the old location.
                        // TODO:GH#18217
                        ? getSourceFileToImportFromResolved(resolveModuleName(importLiteral.text, oldImportFromPath, program.getCompilerOptions(), host as ModuleResolutionHost), oldToNew, program)
                        : getSourceFileToImport(importLiteral, sourceFile, program, host, oldToNew);
                    return toImport === undefined ? undefined : moduleSpecifiers.getModuleSpecifier(program, sourceFile, newImportFromPath, toImport, host, preferences);
                });
        }
    }

    function combineNormal(pathA: string, pathB: string): string {
        return normalizePath(combinePaths(pathA, pathB));
    }
    function combinePathsSafe(pathA: string, pathB: string): string {
        return ensurePathIsNonModuleName(combineNormal(pathA, pathB));
    }

    function getSourceFileToImport(importLiteral: StringLiteralLike, importingSourceFile: SourceFile, program: Program, host: LanguageServiceHost, oldToNew: PathUpdater): string | undefined {
        const symbol = program.getTypeChecker().getSymbolAtLocation(importLiteral);
        if (symbol) {
            if (symbol.declarations.some(d => isAmbientModule(d))) return undefined; // No need to update if it's an ambient module
            const oldFileName = find(symbol.declarations, isSourceFile)!.fileName;
            return oldToNew(oldFileName) || oldFileName;
        }
        else {
            const resolved = host.resolveModuleNames
                ? host.getResolvedModuleWithFailedLookupLocationsFromCache && host.getResolvedModuleWithFailedLookupLocationsFromCache(importLiteral.text, importingSourceFile.fileName)
                : program.getResolvedModuleWithFailedLookupLocationsFromCache(importLiteral.text, importingSourceFile.fileName);
            return getSourceFileToImportFromResolved(resolved, oldToNew, program);
        }
    }

    function getSourceFileToImportFromResolved(resolved: ResolvedModuleWithFailedLookupLocations | undefined, oldToNew: PathUpdater, program: Program): string | undefined {
        return resolved && (
            (resolved.resolvedModule && getIfInProgram(resolved.resolvedModule.resolvedFileName)) || firstDefined(resolved.failedLookupLocations, getIfInProgram));

        function getIfInProgram(oldLocation: string): string | undefined {
            const newLocation = oldToNew(oldLocation);
            return program.getSourceFile(oldLocation) || newLocation !== undefined && program.getSourceFile(newLocation)
                ? newLocation || oldLocation
                : undefined;
        }
    }

    function updateImportsWorker(sourceFile: SourceFile, changeTracker: textChanges.ChangeTracker, updateRef: (refText: string) => string | undefined, updateImport: (importLiteral: StringLiteralLike) => string | undefined) {
        for (const ref of sourceFile.referencedFiles) {
            const updated = updateRef(ref.fileName);
            if (updated !== undefined && updated !== sourceFile.text.slice(ref.pos, ref.end)) changeTracker.replaceRangeWithText(sourceFile, ref, updated);
        }

        for (const importStringLiteral of sourceFile.imports) {
            const updated = updateImport(importStringLiteral);
            if (updated !== undefined && updated !== importStringLiteral.text) changeTracker.replaceRangeWithText(sourceFile, createStringRange(importStringLiteral, sourceFile), updated);
        }
    }

    function createStringRange(node: StringLiteralLike, sourceFile: SourceFileLike): TextRange {
        return createTextRange(node.getStart(sourceFile) + 1, node.end - 1);
    }
}
