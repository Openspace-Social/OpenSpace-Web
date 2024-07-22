import { DataModel } from '~/models/abstract/DataModel';
import { IDataModel } from '~/models/abstract/IDataModel';
import { DataModelAttributeMap } from '~/models/abstract/IDataModel';
import { ModelData } from '~/types/models-data/ModelData';
import {
    userDeserializer,
    userSerializer
} from '~/models/common/serializers';


export interface ICommunityCreatorNameGetter extends IDataModel<ICommunityCreatorNameGetter> {

    communityId?: number;
    communityName?: string;
    communityTitle?: string;
    creatorId?: number;
    username?: string;
    userName?: string;
    userAvatar?: string;

}
