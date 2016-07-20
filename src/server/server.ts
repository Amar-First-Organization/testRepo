/// <reference types="node" />
/// <reference path="session.ts" />
// used in fs.writeSync
/* tslint:disable:no-null-keyword */

namespace ts.server {

    const zlib: {
        gzipSync(buf: Buffer): Buffer
    } = require("zlib");

    interface ReadLineOptions {
        input: NodeJS.ReadableStream;
        output?: NodeJS.WritableStream;
        terminal?: boolean;
        historySize?: number;
    }

    interface Key {
        sequence?: string;
        name?: string;
        ctrl?: boolean;
        meta?: boolean;
        shift?: boolean;
    }

    interface Stats {
        isFile(): boolean;
        isDirectory(): boolean;
        isBlockDevice(): boolean;
        isCharacterDevice(): boolean;
        isSymbolicLink(): boolean;
        isFIFO(): boolean;
        isSocket(): boolean;
        dev: number;
        ino: number;
        mode: number;
        nlink: number;
        uid: number;
        gid: number;
        rdev: number;
        size: number;
        blksize: number;
        blocks: number;
        atime: Date;
        mtime: Date;
        ctime: Date;
        birthtime: Date;
    }

    const readline: {
        createInterface(options: ReadLineOptions): NodeJS.EventEmitter;
    } = require("readline");

    const fs: {
        openSync(path: string, options: string): number;
        close(fd: number): void;
        writeSync(fd: number, buffer: Buffer, offset: number, length: number, position?: number): number;
        writeSync(fd: number, data: any, position?: number, enconding?: string): number;
        statSync(path: string): Stats;
        stat(path: string, callback?: (err: NodeJS.ErrnoException, stats: Stats) => any): void;
    } = require("fs");


    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false,
    });

    function compress(s: string): CompressedData {
        const data = zlib.gzipSync(new Buffer(s,  "utf8"));
        return { data, length: data.length, compressionKind: "gzip" };
    }

    const maxUncompressedMessageSize = 84000;

    class Logger implements ts.server.Logger {
        private fd = -1;
        private seq = 0;
        private inGroup = false;
        private firstInGroup = true;

        constructor(private readonly logFilename: string,
            private readonly traceToConsole: boolean,
            private readonly level: LogLevel) {
        }

        static padStringRight(str: string, padding: string) {
            return (str + padding).slice(0, padding.length);
        }

        close() {
            if (this.fd >= 0) {
                fs.close(this.fd);
            }
        }

        perftrc(s: string) {
            this.msg(s, Msg.Perf);
        }

        info(s: string) {
            this.msg(s, Msg.Info);
        }

        startGroup() {
            this.inGroup = true;
            this.firstInGroup = true;
        }

        endGroup() {
            this.inGroup = false;
            this.seq++;
            this.firstInGroup = true;
        }

        loggingEnabled() {
            return !!this.logFilename || this.traceToConsole;
        }

        hasLevel(level: LogLevel) {
            return this.loggingEnabled() && this.level >= level;
        }

        msg(s: string, type: Msg.Types = Msg.Err) {
            if (this.fd < 0) {
                if (this.logFilename) {
                    this.fd = fs.openSync(this.logFilename, "w");
                }
            }
            if (this.fd >= 0 || this.traceToConsole) {
                s = s + "\n";
                const prefix = Logger.padStringRight(type + " " + this.seq.toString(), "          ");
                if (this.firstInGroup) {
                    s = prefix + s;
                    this.firstInGroup = false;
                }
                if (!this.inGroup) {
                    this.seq++;
                    this.firstInGroup = true;
                }
                if (this.fd >= 0) {
                    const buf = new Buffer(s);
                    fs.writeSync(this.fd, buf, 0, buf.length, null);
                }
                if (this.traceToConsole) {
                    console.warn(s);
                }
            }
        }
    }

    class IOSession extends Session {
        constructor(host: ServerHost, cancellationToken: HostCancellationToken, useSingleInferredProject: boolean, logger: ts.server.Logger) {
            super(host, cancellationToken, useSingleInferredProject, Buffer.byteLength, maxUncompressedMessageSize, compress, process.hrtime, logger);
        }

        exit() {
            this.logger.info("Exiting...");
            this.projectService.closeLog();
            process.exit(0);
        }

        listen() {
            rl.on("line", (input: string) => {
                const message = input.trim();
                this.onMessage(message);
            });

            rl.on("close", () => {
                this.exit();
            });
        }
    }

    interface LogOptions {
        file?: string;
        detailLevel?: LogLevel;
        traceToConsole?: boolean;
        logToFile?: boolean;
    }

    function parseLoggingEnvironmentString(logEnvStr: string): LogOptions {
        const logEnv: LogOptions = { logToFile: true };
        const args = logEnvStr.split(" ");
        for (let i = 0, len = args.length; i < (len - 1); i += 2) {
            const option = args[i];
            const value = args[i + 1];
            if (option && value) {
                switch (option) {
                    case "-file":
                        logEnv.file = stripQuotes(value);
                        break;
                    case "-level":
                        const level: LogLevel = (<any>LogLevel)[value];
                        logEnv.detailLevel = typeof level === "number" ? level : LogLevel.normal;
                        break;
                    case "-traceToConsole":
                        logEnv.traceToConsole = value.toLowerCase() === "true";
                        break;
                    case "-logToFile":
                        logEnv.logToFile = value.toLowerCase() === "true";
                        break;
                }
            }
        }
        return logEnv;
    }

    // TSS_LOG "{ level: "normal | verbose | terse", file?: string}"
    function createLoggerFromEnv() {
        let fileName: string = undefined;
        let detailLevel = LogLevel.normal;
        let traceToConsole = false;
        const logEnvStr = process.env["TSS_LOG"];
        if (logEnvStr) {
            const logEnv = parseLoggingEnvironmentString(logEnvStr);
            if (logEnv.logToFile) {
                if (logEnv.file) {
                    fileName = logEnv.file;
                }
                else {
                    fileName = __dirname + "/.log" + process.pid.toString();
                }
            }
            if (logEnv.detailLevel) {
                detailLevel = logEnv.detailLevel;
            }
            traceToConsole = logEnv.traceToConsole;
        }
        return new Logger(fileName, traceToConsole,  detailLevel);
    }
    // This places log file in the directory containing editorServices.js
    // TODO: check that this location is writable

    // average async stat takes about 30 microseconds
    // set chunk size to do 30 files in < 1 millisecond
    function createPollingWatchedFileSet(interval = 2500, chunkSize = 30) {
        let watchedFiles: WatchedFile[] = [];
        let nextFileToCheck = 0;
        let watchTimer: any;

        function getModifiedTime(fileName: string): Date {
            return fs.statSync(fileName).mtime;
        }

        function poll(checkedIndex: number) {
            const watchedFile = watchedFiles[checkedIndex];
            if (!watchedFile) {
                return;
            }

            fs.stat(watchedFile.fileName, (err: any, stats: any) => {
                if (err) {
                    watchedFile.callback(watchedFile.fileName);
                }
                else if (watchedFile.mtime.getTime() !== stats.mtime.getTime()) {
                    watchedFile.mtime = getModifiedTime(watchedFile.fileName);
                    watchedFile.callback(watchedFile.fileName, watchedFile.mtime.getTime() === 0);
                }
            });
        }

        // this implementation uses polling and
        // stat due to inconsistencies of fs.watch
        // and efficiency of stat on modern filesystems
        function startWatchTimer() {
            watchTimer = setInterval(() => {
                let count = 0;
                let nextToCheck = nextFileToCheck;
                let firstCheck = -1;
                while ((count < chunkSize) && (nextToCheck !== firstCheck)) {
                    poll(nextToCheck);
                    if (firstCheck < 0) {
                        firstCheck = nextToCheck;
                    }
                    nextToCheck++;
                    if (nextToCheck === watchedFiles.length) {
                        nextToCheck = 0;
                    }
                    count++;
                }
                nextFileToCheck = nextToCheck;
            }, interval);
        }

        function addFile(fileName: string, callback: FileWatcherCallback): WatchedFile {
            const file: WatchedFile = {
                fileName,
                callback,
                mtime: getModifiedTime(fileName)
            };

            watchedFiles.push(file);
            if (watchedFiles.length === 1) {
                startWatchTimer();
            }
            return file;
        }

        function removeFile(file: WatchedFile) {
            watchedFiles = copyListRemovingItem(file, watchedFiles);
        }

        return {
            getModifiedTime: getModifiedTime,
            poll: poll,
            startWatchTimer: startWatchTimer,
            addFile: addFile,
            removeFile: removeFile
        };
    }

    // REVIEW: for now this implementation uses polling.
    // The advantage of polling is that it works reliably
    // on all os and with network mounted files.
    // For 90 referenced files, the average time to detect
    // changes is 2*msInterval (by default 5 seconds).
    // The overhead of this is .04 percent (1/2500) with
    // average pause of < 1 millisecond (and max
    // pause less than 1.5 milliseconds); question is
    // do we anticipate reference sets in the 100s and
    // do we care about waiting 10-20 seconds to detect
    // changes for large reference sets? If so, do we want
    // to increase the chunk size or decrease the interval
    // time dynamically to match the large reference set?
    const pollingWatchedFileSet = createPollingWatchedFileSet();
    const logger = createLoggerFromEnv();

    const pending: Buffer[] = [];
    let canWrite = true;

    function writeMessage(buf: Buffer) {
        if (!canWrite) {
            pending.push(buf);
        }
        else {
            canWrite = false;
            process.stdout.write(buf, setCanWriteFlagAndWriteMessageIfNecessary);
        }
    }

    function setCanWriteFlagAndWriteMessageIfNecessary() {
        canWrite = true;
        if (pending.length) {
            writeMessage(pending.shift());
        }
    }

    function writeCompressedData(prefix: string, compressed: CompressedData, suffix: string): void {
        sys.write(prefix);
        writeMessage(compressed.data);
        sys.write(suffix);
    }

    const sys = <ServerHost>ts.sys;

    // Override sys.write because fs.writeSync is not reliable on Node 4
    sys.write = (s: string) => writeMessage(new Buffer(s, "utf8"));
    sys.watchFile = (fileName, callback) => {
        const watchedFile = pollingWatchedFileSet.addFile(fileName, callback);
        return {
            close: () => pollingWatchedFileSet.removeFile(watchedFile)
        };
    };

    sys.setTimeout = setTimeout;
    sys.clearTimeout = clearTimeout;
    sys.setImmediate = setImmediate;
    sys.clearImmediate = clearImmediate;
    sys.writeCompressedData = writeCompressedData;

    let cancellationToken: HostCancellationToken;
    try {
        const factory = require("./cancellationToken");
        cancellationToken = factory(sys.args);
    }
    catch (e) {
        cancellationToken = {
            isCancellationRequested: () => false
        };
    };

    const useSingleInferredProject = sys.args.some(arg => arg === "--useSingleInferredProject");
    const ioSession = new IOSession(sys, cancellationToken, useSingleInferredProject, logger);
    process.on("uncaughtException", function(err: Error) {
        ioSession.logError(err, "unknown");
    });
    // Start listening
    ioSession.listen();
}