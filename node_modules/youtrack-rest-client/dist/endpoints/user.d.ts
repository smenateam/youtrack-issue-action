import { BaseEndpoint } from "./base";
import { ReducedUser, User } from "..";
import { PaginationOptions } from "../options/pagination_options";
export declare const UserPaths: {
    current: string;
    users: string;
    user: string;
};
export declare class UserEndpoint extends BaseEndpoint {
    current(): Promise<User>;
    all(paginationOptions?: PaginationOptions): Promise<ReducedUser[]>;
    byId(userId: string): Promise<User>;
}
