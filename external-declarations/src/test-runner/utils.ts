
import * as path from 'path'
import * as ts from 'typescript'
import { compileFiles, TestFile, Utils } from "./tsc-infrastructure/compiler-run";
import * as TestCaseParser from "./tsc-infrastructure/test-file-parser";
import * as fsp from 'fs/promises'
import { getDeclarationExtension, isDeclarationFile, isJavaScriptFile, isJSONFile, isSourceMapFile } from '../compiler/path-utils';
import { changeExtension } from './tsc-infrastructure/vpath';
import * as vpath from "./tsc-infrastructure/vpath";
import { libs } from './tsc-infrastructure/options';
import { ModuleKind } from 'typescript';
import { transformFile } from '../compiler/transform-file';

export function swapLocation(file: string, changed: string, extension: string | undefined = ".d.ts") {
    const parentDir = path.dirname(path.dirname(file));
    let baseFile = path.basename(file)
    if (extension) {
        const existingExtension = path.extname(file);
        baseFile = baseFile.substring(0, baseFile.length - existingExtension.length) + extension;
    }
    return path.join(parentDir, changed, baseFile);
}

export interface FileContent {
    content: string,
    fileName: string
}

export async function loadTestCase(fileName: string) {
    const rawText = await fsp.readFile(fileName, { encoding: "utf-8" });
    const test = {
        content: Utils.removeByteOrderMark(rawText),
        file: fileName,
    }
    return Object.assign(TestCaseParser.makeUnitsFromTest(test.content, test.file), {
        BOM: rawText.substring(0, Utils.getByteOrderMarkLength(rawText))
    });
}
export function runTypeScript(caseData: TestCaseParser.TestCaseContent, settings: ts.CompilerOptions): FileContent[] {
    function createHarnessTestFile(lastUnit: TestCaseParser.TestUnitData): TestFile {
        return { unitName: lastUnit.name, content: lastUnit.content, fileOptions: lastUnit.fileOptions };
    }

    const toBeCompiled = caseData.testUnitData.map(unit => {
        return createHarnessTestFile(unit);
    });

    const result = compileFiles(toBeCompiled, [], {
        declaration: "true",
        isolatedDeclarations: "true",
        removeComments: "false",
    }, settings, undefined);

    return caseData.testUnitData
        .filter(isRelevantTestFile)
        .map(file => {
            const declarationFile = changeExtension(file.name, getDeclarationExtension(file.name));
            const resolvedDeclarationFile = vpath.resolve(result.vfs.cwd(), declarationFile);
            const declaration = result.dts.get(resolvedDeclarationFile)
            return {
                content: declaration?.text ?? "",
                fileName: declarationFile,
            };
        })
}
export function isRelevantTestFile(f: TestCaseParser.TestUnitData) {
    return !isDeclarationFile(f.name) && !isJavaScriptFile(f.name) && !isJSONFile(f.name) && !isSourceMapFile(f.name) && f.content !== undefined
}


export function runIsolated(caseData: TestCaseParser.TestCaseContent, libFiles: string[], settings: ts.CompilerOptions): FileContent[] {
    const toSrc = (n: string) => vpath.combine('/src', n);
    const projectFiles = [...caseData.testUnitData.map(o => toSrc(o.name)), ...libFiles];

    const packageJson = caseData.testUnitData.find(f => f.name === "/package.json");
    let packageResolution: ts.ResolutionMode = ts.ModuleKind.CommonJS
    if (packageJson) {
        packageResolution = JSON.parse(packageJson.content)?.type === "module" ? ModuleKind.ESNext : ModuleKind.CommonJS
    }

    const results = caseData.testUnitData
        .filter(isRelevantTestFile)
        .map(file => {
            const declaration = transformFile(toSrc(file.name), Utils.removeByteOrderMark(file.content), projectFiles, libs, settings, packageResolution)
            return {
                content: declaration.code,
                fileName: changeExtension(file.name, getDeclarationExtension(file.name)),
            };
        })
    return results;
}


