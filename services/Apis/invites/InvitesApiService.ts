import { IHttpService } from '~/services/http/IHttpService';
import { TYPES } from '~/services/inversify-types';
import { IStringTemplateService } from '~/services/string-template/IStringTemplateService';
import {IInvitesApiService} from "~/services/Apis/invites/IInvitesApiService";
import {inject, injectable} from "inversify";
import {
    CreateUserInviteApiParams,
    DeleteUserInviteApiParams,
    GetUserInvitesApiParams, SearchUserInvitesApiParams, SendUserInviteEmailApiParams, UpdateUserInviteApiParams
} from "~/services/Apis/invites/InvitesApiServiceTypes";
import {AxiosResponse} from "axios";
import {UserInviteData} from "~/types/models-data/user-invites/UserInviteData";

@injectable()
export class InvitesApiService implements IInvitesApiService {
    static GET_USER_INVITES_PATH = 'api/invites/';
    static SEARCH_USER_INVITES_PATH = 'api/invites/search/';
    static CREATE_USER_INVITE_PATH = 'api/invites/';
    static UPDATE_USER_INVITE_PATH = 'api/invites/{userInviteId}/';
    static DELETE_INVITE_PATH = 'api/invites/{userInviteId}/';
    static EMAIL_INVITE_PATH = 'api/invites/{userInviteId}/email/';

    constructor(@inject(TYPES.HttpService) private httpService: IHttpService,
                @inject(TYPES.StringTemplateService) private stringTemplateService: IStringTemplateService) {

    }

    createUserInvite(params: CreateUserInviteApiParams): Promise<AxiosResponse<UserInviteData>> {
        return this.httpService.put(InvitesApiService.CREATE_USER_INVITE_PATH, {
            nickname: params.nickname
        }, {appendAuthorizationToken: true, isApiRequest: true});
    }

    updateUserInvite(params: UpdateUserInviteApiParams): Promise<AxiosResponse<UserInviteData>> {
        return this.httpService.patch(this.stringTemplateService.parse(InvitesApiService.UPDATE_USER_INVITE_PATH, {userInviteId: params.userInviteId}), {
            nickname: params.nickname
        }, {appendAuthorizationToken: true, isApiRequest: true});
    }

    getUserInvites(params: GetUserInvitesApiParams): Promise<AxiosResponse<UserInviteData[]>> {
        let queryParams = {}
        if(params.count){
            queryParams['count'] = params.count
        }
        if (params.offset){
            queryParams['offset'] = params.offset
        }
        if (params.isStatusPending !== null && params.isStatusPending !== undefined){
            queryParams['pending'] = params.isStatusPending
        }
        return this.httpService.get(InvitesApiService.GET_USER_INVITES_PATH, {
            queryParams: queryParams,
            appendAuthorizationToken: true,
            isApiRequest: true
        });
    }

    searchUserInvites(params: SearchUserInvitesApiParams): Promise<AxiosResponse<UserInviteData[]>> {
        let queryParams = {
            query: params.query
        }
        if(params.count){
            queryParams['count'] = params.count
        }
        if (params.isStatusPending !== null && params.isStatusPending !== undefined){
            queryParams['isStatusPending'] = params.isStatusPending
        }
        return this.httpService.get(InvitesApiService.SEARCH_USER_INVITES_PATH, {
            queryParams: queryParams,
            appendAuthorizationToken: true,
            isApiRequest: true
        });
    }

    deleteUserInvite(params: DeleteUserInviteApiParams): Promise<AxiosResponse<void>> {
        return this.httpService.delete(this.stringTemplateService.parse(InvitesApiService.DELETE_INVITE_PATH, {userInviteId: params.userInviteId}), {
            appendAuthorizationToken: true,
            isApiRequest: true
        });
    }

    sendUserInviteEmail(params: SendUserInviteEmailApiParams): Promise<AxiosResponse<void>> {
        return this.httpService.post(this.stringTemplateService.parse(InvitesApiService.EMAIL_INVITE_PATH, {userInviteId: params.userInviteId}), {
            email: params.email
        }, {
            appendAuthorizationToken: true,
            isApiRequest: true
        });
    }

}
