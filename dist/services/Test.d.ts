export declare class Test {
    static isString(value: any): value is string;
    static isNumber(value: any): value is number;
    /**
     * Test if it is an regular object (eg. all keys are strings).
     *
     * @param value
     */
    static isRegularObject(value: any): value is {
        [name: string]: any;
    };
    /**
     * Test if the value is an array
     *
     * @param value
     */
    static isArray(value: any): value is Array<any>;
    static isPromise(value: any): value is Promise<any>;
}
export default Test;
