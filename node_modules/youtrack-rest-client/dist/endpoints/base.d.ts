import { YoutrackClient } from "../youtrack";
import { RequestPromise } from "request-promise";
import { GenericObject } from "../entities/fields/utils";
export declare class BaseEndpoint {
    protected client: YoutrackClient;
    constructor(client: YoutrackClient);
    protected format(template: string, values: {}): string;
    protected toPromise<T>(request: RequestPromise): Promise<T>;
    protected getResource<T>(url: string, params?: {}): Promise<T>;
    protected postResource<T>(url: string, params?: {}): Promise<T>;
    protected getResourceWithFields<T>(url: string, implementation: new () => object, options?: {
        qs?: GenericObject;
    }): Promise<T>;
    protected postResourceWithFields<T>(url: string, implementation: new () => object, options?: {
        qs?: GenericObject;
        body?: any;
        form?: any;
    }): Promise<T>;
}
