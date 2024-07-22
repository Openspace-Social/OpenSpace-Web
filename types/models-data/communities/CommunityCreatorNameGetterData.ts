import { ModelData } from '~/types/models-data/ModelData';

export interface CommunityCreatorNameGetterData extends ModelData {

    communityId?: number;
    communityName?: string;
    communityTitle?: string;
    creatorId?: number;
    username?: string;
    userName?: string;
    userAvatar?: string;

}
