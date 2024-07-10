import { AxiosResponse } from '~/node_modules/axios';
import { UserData } from '~/types/models-data/auth/UserData';
import { GetMemberJoinedCommunitiesApiParams } from '~/services/Apis/communities/CommunitiesApiServiceTypes';
import { CommunityData } from '~/types/models-data/communities/CommunityData';
import { PostData } from '~/types/models-data/posts/PostData';

export interface ICommunitiesApiService {

    getMemberJoinedCommunities(params?: GetMemberJoinedCommunitiesApiParams): Promise<AxiosResponse<CommunityData[]>>;

}
