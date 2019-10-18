import { ReducedAgile } from "./agile";
import { ReducedIssue } from "./issue";
export declare class ReducedSprintImpl {
    id?: string;
    name?: string;
    goal?: string;
    start?: number;
    finish?: number;
    archived?: boolean;
    unresolvedIssuesCount?: number;
    previousSprint?: ReducedSprint;
}
export declare class SprintImpl extends ReducedSprintImpl {
    agile?: ReducedAgile;
    issues: ReducedIssue[];
    isDefault: boolean;
}
export interface ReducedSprint extends ReducedSprintImpl {
}
export interface Sprint extends SprintImpl {
}
export interface NewSprint extends Sprint {
    name: string;
}
export interface UpdateSprint extends Sprint {
    id: string;
}
