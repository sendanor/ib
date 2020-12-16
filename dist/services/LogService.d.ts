export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
export declare function parseLogLevel(value: string): LogLevel;
export declare class Logger {
    readonly name: string;
    constructor(name: string);
    debug(...args: Array<any>): void;
    info(...args: Array<any>): void;
    warn(...args: Array<any>): void;
    error(...args: Array<any>): void;
}
export declare class LogService {
    private static _level;
    private static _logger;
    static setLogLevel(value: LogLevel): void;
    static setLogger(value: any): void;
    static debug(...args: Array<any>): void;
    static info(...args: Array<any>): void;
    static warn(...args: Array<any>): void;
    static error(...args: Array<any>): void;
    static createLogger(name: string): Logger;
}
export default LogService;
