import { ReducedIssue } from "./issue";
export declare class CommandListImpl {
    id?: string;
    caret?: number;
    commands?: any[];
    comment?: string;
    issues?: ReducedIssue[];
    query?: string;
    runAs?: string;
    silent?: boolean;
    suggestions?: any[];
    usesMarkdown?: boolean;
    visibility?: any;
}
export interface CommandList extends CommandListImpl {
}
export interface Command extends CommandList {
    query: string;
    issues: {
        id: string;
    }[];
}
