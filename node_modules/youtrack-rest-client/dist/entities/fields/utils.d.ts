export interface GenericObject {
    [key: string]: any;
}
export declare const generateFields: (obj: GenericObject) => string[];
export declare const generateFieldsQuery: (obj: GenericObject) => string;
