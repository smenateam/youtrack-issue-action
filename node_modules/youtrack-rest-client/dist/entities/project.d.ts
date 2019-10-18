import { ReducedUser } from "./user";
import { ProjectCustomField } from "./projectCustomField";
export declare class ReducedProjectImpl {
    id?: string;
    name?: string;
    shortName?: string;
    description?: string;
    archived?: boolean;
}
export declare class ProjectImpl extends ReducedProjectImpl {
    createdBy: ReducedUser;
    fields: ProjectCustomField[];
    fromEmail: string;
    hubResourceId: string;
    iconUrl: string;
    timeTrackingEnabled?: boolean;
    leader?: ReducedUser;
}
export interface Project extends ProjectImpl {
}
export interface ReducedProject extends ReducedProjectImpl {
}
