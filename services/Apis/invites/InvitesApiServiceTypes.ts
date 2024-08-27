
export interface GetUserInvitesApiParams {
    offset?: number;
    count?: number;
    isStatusPending?: boolean;
}

export interface SearchUserInvitesApiParams {
    query: string;
    count?: number;
    isStatusPending?: boolean;
}

export interface DeleteUserInviteApiParams {
    userInviteId: number;
}

export interface SendUserInviteEmailApiParams {
    userInviteId: number;
    email: string;
}

export interface CreateUserInviteApiParams {
    nickname: string;
}

export interface UpdateUserInviteApiParams {
    userInviteId: number;
    nickname: string;
}
