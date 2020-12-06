export declare class Test {
    static isString(value: any): boolean;
    /**
     * Test if it is an regular object.
     *
     * @param value
     */
    static isObject(value: any): boolean;
    /**
     * Test if the value is an array
     *
     * @param value
     */
    static isArray(value: any): value is Array<any>;
    static isPromise(value: any): value is Promise<any>;
}
export declare class AssertUtils {
    /**
     * Use AssertUtils.isEqual()
     *
     * @deprecated
     * @param value1
     * @param value2
     */
    static equals(value1: any, value2: any): void;
    static isEqual(value1: any, value2: any): void;
    static notEqual(value1: any, value2: any): void;
    static isLessThanOrEqual(value1: number, value2: number): void;
    static isLessThan(value1: number, value2: number): void;
    static isTrue(value: boolean | undefined): void;
    static notTrue(value: boolean | undefined): void;
    static isFalse(value: boolean | undefined): void;
    static notFalse(value: boolean | undefined): void;
    static isObject(value: any): void;
    static notObject(value: any): void;
    static isString(value: string | undefined): void;
    static notString(value: string | undefined): void;
    static isArray(value: any): void;
    static notArray(value: any): void;
    static isPromise(value: any): void;
    static notPromise(value: any): void;
}
export default AssertUtils;
