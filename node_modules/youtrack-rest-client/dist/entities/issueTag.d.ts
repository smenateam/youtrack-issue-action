import { ReducedUser } from "./user";
export declare class ReducedIssueTagImpl {
    name: string;
    id: string;
}
export declare class IssueTagImpl extends ReducedIssueTagImpl {
    untagOnResolve: boolean;
    owner: ReducedUser;
}
export interface IssueTag extends IssueTagImpl {
}
export interface ReducedIssueTag extends ReducedIssueTagImpl {
}
