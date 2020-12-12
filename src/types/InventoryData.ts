// Copyright (c) 2020 Sendanor. All rights reserved.

import {ReadonlyJsonAny, ReadonlyJsonObjectOf} from "./Json";

/**
 * This is the data part of the resource received from the backend.
 */
export type InventoryData = ReadonlyJsonObjectOf<ReadonlyJsonAny>;

export default InventoryData;
