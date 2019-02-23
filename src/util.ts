/*
	Module: Util
	Description: Utility functions used across modules
*/

export const between = (value: number, low: number, high: number): boolean => low < value && value < high;
export const betweenInclusive = (value: number, low: number, high: number): boolean => low <= value && value <= high;

interface RecursiveArray<T> extends Array<T | RecursiveArray<T>> {};
export const flattenDeep = <T>(array: RecursiveArray<T>): Array<T> => array.map((item: any) => Array.isArray(item) ? flattenDeep(item) : item);
