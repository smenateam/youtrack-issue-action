import { BaseEndpoint } from "./base";
import { IssueTag } from "../entities/issueTag";
import { PaginationOptions } from "../options/pagination_options";
export declare const TagPaths: {
    issueTags: string;
    issueTag: string;
};
export declare class TagEndpoint extends BaseEndpoint {
    all(paginationOptions?: PaginationOptions): Promise<IssueTag[]>;
    byId(tagId: string): Promise<IssueTag>;
}
