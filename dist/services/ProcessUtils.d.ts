export declare class ProcessUtils {
    static getArguments(): Array<string>;
    static parseEnvFileLine(obj: Record<string, string>, line: string): Record<string, string>;
    static parseEnvFile(file: string): Record<string, string>;
    static initEnvFromFile(file: string): void;
    static initEnvFromDefaultFiles(): void;
}
export default ProcessUtils;
