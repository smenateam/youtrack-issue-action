import { CustomFieldDefaults } from "./customFieldDefaults";
export declare class CustomFieldImpl {
    aliases: string;
    fieldDefaults: CustomFieldDefaults;
    hasRunningJob: boolean;
    isAutoAttached: boolean;
    isDisplayedInIssueList: boolean;
    isUpdateable: boolean;
    localizedName: string;
    name: string;
    ordinal: number;
    id: string;
}
export interface CustomField extends CustomFieldImpl {
}
