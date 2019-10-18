import { ReducedUser } from "./user";
import { ReducedIssue } from "./issue";
export declare class IssueCommentImpl {
    author?: ReducedUser;
    deleted?: boolean;
    issue?: ReducedIssue;
    attachments?: any;
    created?: number;
    id?: string;
    text?: string;
    textPreview?: string;
    updated?: number;
    usesMarkdown?: boolean;
    visibility?: any;
}
export interface IssueComment extends IssueCommentImpl {
}
export interface UpdateIssueComment extends IssueComment {
    id: string;
}
