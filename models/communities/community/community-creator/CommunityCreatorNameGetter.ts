import { DataModel } from '~/models/abstract/DataModel';
import { DataModelAttributeMap } from '~/models/abstract/IDataModel';
import { ModelData } from '~/types/models-data/ModelData';
import { ICommunityCreatorNameGetter } from '~/models/communities/community/community-creator/ICommunityCreatorNameGetter';
import {
    userDeserializer,
    userSerializer
} from '~/models/common/serializers';


export class CommunityCreatorNameGetter extends DataModel<CommunityCreatorNameGetter> implements ICommunityCreatorNameGetter {

    communityId?: number;
    communityName?: string;
    communityTitle?: string;
    creatorId?: number;
    username?: string;
    userName?: string;
    userAvatar?: string;

    dataMaps: DataModelAttributeMap<ICommunityCreatorNameGetter>[] = [
        {
            dataKey: 'community_id',
            attributeKey: 'communityId'
        },
        {
            dataKey: 'community_name',
            attributeKey: 'communityName'
        },
        {
            dataKey: 'community_title',
            attributeKey: 'communityTitle'
        },
        {
            dataKey: 'creator_id',
            attributeKey: 'creatorId'
        },
        {
            dataKey: 'username',
            attributeKey: 'username'
        },
        {
            dataKey: 'user_name',
            attributeKey: 'userName'
        },
        {
            dataKey: 'user_avatar',
            attributeKey: 'userAvatar'
        }
    ];

    constructor(data: ModelData) {
        super(data);
        this.updateWithData(data);
    }

    getCreatorName(): string {
        return this.username ?? this.userName ?? '';
    }
}
