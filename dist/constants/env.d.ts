import { LogLevel } from "../services/LogService";
/**
 * The default resource domain to use.
 *
 * This defaults to "hosts".
 */
export declare const IB_DOMAIN: string;
/**
 * The default URL to use to the backend.
 *
 * It defaults to "http://localhost/ib"
 */
export declare const IB_URL: string;
/**
 * The meta character to use for meta properties like id and name, which are not part of the host variables.
 *
 * It defaults to `@`.
 */
export declare const IB_META_KEY: string;
/**
 * The default log level
 */
export declare const IB_LOG_LEVEL: LogLevel;
