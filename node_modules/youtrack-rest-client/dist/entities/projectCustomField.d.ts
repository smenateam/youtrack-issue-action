import { CustomField } from "./customField";
export declare class ProjectCustomFieldImpl {
    canBeEmpty: boolean;
    emptyFieldText: string;
    field: CustomField;
    hasRunningJob: boolean;
    isPublic: boolean;
    ordinal: number;
    id: string;
}
export interface ProjectCustomField extends ProjectCustomFieldImpl {
}
