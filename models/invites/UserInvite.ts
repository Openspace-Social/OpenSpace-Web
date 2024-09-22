import { IList } from '~/models/lists/list/IList';
import { IUser } from '~/models/auth/user/IUser';
import { DataModel } from '~/models/abstract/DataModel';
import { DataModelAttributeMap } from '~/models/abstract/IDataModel';
import { ModelData } from 'types/models-data/ModelData';
import { IEmoji } from '~/models/common/emoji/IEmoji';
import {
    dateDeserializer, dateSerializer,
    emojiDeserializer,
    emojiSerializer,
    userDeserializer,
    usersDeserializer,
    userSerializer, usersSerializer
} from '~/models/common/serializers';
import {IUserInvite} from "~/models/invites/IUserInvite";

export class UserInvite extends DataModel<UserInvite> implements IUserInvite {
    email: string;
    created: Date;
    createdUser: IUser;
    nickname: string;
    token: string;
    code: string;
    isInviteEmailSent: boolean;

    dataMaps: DataModelAttributeMap<IUserInvite>[] = [
        {
          dataKey: 'email',
            attributeKey: 'email'
        },
        {
            dataKey: 'created',
            attributeKey: 'created',
            deserializer: dateDeserializer,
            serializer: dateSerializer
        },
        {
            dataKey: 'created_user',
            attributeKey: 'createdUser',
            deserializer: userDeserializer,
            serializer: userSerializer
        },
        {
            dataKey: 'nickname',
            attributeKey: 'nickname'
        },
        {
            dataKey: 'token',
            attributeKey: 'token'
        },
        {
            dataKey: 'code',
            attributeKey: 'code'
        },
        {
            dataKey: 'is_invite_email_sent',
            attributeKey: 'isInviteEmailSent'
        }
    ];

    constructor(data: ModelData) {
        super(data);
        this.updateWithData(data);
    }
}

