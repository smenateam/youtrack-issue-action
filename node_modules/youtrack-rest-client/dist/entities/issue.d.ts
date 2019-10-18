import { ReducedProject } from "./project";
import { ReducedUser } from "./user";
import { IssueTag } from "./issueTag";
import { IssueLink } from "./issueLink";
import { IssueCustomField } from "./issueCustomField";
import { IssueComment } from "./comment";
export declare class ReducedIssueImpl {
    id?: string;
    numberInProject?: number;
    created?: number;
    updated?: number;
    project?: ReducedProject;
    summary?: string;
    description?: string;
}
export declare class IssueImpl extends ReducedIssueImpl {
    reporter?: ReducedUser;
    updater?: ReducedUser;
    wikifiedDescription?: string;
    usesMarkdown?: boolean;
    fields?: IssueCustomField[];
    isDraft?: boolean;
    tags?: IssueTag[];
    links?: IssueLink[];
    comments?: IssueComment[];
}
export interface Issue extends IssueImpl {
}
export interface ReducedIssue extends ReducedIssueImpl {
}
export interface NewIssue extends Issue {
    project: {
        id: string;
    };
    summary: string;
}
export interface UpdateIssue extends Issue {
    id: string;
}
