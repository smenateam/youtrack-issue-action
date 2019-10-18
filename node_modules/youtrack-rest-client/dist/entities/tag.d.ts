import { BaseEndpoint } from "./base";
export interface Tag {
    name: string;
    visibleForGroup: string;
    updatableByGroup: boolean;
    untagOnResolve: boolean;
}
export declare class TagEndpoint extends BaseEndpoint {
    all(): Promise<Tag[]>;
}
