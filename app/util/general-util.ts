export const booleanIsUndefined = (value: boolean) => value === undefined || value === null;
export const booleanIsDefined = (value: boolean) => !booleanIsUndefined(value);