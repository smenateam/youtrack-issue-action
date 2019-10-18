import { BaseEndpoint } from "./base";
import { Project, ReducedProject } from "..";
import { WorkItemTypeImpl } from "../entities/workItem";
import { PaginationOptions } from "../options/pagination_options";
export declare const ProjectPaths: {
    projects: string;
    project: string;
    workItemTypes: string;
};
export declare class ProjectEndpoint extends BaseEndpoint {
    all(paginationOptions?: PaginationOptions): Promise<ReducedProject[]>;
    byId(projectId: string): Promise<Project>;
    getWorkItemTypes(projectId: string): Promise<WorkItemTypeImpl[]>;
}
