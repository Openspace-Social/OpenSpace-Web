import { IModelFactory } from '~/interfaces/IModelFactory';
import {IUserInvite} from "~/models/invites/IUserInvite";
import {UserInvite} from "~/models/invites/UserInvite";
import {UserInviteData} from "~/types/models-data/user-invites/UserInviteData";

class UserInviteFactory extends IModelFactory<IUserInvite> {
    make(data: UserInviteData): IUserInvite {
        return new UserInvite(data);
    }
}

const userInviteFactory = new UserInviteFactory();

export default userInviteFactory;
