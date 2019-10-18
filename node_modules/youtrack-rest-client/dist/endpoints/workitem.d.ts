import { BaseEndpoint } from "./base";
import { WorkItem } from "..";
import { PaginationOptions } from "../options/pagination_options";
export declare const WorkItemPaths: {
    workitems: string;
    workitem: string;
};
export declare class WorkItemEndpoint extends BaseEndpoint {
    all(issueId: string, paginationOptions?: PaginationOptions): Promise<WorkItem[]>;
    create(issueId: string, workItem: WorkItem): Promise<WorkItem>;
    update(issueId: string, workItem: WorkItem): Promise<WorkItem>;
    delete(issueId: string, workItemId: string): Promise<any>;
}
