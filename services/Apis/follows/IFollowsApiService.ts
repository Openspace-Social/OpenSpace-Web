import { AxiosResponse } from '~/node_modules/axios';
import {
    ApproveFollowRequestFromUserApiParams,
    CancelRequestToFollowUserApiParams,
    FollowUserApiParams, RejectFollowRequestFromUserApiParams, RequestToFollowUserApiParams, UnfollowUserApiParams,
} from '~/services/Apis/follows/FollowsApiServiceTypes';
import { FollowData } from '~/types/models-data/follows/FollowData';
import { UserData } from '~/types/models-data/auth/UserData';
import {List} from "~/models/lists/list/List";

export interface IFollowsApiService {

    requestToFollowUser(params: RequestToFollowUserApiParams): Promise<AxiosResponse<void>>;

    cancelRequestToFollowUser(params: CancelRequestToFollowUserApiParams): Promise<AxiosResponse<void>>;

    approveFollowRequestFromUser(params: ApproveFollowRequestFromUserApiParams): Promise<AxiosResponse<void>>;

    rejectFollowRequestFromUser(params: RejectFollowRequestFromUserApiParams): Promise<AxiosResponse<void>>;

    followUser(params: FollowUserApiParams): Promise<AxiosResponse<FollowData>>;

    unfollowUser(params: UnfollowUserApiParams): Promise<AxiosResponse<UserData>>;

    listNameCheck(name: string): Promise<AxiosResponse<void>>;

    getLists(): Promise<AxiosResponse<List[]>>;

    createList(name: string, emojiId: number): Promise<AxiosResponse<List>>;

    updateList(listId: number, name: string, emojiId: number, usernames: string[]): Promise<AxiosResponse<List>>;

    deleteList(listId: number): Promise<AxiosResponse<void>>;

    getSingleList(listId: number): Promise<AxiosResponse<List>>;

}
