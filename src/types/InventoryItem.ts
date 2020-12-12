// Copyright (c) 2020 Sendanor. All rights reserved.

import InventoryData from "./InventoryData";

/**
 * This is a custom inventory host record which will have database meta data merged into custom data.
 *
 * The meta data properties will have "$" prefix in their name.
 */
export interface InventoryItem extends InventoryData {

    /**
     * The resource UUID
     */
    readonly $id   : string;

    /**
     * The resource name
     */
    readonly $name : string;

}

export default InventoryItem;
