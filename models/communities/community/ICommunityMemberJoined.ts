import { IDataModel } from '~/models/abstract/IDataModel';
import { IUser } from '~/models/auth/user/IUser';
import { ICommunityMembership } from '~/models/communities/community/community-membership/ICommunityMembership';
import { ICategory } from '~/models/common/category/ICategory';
import { CommunityType } from '~/models/communities/community/lib/CommunityType';
import Color from 'color';

export interface ICommunityMemberJoined extends IDataModel<ICommunityMemberJoined> {

    community_id: number;
    community_name: string;
    community_title: string;
    community_avatar: string;
    user_id: number;
    username: string;

}
