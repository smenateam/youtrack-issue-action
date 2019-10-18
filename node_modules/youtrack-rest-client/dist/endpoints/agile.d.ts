import { BaseEndpoint } from "./base";
import { Agile, ReducedAgile, NewAgile, UpdateAgile } from "..";
import { PaginationOptions } from "../options/pagination_options";
export declare const AgilePaths: {
    agiles: string;
    agile: string;
};
export declare class AgileEndpoint extends BaseEndpoint {
    all(paginationOptions?: PaginationOptions): Promise<ReducedAgile[]>;
    byId(agileId: string): Promise<Agile>;
    delete(agileId: string): Promise<any>;
    create(agile: NewAgile): Promise<Agile>;
    update(agile: UpdateAgile): Promise<Agile>;
}
