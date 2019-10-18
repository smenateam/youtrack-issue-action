import { ReducedIssueTag } from "./issueTag";
export declare class ReducedUserImpl {
    email: string;
    fullName: string;
    login: string;
    name: string;
    id: string;
}
export declare class UserImpl extends ReducedUserImpl {
    avatarUrl: string;
    banned: boolean;
    online: boolean;
    guest: boolean;
    jabberAccountName: string;
    ringId: string;
    tags: ReducedIssueTag[];
}
export interface User extends UserImpl {
}
export interface ReducedUser extends ReducedUserImpl {
}
