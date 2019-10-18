import { BaseEndpoint } from "./base";
import { Sprint, ReducedSprint, NewSprint, UpdateSprint } from "..";
import { PaginationOptions } from "../options/pagination_options";
export declare const SprintPaths: {
    sprints: string;
    sprint: string;
};
export declare class SprintEndpoint extends BaseEndpoint {
    all(agileId: string, paginationOptions?: PaginationOptions): Promise<ReducedSprint[]>;
    byId(agileId: string, sprintId: string): Promise<Sprint>;
    delete(agileId: string, sprintId: string): Promise<any>;
    create(agileId: string, sprint: NewSprint): Promise<Sprint>;
    update(agileId: string, sprint: UpdateSprint): Promise<Sprint>;
}
