
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
