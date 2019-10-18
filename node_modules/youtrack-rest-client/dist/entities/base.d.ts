import { YoutrackClient } from "../youtrack";
import { RequestPromise } from "request-promise";
export declare class BaseEndpoint {
    protected client: YoutrackClient;
    constructor(client: YoutrackClient);
    protected format(template: string, values: {}): string;
    protected toPromise<T>(request: RequestPromise): Promise<T>;
}
