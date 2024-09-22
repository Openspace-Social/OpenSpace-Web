import { ModelData } from '~/types/models-data/ModelData';
import { UserData } from '~/types/models-data/auth/UserData';
import { EmojiData } from '../common/EmojiData';
import {IUser} from "~/models/auth/user/IUser";

export interface UserInviteData extends ModelData {
    email: string;
    created: string;
    createdUser: UserData;
    nickname: string;
    token: string;
    code: string;
    isInviteEmailSent: boolean;
}
