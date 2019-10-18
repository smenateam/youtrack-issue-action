import { ReducedIssue } from "./issue";
export declare class IssueLinkTypeImpl {
    id?: string;
    name?: string;
    sourceToTarget?: string;
    targetToSource?: string;
    directed?: boolean;
    aggregation?: boolean;
    readOnly?: boolean;
}
export interface IssueLinkType extends IssueLinkTypeImpl {
}
export declare class IssueLinkImpl {
    id: string;
    direction?: string;
    linkType?: IssueLinkType;
    issue?: ReducedIssue;
    issues: ReducedIssue[];
}
export interface IssueLink extends IssueLinkImpl {
}
