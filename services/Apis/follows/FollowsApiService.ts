import { IHttpService } from '~/services/http/IHttpService';
import { inject, injectable } from '~/node_modules/inversify';
import { TYPES } from '~/services/inversify-types';
import { IStringTemplateService } from '~/services/string-template/IStringTemplateService';
import {
    ApproveFollowRequestFromUserApiParams,
    CancelRequestToFollowUserApiParams,
    FollowUserApiParams, RejectFollowRequestFromUserApiParams, RequestToFollowUserApiParams, UnfollowUserApiParams,
} from '~/services/Apis/follows/FollowsApiServiceTypes';
import { AxiosResponse } from '~/node_modules/axios';
import { FollowData } from '~/types/models-data/follows/FollowData';
import { IFollowsApiService } from '~/services/Apis/follows/IFollowsApiService';
import { UserData } from '~/types/models-data/auth/UserData';
import {IList} from "~/models/lists/list/IList";
import {List} from "~/models/lists/list/List";
import {ListData} from "~/types/models-data/lists/ListData";
import {EmojiGroupData} from "~/types/models-data/common/EmojiGroupData";
import {UserInvite} from "~/models/invites/UserInvite";
import {GetUserInvitesApiParams} from "~/services/Apis/invites/InvitesApiServiceTypes";
import {InvitesApiService} from "~/services/Apis/invites/InvitesApiService";

@injectable()
export class FollowsApiService implements IFollowsApiService {
    static FOLLOW_USER_PATH = 'api/follows/follow/';
    static UNFOLLOW_USER_PATH = 'api/follows/unfollow/';
    static REQUEST_TO_FOLLOW_USER_PATH = 'api/follows/requests/';
    static CANCEL_REQUEST_TO_FOLLOW_USER_PATH =
        'api/follows/requests/cancel/';
    static APPROVE_USER_FOLLOW_REQUEST_PATH =
        'api/follows/requests/approve/';
    static REJECT_USER_FOLLOW_REQUEST_PATH = 'api/follows/requests/reject/';
    static RECEIVED_FOLLOW_REQUESTS_PATH = 'api/follows/requests/received/';


    static UPDATE_FOLLOW_PATH = 'api/follows/update/';
    static FOLLOW_FOLLOW_PATH = 'api/follows/follow/';
    static LIST_NAME_CHECK_PATH = 'api/lists/name-check/';
    static GET_LISTS_PATH = 'api/lists/';
    static CREATE_LIST_PATH = 'api/lists/';
    static UPDATE_LIST_PATH = 'api/lists/{listId}/';
    static DELETE_LIST_PATH = 'api/lists/{listId}/';
    static GET_LIST_PATH = 'api/lists/{listId}/';
    static GET_LIST_EMOJI_GROUPS_PATH = 'api/emojis/groups/';

    constructor(@inject(TYPES.HttpService) private httpService: IHttpService,
                @inject(TYPES.StringTemplateService) private stringTemplateService: IStringTemplateService) {

    }

    requestToFollowUser(params: RequestToFollowUserApiParams): Promise<AxiosResponse<void>> {
        return this.httpService.put(FollowsApiService.REQUEST_TO_FOLLOW_USER_PATH, {
            username: params.userUsername
        }, {appendAuthorizationToken: true, isApiRequest: true});
    }

    cancelRequestToFollowUser(params: CancelRequestToFollowUserApiParams): Promise<AxiosResponse<void>> {
        return this.httpService.post(FollowsApiService.CANCEL_REQUEST_TO_FOLLOW_USER_PATH, {
            username: params.userUsername
        }, {appendAuthorizationToken: true, isApiRequest: true});
    }

    approveFollowRequestFromUser(params: ApproveFollowRequestFromUserApiParams): Promise<AxiosResponse<void>> {
        return this.httpService.post(FollowsApiService.APPROVE_USER_FOLLOW_REQUEST_PATH, {
            username: params.userUsername
        }, {appendAuthorizationToken: true, isApiRequest: true});
    }

    rejectFollowRequestFromUser(params: RejectFollowRequestFromUserApiParams): Promise<AxiosResponse<void>> {
        return this.httpService.post(FollowsApiService.REJECT_USER_FOLLOW_REQUEST_PATH, {
            username: params.userUsername
        }, {appendAuthorizationToken: true, isApiRequest: true});
    }

    followUser(params: FollowUserApiParams): Promise<AxiosResponse<FollowData>> {
        return this.httpService.post(FollowsApiService.FOLLOW_USER_PATH, {
            username: params.userUsername
        }, {appendAuthorizationToken: true, isApiRequest: true});
    }

    unfollowUser(params: UnfollowUserApiParams): Promise<AxiosResponse<UserData>> {
        return this.httpService.post(FollowsApiService.UNFOLLOW_USER_PATH, {
            username: params.userUsername
        }, {appendAuthorizationToken: true, isApiRequest: true});
    }

    listNameCheck(name: string): Promise<AxiosResponse<void>> {
        return this.httpService.post(FollowsApiService.LIST_NAME_CHECK_PATH, {
            name: name
        }, {appendAuthorizationToken: true, isApiRequest: true});
    }

    getLists(): Promise<AxiosResponse<List[]>> {
        return this.httpService.get(FollowsApiService.GET_LISTS_PATH, {appendAuthorizationToken: true, isApiRequest: true});
    }

    createList(name: string, emojiId: number): Promise<AxiosResponse<ListData>> {
        return this.httpService.put(FollowsApiService.CREATE_LIST_PATH, {
            name: name,
            emoji_id: emojiId
        }, {appendAuthorizationToken: true, isApiRequest: true});
    }

    updateFollowList(username: string, listIds: number[]): Promise<AxiosResponse<any>> {
        return this.httpService.post(FollowsApiService.UPDATE_FOLLOW_PATH, {
            username: username,
            lists_ids: listIds
        }, {appendAuthorizationToken: true, isApiRequest: true});
    }

    followFollowList(username: string, listIds: number[]): Promise<AxiosResponse<any>> {
        return this.httpService.post(FollowsApiService.FOLLOW_FOLLOW_PATH, {
            username: username,
            lists_ids: listIds
        }, {appendAuthorizationToken: true, isApiRequest: true});
    }

    updateList(listId: number, name: string, emojiId: number, usernames: string[]): Promise<AxiosResponse<ListData>> {
        return this.httpService.patch(this.stringTemplateService.parse(FollowsApiService.UPDATE_LIST_PATH, {listId: listId}), {
            name: name,
            emoji_id: emojiId,
            usernames: usernames
        }, {appendAuthorizationToken: true, isApiRequest: true});
    }

    deleteList(listId: number): Promise<AxiosResponse<void>> {
        return this.httpService.delete(this.stringTemplateService.parse(FollowsApiService.DELETE_LIST_PATH, {listId: listId}), {appendAuthorizationToken: true, isApiRequest: true});
    }

    getSingleList(listId: number): Promise<AxiosResponse<ListData>> {
        return this.httpService.get(this.stringTemplateService.parse(FollowsApiService.GET_LIST_PATH, {listId: listId}), {appendAuthorizationToken: true, isApiRequest: true});
    }

    getListEmojiGroups(): Promise<AxiosResponse<EmojiGroupData[]>> {
        return this.httpService.get(FollowsApiService.GET_LIST_EMOJI_GROUPS_PATH, {appendAuthorizationToken: true, isApiRequest: true});
    }

}
