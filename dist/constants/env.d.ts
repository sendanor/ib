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
 * Default output filters.
 *
 * These is space separated property names to filter out of the results.
 *
 * It defaults to "-$*", eg. to hide all meta properties from the output.
 *
 * @see You can control this also using --include and --exclude
 */
export declare const IB_FILTER: string;
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
