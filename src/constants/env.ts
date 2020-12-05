import InventoryLogLevel from "../types/InventoryLogLevel";
import LogUtils from "../services/LogUtils";

/**
 * The default collection to use.
 *
 * This defaults to "hosts".
 */
export const IB_COLLECTION : string = process?.env?.IB_COLLECTION ?? "hosts";

/**
 * The default URL to use to the backend.
 *
 * It defaults to "http://localhost/ib"
 */
export const IB_URL : string = process?.env?.IB_URL ?? "http://localhost/ib";

/**
 * The default log level
 */
export const IB_LOG_LEVEL : InventoryLogLevel = LogUtils.parseLogLevelString(process?.env?.IB_LOG_LEVEL ?? "INFO" );
