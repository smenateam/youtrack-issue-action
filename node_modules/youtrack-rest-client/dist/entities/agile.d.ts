import { ReducedProject } from "./project";
import { ReducedUser } from "./user";
import { ReducedSprint } from "./sprint";
export declare class ReducedAgileImpl {
    id?: string;
    name?: string;
    owner?: ReducedUser;
    projects?: ReducedProject[];
    sprints?: ReducedSprint[];
    currentSprint?: ReducedSprint;
}
export declare class AgileImpl extends ReducedAgileImpl {
    orphansAtTheTop?: boolean;
    hideOrphansSwimlane?: boolean;
}
export interface ReducedAgile extends ReducedAgileImpl {
}
export interface Agile extends AgileImpl {
}
export interface NewAgile extends Agile {
    projects: [{
        id: string;
    }];
    name: string;
}
export interface UpdateAgile extends Agile {
    projects?: [{
        id: string;
    }];
    id: string;
}
