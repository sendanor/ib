// Copyright (c) 2020 Sendanor. All rights reserved.

import {
    isString,
    isNumber,
    isObject,
    isArray,
    keys,
    every
} from "../modules/lodash";

export class Test {

    static isString (value: any) : value is string {
        return isString(value);
    }

    static isNumber (value: any) : value is number {
        return isNumber(value);
    }

    /**
     * Test if it is an regular object (eg. all keys are strings).
     *
     * @param value
     */
    static isRegularObject (value: any) : value is { [name: string]: any } {
        return isObject(value) && !isArray(value) && every(keys(value), (key : any) => isString(key));
    }

    /**
     * Test if the value is an array
     *
     * @param value
     */
    static isArray (value: any) : value is Array<any> {
        return isArray(value);
    }

    static isPromise (value: any) : value is Promise<any> {
        // @ts-ignore
        return isObject(value) && !!value.then && !!value.catch;
    }

}

export default Test;
