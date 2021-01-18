export const between = (value: number, low: number, high: number): boolean => low < value && value < high;
export const betweenInclusive = (value: number, low: number, high: number): boolean => low <= value && value <= high;
