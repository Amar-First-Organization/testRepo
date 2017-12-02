/// <reference path="core.ts"/>

declare function setTimeout(handler: (...args: any[]) => void, timeout: number): any;
declare function clearTimeout(handle: any): void;

namespace ts {
    /**
     * Set a high stack trace limit to provide more information in case of an error.
     * Called for command-line and server use cases.
     * Not called if TypeScript is used as a library.
     */
    /* @internal */
    export function setStackTraceLimit() {
        if ((Error as any).stackTraceLimit < 100) { // Also tests that we won't set the property if it doesn't exist.
            (Error as any).stackTraceLimit = 100;
        }
    }

    export enum FileWatcherEventKind {
        Created,
        Changed,
        Deleted
    }

    export type FileWatcherCallback = (fileName: string, eventKind: FileWatcherEventKind) => void;
    export type DirectoryWatcherCallback = (fileName: string) => void;
    export interface WatchedFile {
        fileName: string;
        callback: FileWatcherCallback;
        mtime?: Date;
    }

    /**
     * Partial interface of the System thats needed to support the caching of directory structure
     */
    export interface DirectoryStructureHost {
        newLine: string;
        useCaseSensitiveFileNames: boolean;
        write(s: string): void;
        readFile(path: string, encoding?: string): string | undefined;
        writeFile(path: string, data: string, writeByteOrderMark?: boolean): void;
        fileExists(path: string): boolean;
        directoryExists(path: string): boolean;
        createDirectory(path: string): void;
        getCurrentDirectory(): string;
        getDirectories(path: string): string[];
        readDirectory(path: string, extensions?: ReadonlyArray<string>, exclude?: ReadonlyArray<string>, include?: ReadonlyArray<string>, depth?: number): string[];
        exit(exitCode?: number): void;
    }

    export interface System extends DirectoryStructureHost {
        args: string[];
        getFileSize?(path: string): number;
        /**
         * @pollingInterval - this parameter is used in polling-based watchers and ignored in watchers that
         * use native OS file watching
         */
        watchFile?(path: string, callback: FileWatcherCallback, pollingInterval?: number): FileWatcher;
        watchDirectory?(path: string, callback: DirectoryWatcherCallback, recursive?: boolean): FileWatcher;
        resolvePath(path: string): string;
        getExecutingFilePath(): string;
        getModifiedTime?(path: string): Date;
        /**
         * This should be cryptographically secure.
         * A good implementation is node.js' `crypto.createHash`. (https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm)
         */
        createHash?(data: string): string;
        getMemoryUsage?(): number;
        realpath?(path: string): string;
        /*@internal*/ getEnvironmentVariable(name: string): string;
        /*@internal*/ tryEnableSourceMapsForHost?(): void;
        /*@internal*/ debugMode?: boolean;
        setTimeout?(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;
        clearTimeout?(timeoutId: any): void;
    }

    export interface FileWatcher {
        close(): void;
    }

    interface DirectoryWatcher extends FileWatcher {
        referenceCount: number;
    }

    declare const require: any;
    declare const process: any;
    declare const global: any;
    declare const __filename: string;

    export function getNodeMajorVersion() {
        if (typeof process === "undefined") {
            return undefined;
        }
        const version: string = process.version;
        if (!version) {
            return undefined;
        }
        const dot = version.indexOf(".");
        if (dot === -1) {
            return undefined;
        }
        return parseInt(version.substring(1, dot));
    }

    declare const ChakraHost: {
        args: string[];
        currentDirectory: string;
        executingFile: string;
        newLine?: string;
        useCaseSensitiveFileNames?: boolean;
        echo(s: string): void;
        quit(exitCode?: number): void;
        fileExists(path: string): boolean;
        directoryExists(path: string): boolean;
        createDirectory(path: string): void;
        resolvePath(path: string): string;
        readFile(path: string): string | undefined;
        writeFile(path: string, contents: string): void;
        getDirectories(path: string): string[];
        readDirectory(path: string, extensions?: ReadonlyArray<string>, basePaths?: ReadonlyArray<string>, excludeEx?: string, includeFileEx?: string, includeDirEx?: string): string[];
        watchFile?(path: string, callback: FileWatcherCallback): FileWatcher;
        watchDirectory?(path: string, callback: DirectoryWatcherCallback, recursive?: boolean): FileWatcher;
        realpath(path: string): string;
        getEnvironmentVariable?(name: string): string;
    };

    /*@internal*/
    export interface PollingWatchDirectoryHost {
        watchFile: System["watchFile"];
        getAccessileSortedChildDirectories(path: string): ReadonlyArray<string>;
        directoryExists(path: string): boolean;
        filePathComparer: Comparer<string>;
    }

    /**
     * Watch the directory using polling watchFile
     * that means if this is recursive watcher, watch the children directories as well
     * (eg on OS that dont support recursive watch using fs.watch use fs.watchFile)
     */
    /*@internal*/
    export function watchDirectoryWithPolling(directoryName: string, recursive: boolean | undefined, host: PollingWatchDirectoryHost,
        onChangedPollingDirectory: () => void, onDeletedPollingDirectory?: () => void): FileWatcher {
        type ChildWatches = ReadonlyArray<ChildDirectoryWatcher>;
        interface DirectoryWatcher extends FileWatcher {
            childWatches: ChildWatches;
        }
        interface ChildDirectoryWatcher extends DirectoryWatcher {
            childName: string;
        }

        return createDirectoryWatcher(directoryName);

        /**
         * Create the directory watcher for the dirPath.
         * If not watching recursively just return FileWatcher,
         * otherwise create DirectoryWatcher that watches child directories as well
         */
        function createDirectoryWatcher(dirPath: string): DirectoryWatcher | FileWatcher {
            const dirWatcher = host.watchFile(dirPath, (_fileName, eventKind) => {
                if (dirPath === directoryName) {
                    if (onDeletedPollingDirectory && eventKind === FileWatcherEventKind.Deleted) {
                        // Watch missing directory hence forward
                        onDeletedPollingDirectory();
                        return;
                    }
                }
                // Create and delete should be handled by parent, no special action needed
                else if (eventKind !== FileWatcherEventKind.Changed) {
                    return;
                }

                // For now just call the rename on current directory
                onChangedPollingDirectory();

                // Iterate through existing children and update the watches if needed
                if (result) {
                    result.childWatches = watchChildDirectoriesWithPolling(dirPath, result.childWatches);
                }
            });

            // If not recursive just use this watcher, no need to iterate through children
            if (!recursive) {
                return dirWatcher;
            }

            let result: DirectoryWatcher = {
                close: () => {
                    dirWatcher.close();
                    result.childWatches.forEach(closeFileWatcher);
                    result = undefined;
                },
                childWatches: watchChildDirectoriesWithPolling(dirPath, emptyArray)
            };
            return result;
        }

        /**
         * Watch the directories in the parentDir
         */
        function watchChildDirectoriesWithPolling(parentDir: string, existingChildWatches: ChildWatches): ChildWatches {
            if (!host.directoryExists(parentDir)) {
                return emptyArray;
            }

            let newChildWatches: ChildDirectoryWatcher[] | undefined;
            enumerateInsertsAndDeletes<string, ChildDirectoryWatcher>(
                host.getAccessileSortedChildDirectories(parentDir),
                existingChildWatches,
                (child, childWatcher) => host.filePathComparer(child, childWatcher.childName),
                createAndAddChildDirectoryWatcher,
                closeFileWatcher,
                addChildDirectoryWatcher
            );
            return newChildWatches || emptyArray;

            /**
             * Create new childDirectoryWatcher and add it to the new ChildDirectoryWatcher list
             */
            function createAndAddChildDirectoryWatcher(childName: string) {
                const childPath = ts.getNormalizedAbsolutePath(childName, parentDir);
                const result = createDirectoryWatcher(childPath) as ChildDirectoryWatcher;
                result.childName = childName;
                addChildDirectoryWatcher(result);
            }

            /**
             * Add child directory watcher to the new ChildDirectoryWatcher list
             */
            function addChildDirectoryWatcher(childWatcher: ChildDirectoryWatcher) {
                (newChildWatches || (newChildWatches = [])).push(childWatcher);
            }
        }
    }

    export let sys: System = (() => {
        const utf8ByteOrderMark = "\u00EF\u00BB\u00BF";

        function getNodeSystem(): System {
            const _fs = require("fs");
            const _path = require("path");
            const _os = require("os");
            const _crypto = require("crypto");

            const nodeVersion = getNodeMajorVersion();
            const isNode4OrLater = nodeVersion >= 4;

            const platform: string = _os.platform();
            const useCaseSensitiveFileNames = isFileSystemCaseSensitive();

            const enum FileSystemEntryKind {
                File,
                Directory
            }

            const useNonPollingWatchers = process.env.TSC_NONPOLLING_WATCHER;
            // Node 4.0 `fs.watch` function supports the "recursive" option on both OSX and Windows
            // (ref: https://github.com/nodejs/node/pull/2649 and https://github.com/Microsoft/TypeScript/issues/4643)
            const fsSupportsRecursiveWatch = isNode4OrLater && (process.platform === "win32" || process.platform === "darwin");
            const filePathComparer = useCaseSensitiveFileNames ? compareStringsCaseSensitive : compareStringsCaseInsensitive;
            let pollingWatchPresentDirectoryHost: PollingWatchDirectoryHost | undefined;
            let pollingWatchPresentOrMissingDirectoryHost: PollingWatchDirectoryHost | undefined;

            const nodeSystem: System = {
                args: process.argv.slice(2),
                newLine: _os.EOL,
                useCaseSensitiveFileNames,
                write(s: string): void {
                    process.stdout.write(s);
                },
                readFile,
                writeFile,
                watchFile: useNonPollingWatchers ? createNonPollingWatchFile() : fsWatchFile,
                watchDirectory: (directoryName, callback, recursive) => {
                    // Node 4.0 `fs.watch` function supports the "recursive" option on both OSX and Windows
                    // (ref: https://github.com/nodejs/node/pull/2649 and https://github.com/Microsoft/TypeScript/issues/4643)
                    return fsWatchDirectory(directoryName, (eventName, relativeFileName) => {
                        // In watchDirectory we only care about adding and removing files (when event name is
                        // "rename"); changes made within files are handled by corresponding fileWatchers (when
                        // event name is "change")
                        if (eventName === "rename") {
                            // When deleting a file, the passed baseFileName is null
                            callback(!relativeFileName ? relativeFileName : normalizePath(combinePaths(directoryName, relativeFileName)));
                        }
                    }, recursive);
                },
                resolvePath: path => _path.resolve(path),
                fileExists,
                directoryExists,
                createDirectory(directoryName: string) {
                    if (!nodeSystem.directoryExists(directoryName)) {
                        _fs.mkdirSync(directoryName);
                    }
                },
                getExecutingFilePath() {
                    return __filename;
                },
                getCurrentDirectory() {
                    return process.cwd();
                },
                getDirectories,
                getEnvironmentVariable(name: string) {
                    return process.env[name] || "";
                },
                readDirectory,
                getModifiedTime(path) {
                    try {
                        return _fs.statSync(path).mtime;
                    }
                    catch (e) {
                        return undefined;
                    }
                },
                createHash(data) {
                    const hash = _crypto.createHash("md5");
                    hash.update(data);
                    return hash.digest("hex");
                },
                getMemoryUsage() {
                    if (global.gc) {
                        global.gc();
                    }
                    return process.memoryUsage().heapUsed;
                },
                getFileSize(path) {
                    try {
                        const stat = _fs.statSync(path);
                        if (stat.isFile()) {
                            return stat.size;
                        }
                    }
                    catch { /*ignore*/ }
                    return 0;
                },
                exit(exitCode?: number): void {
                    process.exit(exitCode);
                },
                realpath(path: string): string {
                    return _fs.realpathSync(path);
                },
                debugMode: some(<string[]>process.execArgv, arg => /^--(inspect|debug)(-brk)?(=\d+)?$/i.test(arg)),
                tryEnableSourceMapsForHost() {
                    try {
                        require("source-map-support").install();
                    }
                    catch {
                        // Could not enable source maps.
                    }
                },
                setTimeout,
                clearTimeout
            };
            return nodeSystem;

            function isFileSystemCaseSensitive(): boolean {
                // win32\win64 are case insensitive platforms
                if (platform === "win32" || platform === "win64") {
                    return false;
                }
                // If this file exists under a different case, we must be case-insensitve.
                return !fileExists(swapCase(__filename));
            }

            /** Convert all lowercase chars to uppercase, and vice-versa */
            function swapCase(s: string): string {
                return s.replace(/\w/g, (ch) => {
                    const up = ch.toUpperCase();
                    return ch === up ? ch.toLowerCase() : up;
                });
            }

            function createNonPollingWatchFile() {
                // One file can have multiple watchers
                const fileWatcherCallbacks = createMultiMap<FileWatcherCallback>();
                const dirWatchers = createMap<DirectoryWatcher>();
                const toCanonicalName = createGetCanonicalFileName(useCaseSensitiveFileNames);
                return nonPollingWatchFile;

                function nonPollingWatchFile(fileName: string, callback: FileWatcherCallback): FileWatcher {
                    const filePath = toCanonicalName(fileName);
                    fileWatcherCallbacks.add(filePath, callback);
                    const dirPath = getDirectoryPath(filePath) || ".";
                    const watcher = dirWatchers.get(dirPath) || createDirectoryWatcher(getDirectoryPath(fileName) || ".", dirPath);
                    watcher.referenceCount++;
                    return {
                        close: () => {
                            if (watcher.referenceCount === 1) {
                                watcher.close();
                                dirWatchers.delete(dirPath);
                            }
                            else {
                                watcher.referenceCount--;
                            }
                            fileWatcherCallbacks.remove(filePath, callback);
                        }
                    };
                }

                function createDirectoryWatcher(dirName: string, dirPath: string) {
                    const watcher = fsWatchDirectory(
                        dirName,
                        (_eventName: string, relativeFileName) => {
                            // When files are deleted from disk, the triggered "rename" event would have a relativefileName of "undefined"
                            const fileName = !isString(relativeFileName)
                                ? undefined
                                : ts.getNormalizedAbsolutePath(relativeFileName, dirName);
                            // Some applications save a working file via rename operations
                            const callbacks = fileWatcherCallbacks.get(toCanonicalName(fileName));
                            if (callbacks) {
                                for (const fileCallback of callbacks) {
                                    fileCallback(fileName, FileWatcherEventKind.Changed);
                                }
                            }
                        }
                    ) as DirectoryWatcher;
                    watcher.referenceCount = 0;
                    dirWatchers.set(dirPath, watcher);
                    return watcher;
                }
            }

            function fsWatchFile(fileName: string, callback: FileWatcherCallback, pollingInterval?: number): FileWatcher {
                _fs.watchFile(fileName, { persistent: true, interval: pollingInterval || 250 }, fileChanged);
                let eventKind: FileWatcherEventKind;
                return {
                    close: () => _fs.unwatchFile(fileName, fileChanged)
                };

                function fileChanged(curr: any, prev: any) {
                    if (+curr.mtime === 0) {
                        eventKind = FileWatcherEventKind.Deleted;
                    }
                    // previous event kind check is to ensure we send created event when file is restored or renamed twice (that is it disappears and reappears)
                    // since in that case the prevTime returned is same as prev time of event when file was deleted as per node documentation
                    else if (+prev.mtime === 0 || eventKind === FileWatcherEventKind.Deleted) {
                        eventKind = FileWatcherEventKind.Created;
                    }
                    // If there is no change in modified time, ignore the event
                    else if (+curr.mtime === +prev.mtime) {
                        return;
                    }
                    else {
                        // File changed
                        eventKind = FileWatcherEventKind.Changed;
                    }
                    callback(fileName, eventKind);
                }
            }

            function fsWatchDirectory(directoryName: string, callback: (eventName: string, relativeFileName: string) => void, recursive?: boolean): FileWatcher {
                // When doing recursive watch on non supported system, just use polling watcher
                if (recursive && !fsSupportsRecursiveWatch) {
                    return watchPresentOrMissingDirectoryWithPolling();
                }

                /**
                 * Watcher for the directory depending on whether it is missing or present
                 */
                let watcher = !directoryExists(directoryName) ? watchMissingDirectoryWithPolling() : fsWatchPresentDirectory();
                return {
                    close: () => {
                        // Close the watcher (either existing directory watcher or missing directory watcher)
                        watcher.close();
                        watcher = undefined;
                    }
                };

                function invokeCallbackAndUpdateWatcher(createWatcher: () => FileWatcher) {
                    // Call the callback for current directory
                    callback("rename", "");

                    // If watcher is not closed, update it
                    if (watcher) {
                        watcher.close();
                        watcher = createWatcher();
                    }
                }

                /**
                 * Watch the present directory through fs.watch and if that results in exception use polling directory watching
                 * when directory goes missing use switch to missing directory watcher
                 */
                function fsWatchPresentDirectory(): FileWatcher {
                    try {
                        const dirWatcher = _fs.watch(
                            directoryName,
                            { persistent: true, recursive: !!recursive },
                            callback
                        );
                        // Watch the missing directory on error (eg. directory deleted)
                        dirWatcher.on("error", () => invokeCallbackAndUpdateWatcher(watchMissingDirectoryWithPolling));
                        return dirWatcher;
                    }
                    catch (e) {
                        // Catch the exception and use polling instead
                        // Eg. on linux the number of watches are limited and one could easily exhaust watches and the exception ENOSPC is thrown when creating watcher at that point
                        // so instead of throwing error, use polling directory watcher
                        return watchPresentDirectoryWithPolling();
                    }
                }

                /**
                 * Watch the existing directory using polling,
                 * that means if this is recursive watcher, watch the children directories as well
                 * (eg on OS that dont support recursive watch using fs.watch)
                 */
                function watchPresentDirectoryWithPolling(): FileWatcher {
                    return watchDirectoryWithPolling(directoryName, recursive,
                        pollingWatchPresentDirectoryHost || (pollingWatchPresentDirectoryHost = {
                            filePathComparer,
                            watchFile: fsWatchFile,
                            // Since we are watching present directory, it would always be present
                            directoryExists: returnTrue,
                            getAccessileSortedChildDirectories: path => getAccessibleFileSystemEntries(path).directories
                        }),
                        () => callback("rename", ""),
                        () => invokeCallbackAndUpdateWatcher(watchMissingDirectoryWithPolling));
                }

                /**
                 * Watch missing or present directory with polling,
                 * this is invoked when recursive is not supported through fs.watch
                 * which means we would always need to poll, so no need to handle missing directory separately
                 */
                function watchPresentOrMissingDirectoryWithPolling(): FileWatcher {
                    return watchDirectoryWithPolling(directoryName, recursive,
                        pollingWatchPresentOrMissingDirectoryHost || (pollingWatchPresentOrMissingDirectoryHost = {
                            filePathComparer,
                            watchFile: fsWatchFile,
                            directoryExists,
                            getAccessileSortedChildDirectories: path => getAccessibleFileSystemEntries(path).directories
                        }),
                        () => callback("rename", ""));
                }

                /**
                 * Watch the directory that is missing
                 * and switch to existing directory when the directory is created
                 */
                function watchMissingDirectoryWithPolling(): FileWatcher {
                    return fsWatchFile(directoryName, (_fileName, eventKind) => {
                        if (eventKind === FileWatcherEventKind.Created && directoryExists(directoryName)) {
                            // This could be resulted as part of creating another directory or file
                            // but instead of spending time to detect that invoke callback on current directory
                            invokeCallbackAndUpdateWatcher(fsWatchPresentDirectory);
                        }
                    });
                }
            }

            function readFile(fileName: string, _encoding?: string): string | undefined {
                if (!fileExists(fileName)) {
                    return undefined;
                }
                const buffer = _fs.readFileSync(fileName);
                let len = buffer.length;
                if (len >= 2 && buffer[0] === 0xFE && buffer[1] === 0xFF) {
                    // Big endian UTF-16 byte order mark detected. Since big endian is not supported by node.js,
                    // flip all byte pairs and treat as little endian.
                    len &= ~1; // Round down to a multiple of 2
                    for (let i = 0; i < len; i += 2) {
                        const temp = buffer[i];
                        buffer[i] = buffer[i + 1];
                        buffer[i + 1] = temp;
                    }
                    return buffer.toString("utf16le", 2);
                }
                if (len >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
                    // Little endian UTF-16 byte order mark detected
                    return buffer.toString("utf16le", 2);
                }
                if (len >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
                    // UTF-8 byte order mark detected
                    return buffer.toString("utf8", 3);
                }
                // Default is UTF-8 with no byte order mark
                return buffer.toString("utf8");
            }

            function writeFile(fileName: string, data: string, writeByteOrderMark?: boolean): void {
                // If a BOM is required, emit one
                if (writeByteOrderMark) {
                    data = utf8ByteOrderMark + data;
                }

                let fd: number;

                try {
                    fd = _fs.openSync(fileName, "w");
                    _fs.writeSync(fd, data, /*position*/ undefined, "utf8");
                }
                finally {
                    if (fd !== undefined) {
                        _fs.closeSync(fd);
                    }
                }
            }

            function getAccessibleFileSystemEntries(path: string): FileSystemEntries {
                try {
                    const entries = _fs.readdirSync(path || ".").sort(filePathComparer);
                    const files: string[] = [];
                    const directories: string[] = [];
                    for (const entry of entries) {
                        // This is necessary because on some file system node fails to exclude
                        // "." and "..". See https://github.com/nodejs/node/issues/4002
                        if (entry === "." || entry === "..") {
                            continue;
                        }
                        const name = combinePaths(path, entry);

                        let stat: any;
                        try {
                            stat = _fs.statSync(name);
                        }
                        catch (e) {
                            continue;
                        }

                        if (stat.isFile()) {
                            files.push(entry);
                        }
                        else if (stat.isDirectory()) {
                            directories.push(entry);
                        }
                    }
                    return { files, directories };
                }
                catch (e) {
                    return { files: [], directories: [] };
                }
            }

            function readDirectory(path: string, extensions?: ReadonlyArray<string>, excludes?: ReadonlyArray<string>, includes?: ReadonlyArray<string>, depth?: number): string[] {
                return matchFiles(path, extensions, excludes, includes, useCaseSensitiveFileNames, process.cwd(), depth, getAccessibleFileSystemEntries);
            }

            function fileSystemEntryExists(path: string, entryKind: FileSystemEntryKind): boolean {
                try {
                    const stat = _fs.statSync(path);
                    switch (entryKind) {
                        case FileSystemEntryKind.File: return stat.isFile();
                        case FileSystemEntryKind.Directory: return stat.isDirectory();
                    }
                }
                catch (e) {
                    return false;
                }
            }

            function fileExists(path: string): boolean {
                return fileSystemEntryExists(path, FileSystemEntryKind.File);
            }

            function directoryExists(path: string): boolean {
                return fileSystemEntryExists(path, FileSystemEntryKind.Directory);
            }

            function getDirectories(path: string): string[] {
                return filter<string>(_fs.readdirSync(path), dir => fileSystemEntryExists(combinePaths(path, dir), FileSystemEntryKind.Directory));
            }
        }

        function getChakraSystem(): System {
            const realpath = ChakraHost.realpath && ((path: string) => ChakraHost.realpath(path));
            return {
                newLine: ChakraHost.newLine || "\r\n",
                args: ChakraHost.args,
                useCaseSensitiveFileNames: !!ChakraHost.useCaseSensitiveFileNames,
                write: ChakraHost.echo,
                readFile(path: string, _encoding?: string) {
                    // encoding is automatically handled by the implementation in ChakraHost
                    return ChakraHost.readFile(path);
                },
                writeFile(path: string, data: string, writeByteOrderMark?: boolean) {
                    // If a BOM is required, emit one
                    if (writeByteOrderMark) {
                        data = utf8ByteOrderMark + data;
                    }

                    ChakraHost.writeFile(path, data);
                },
                resolvePath: ChakraHost.resolvePath,
                fileExists: ChakraHost.fileExists,
                directoryExists: ChakraHost.directoryExists,
                createDirectory: ChakraHost.createDirectory,
                getExecutingFilePath: () => ChakraHost.executingFile,
                getCurrentDirectory: () => ChakraHost.currentDirectory,
                getDirectories: ChakraHost.getDirectories,
                getEnvironmentVariable: ChakraHost.getEnvironmentVariable || (() => ""),
                readDirectory(path, extensions, excludes, includes, _depth) {
                    const pattern = getFileMatcherPatterns(path, excludes, includes, !!ChakraHost.useCaseSensitiveFileNames, ChakraHost.currentDirectory);
                    return ChakraHost.readDirectory(path, extensions, pattern.basePaths, pattern.excludePattern, pattern.includeFilePattern, pattern.includeDirectoryPattern);
                },
                exit: ChakraHost.quit,
                realpath
            };
        }

        function recursiveCreateDirectory(directoryPath: string, sys: System) {
            const basePath = getDirectoryPath(directoryPath);
            const shouldCreateParent = basePath !== "" && directoryPath !== basePath && !sys.directoryExists(basePath);
            if (shouldCreateParent) {
                recursiveCreateDirectory(basePath, sys);
            }
            if (shouldCreateParent || !sys.directoryExists(directoryPath)) {
                sys.createDirectory(directoryPath);
            }
        }

        let sys: System;
        if (typeof ChakraHost !== "undefined") {
            sys = getChakraSystem();
        }
        else if (typeof process !== "undefined" && process.nextTick && !process.browser && typeof require !== "undefined") {
            // process and process.nextTick checks if current environment is node-like
            // process.browser check excludes webpack and browserify
            sys = getNodeSystem();
        }
        if (sys) {
            // patch writefile to create folder before writing the file
            const originalWriteFile = sys.writeFile;
            sys.writeFile = (path, data, writeBom) => {
                const directoryPath = getDirectoryPath(normalizeSlashes(path));
                if (directoryPath && !sys.directoryExists(directoryPath)) {
                    recursiveCreateDirectory(directoryPath, sys);
                }
                originalWriteFile.call(sys, path, data, writeBom);
            };
        }
        return sys;
    })();

    if (sys && sys.getEnvironmentVariable) {
        Debug.currentAssertionLevel = /^development$/i.test(sys.getEnvironmentVariable("NODE_ENV"))
            ? AssertionLevel.Normal
            : AssertionLevel.None;
    }
    if (sys && sys.debugMode) {
        Debug.isDebugging = true;
    }
}
