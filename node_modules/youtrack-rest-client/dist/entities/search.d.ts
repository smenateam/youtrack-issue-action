import { BaseEndpoint } from "./base";
export interface Search {
    value: string;
    name: string;
    visibleForGroup: string;
    updatableByGroup: boolean;
}
export declare class SearchEndpoint extends BaseEndpoint {
    saved(): Promise<Search[]>;
}
