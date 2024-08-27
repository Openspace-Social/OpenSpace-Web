import { IUser } from '~/models/auth/user/IUser';
import { IDataModel } from '~/models/abstract/IDataModel';
import { IEmoji } from '~/models/common/emoji/IEmoji';

export interface IUserInvite extends IDataModel<IUserInvite> {
    email: string;
    created: Date;
    createdUser: IUser;
    nickname: string;
    token: string;
    code: string;
    isInviteEmailSent: boolean;
}

