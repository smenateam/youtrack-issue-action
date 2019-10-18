import { FieldStyle } from "./fieldStyle";
import { ProjectCustomField } from "./projectCustomField";
export declare class IssueCustomFieldValueImpl {
    id?: string;
    name?: string;
    localizedName?: string;
    fullName?: string;
    login?: string;
    avatarUrl?: string;
    isResolved?: boolean;
    color?: FieldStyle;
}
export interface IssueCustomFieldValue extends IssueCustomFieldValueImpl {
}
export declare class IssueCustomFieldImpl {
    id: string;
    projectCustomField?: ProjectCustomField;
    value: IssueCustomFieldValue | null;
    $type: string;
    name: string;
}
export interface IssueCustomField extends IssueCustomFieldImpl {
}
