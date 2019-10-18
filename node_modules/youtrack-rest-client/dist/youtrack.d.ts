import { YoutrackTokenOptions } from "./options/youtrack_options";
import { RequestPromise } from "request-promise";
import { UserEndpoint } from "./endpoints/user";
import { TagEndpoint } from "./endpoints/tag";
import { IssueEndpoint } from "./endpoints/issue";
import { ProjectEndpoint } from "./endpoints/project";
import { AgileEndpoint } from "./endpoints/agile";
import { SprintEndpoint } from "./endpoints/sprint";
import { WorkItemEndpoint } from "./endpoints/workitem";
import { CommentEndpoint } from "./endpoints/comment";
export interface YoutrackClient {
    get(url: string, params?: {}, headers?: {}): RequestPromise;
    post(url: string, params?: {}, headers?: {}): RequestPromise;
    delete(url: string, params?: {}, headers?: {}): RequestPromise;
    put(url: string, params?: {}, headers?: {}): RequestPromise;
    readonly users: UserEndpoint;
    readonly tags: TagEndpoint;
    readonly issues: IssueEndpoint;
    readonly projects: ProjectEndpoint;
    readonly agiles: AgileEndpoint;
    readonly sprints: SprintEndpoint;
    readonly workItems: WorkItemEndpoint;
    readonly comments: CommentEndpoint;
}
export declare class Youtrack implements YoutrackClient {
    private readonly baseUrl;
    private defaultRequestOptions;
    readonly users: UserEndpoint;
    readonly tags: TagEndpoint;
    readonly issues: IssueEndpoint;
    readonly projects: ProjectEndpoint;
    readonly agiles: AgileEndpoint;
    readonly sprints: SprintEndpoint;
    readonly workItems: WorkItemEndpoint;
    readonly comments: CommentEndpoint;
    constructor(options: YoutrackTokenOptions);
    post(url: string, params?: {}, headers?: {}): RequestPromise;
    get(url: string, params?: {}, headers?: {}): RequestPromise;
    delete(url: string, params?: {}, headers?: {}): RequestPromise;
    put(url: string, params?: {}, headers?: {}): RequestPromise;
    private formBaseUrl;
    private prepareParams;
}
