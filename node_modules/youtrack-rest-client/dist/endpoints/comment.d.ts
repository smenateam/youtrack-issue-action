import { BaseEndpoint } from "./base";
import { IssueComment, UpdateIssueComment } from "../entities/comment";
import { PaginationOptions } from "../options/pagination_options";
export declare const CommentPaths: {
    comment: string;
    comments: string;
};
export declare class CommentEndpoint extends BaseEndpoint {
    all(issueId: string, paginationOptions?: PaginationOptions): Promise<IssueComment[]>;
    create(issueId: string, comment: IssueComment): Promise<any>;
    update(issueId: string, comment: UpdateIssueComment): Promise<IssueComment>;
    delete(issueId: string, commentId: string): Promise<any>;
}
