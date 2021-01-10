// Copyright (c) 2020 Sendanor. All rights reserved.

import {LogLevel, parseLogLevel} from "../services/LogService";

/**
 * The default resource domain to use.
 *
 * This defaults to "hosts".
 */
export const IB_DOMAIN : string = process?.env?.IB_DOMAIN ?? "main";

/**
 * The default URL to use to the backend.
 *
 * It defaults to "http://localhost/ib"
 */
export const IB_URL : string = process?.env?.IB_URL ?? "http://localhost/ib";

/**
 * Default output filters.
 *
 * These is space separated property names to filter out of the results.
 *
 * It defaults to "-$*", eg. to hide all meta properties from the output.
 *
 * @see You can control this also using --include and --exclude
 */
export const IB_FILTER : string = process?.env?.IB_FILTER ?? "-$*";

/**
 * The meta character to use for meta properties like id and name, which are not part of the host variables.
 *
 * It defaults to `@`.
 */
export const IB_META_KEY : string = process?.env?.IB_META_KEY ?? '@';

/**
 * The default log level
 */
export const IB_LOG_LEVEL : LogLevel = parseLogLevel(process?.env?.IB_LOG_LEVEL ?? "INFO" );
