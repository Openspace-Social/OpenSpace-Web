import { AxiosResponse } from '~/node_modules/axios';
import {
    CreateUserInviteApiParams,
    DeleteUserInviteApiParams,
    GetUserInvitesApiParams,
    SearchUserInvitesApiParams, SendUserInviteEmailApiParams, UpdateUserInviteApiParams,
} from "~/services/Apis/invites/InvitesApiServiceTypes";
import {UserInviteData} from "~/types/models-data/user-invites/UserInviteData";

enum UserInviteFilterByStatus { pending, accepted, all }

export interface IInvitesApiService {

    getUserInvites(params: GetUserInvitesApiParams): Promise<AxiosResponse<UserInviteData[]>>;

    searchUserInvites(params: SearchUserInvitesApiParams): Promise<AxiosResponse<UserInviteData[]>>;

    deleteUserInvite(params: DeleteUserInviteApiParams): Promise<AxiosResponse<void>>;

    sendUserInviteEmail(params: SendUserInviteEmailApiParams): Promise<AxiosResponse<void>>;

    createUserInvite(params: CreateUserInviteApiParams): Promise<AxiosResponse<UserInviteData>>;

    updateUserInvite(params: UpdateUserInviteApiParams): Promise<AxiosResponse<UserInviteData>>;
}
