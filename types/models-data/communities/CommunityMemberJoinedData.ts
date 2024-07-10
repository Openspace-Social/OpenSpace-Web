import { ModelData } from 'types/models-data/ModelData';
import { UserData } from '~/types/models-data/auth/UserData';
import { CommunityMembershipData } from '~/types/models-data/communities/CommunityMembershipData';
import { CategoryData } from '~/types/models-data/common/CategoryData';

export interface CommunityMemberJoinedData extends ModelData {

    community_id: number;
    community_name: string;
    community_title: string;
    community_avatar: string;
    user_id: number;
    username: string;

}
