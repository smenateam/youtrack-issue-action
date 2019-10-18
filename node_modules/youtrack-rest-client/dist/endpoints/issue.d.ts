import { BaseEndpoint } from "./base";
import { Issue, ReducedIssue, NewIssue } from "..";
import { UpdateIssue } from "../entities/issue";
import { Command, CommandList } from "../entities/command";
import { PaginationOptions } from "../options/pagination_options";
export declare const IssuePaths: {
    issue: string;
    issues: string;
};
export declare const CommandPaths: {
    commands: string;
};
export declare class IssueEndpoint extends BaseEndpoint {
    byId(issueId: string): Promise<Issue>;
    search(query: string, paginationOptions?: PaginationOptions): Promise<ReducedIssue[]>;
    delete(issueId: string): Promise<any>;
    create(issue: NewIssue): Promise<Issue>;
    update(issue: UpdateIssue): Promise<Issue>;
    executeCommand(command: Command): Promise<CommandList>;
}
