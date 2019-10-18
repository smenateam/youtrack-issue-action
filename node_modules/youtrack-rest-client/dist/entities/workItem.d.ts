import { ReducedIssue } from "./issue";
import { ReducedUser } from "./user";
export declare class DurationValueImpl {
    presentation?: string;
    id?: string;
    minutes?: number;
}
export interface DurationValue extends DurationValueImpl {
}
export declare class WorkItemTypeImpl {
    id?: string;
    name?: string;
    autoAttached?: boolean;
}
export interface WorkItemType extends WorkItemTypeImpl {
}
export declare class WorkItemImpl {
    id?: string;
    created?: number;
    date?: number;
    duration?: DurationValue;
    issue?: ReducedIssue;
    updated?: number;
    author?: ReducedUser;
    creator?: ReducedUser;
    text?: string;
    textPreview?: string;
    type?: WorkItemType;
    usesMarkdown?: boolean;
}
export interface WorkItem extends WorkItemImpl {
}
export interface UpdateWorkItem extends WorkItemImpl {
    id: string;
}
