<template>
    <div class="ok-has-background-primary is-semi-rounded has-width-100-percent">
        <div class="box ok-has-background-primary-highlight">
            <section v-if="!showInviteUserByEmail && !showInviteNewUser" class="ok-user-invites-list">
                <div class="flex flex-row justify-between items-center has-padding-bottom-20">
                    <h2 class="is-size-5 ok-has-text-primary-invert has-text-weight-bold">
                        {{ $t('manage_invites.title') }}
                    </h2>
                    <div class="flex flex-row space-x-2 ok-has-text-primary-invert items-center justify-center">
                        <div class="">
                            <p v-if="loggedInUser" class="rounded-full ok-has-background-accent h-6 min-w-6 text-center p-0.5 text-sm font-bold">
                                {{ inviteCount }}
                            </p>
                        </div>
                        <button
                            v-if="loggedInUser && inviteCount > 0"
                            @click="showInviteNewUser = true"
                            class="button is-rounded ok-has-background-primary-highlight has-text-weight-bold is-small ok-has-text-primary-invert">
                            <ok-plus-icon/>
                            {{ $t('manage_invites.invite') }}
                        </button>
                    </div>
                </div>
                <div
                    v-if="acceptedInvites.length > 0 || requestInProgressAcceptedInvites"
                    class="flex flex-row justify-between items-center has-padding-bottom-20">
                    <h2 class="is-size-5 ok-has-text-primary-invert has-text-weight-bold">
                        {{ $t('manage_invites.accepted') }}
                    </h2>
                </div>
                <div class="ok-http-list" key="user-invites-list" >
                    <div class="ok-http-list-infinite-loading is-relative" >
                        <transition name="fade">
                            <div v-if="requestInProgressAcceptedInvites" class="has-padding-30">
                                <ok-loading-indicator style="position: relative;"></ok-loading-indicator>
                            </div>
                        </transition>
                        <div v-for="item in acceptedInvites" :key="'user-invites-list-' + item.id">
                            <ok-user-invite-list-item :user-invite="item" />
                        </div>
                    </div>
                </div>
                <div v-if="pendingInvites.length > 0 || requestInProgressPendingInvites" class="flex flex-row justify-between items-center has-padding-bottom-20 has-padding-top-10">
                    <h2 class="is-size-5 ok-has-text-primary-invert has-text-weight-bold">
                        {{ $t('manage_invites.pending') }}
                    </h2>
                </div>
                <div class="ok-http-list" key="user-invites-list-pending" >
                    <div class="ok-http-list-infinite-loading is-relative" >
                        <transition name="fade">
                            <div v-if="requestInProgressPendingInvites" class="has-padding-30">
                                <ok-loading-indicator style="position: relative;"></ok-loading-indicator>
                            </div>
                        </transition>
                        <div v-for="item in pendingInvites" :key="'user-invites-list-pending-' + item.id">
                            <ok-user-invite-list-item
                                @on-invite-by-email="onOpenInviteUserByEmail"
                                @delete-invite="onDeleteUserInvite"
                                :user-invite="item" />
                        </div>
                    </div>
                </div>
            </section>
            <section v-if="showInviteUserByEmail">
                <div class="flex flex-col">
                    <div class="flex flex-row justify-between items-center has-padding-bottom-20">
                        <button
                            @click="onBackClicked"
                            class="is-rounded has-text-weight-bold is-small ok-has-text-accent">
                            <ok-chevron-left-icon />
                            <span class="is-size-5 ok-has-text-primary-invert has-text-weight-bold">
                                {{ $t('manage_invites.email_invite') }}
                            </span>
                        </button>
                        <button
                            @click="onSendEmailInvite"
                            class="button is-rounded ok-has-background-primary-highlight has-text-weight-bold is-small ok-has-text-primary-invert">
                            {{ $t('manage_invites.send') }}
                        </button>
                    </div>
                    <ok-tile alignmentClass="align-items-start">
                        <template v-slot:content>
                            <div class="field">

                                <label for="userEmail" class="label is-medium ok-has-text-primary-invert">
                                    {{$t('global.keywords.email')}}
                                </label>

                                <div class="control">
                                    <input type="text"
                                           :placeholder="$t('manage_user.profile.email.placeholder')"
                                           class="input ok-input is-rounded"
                                           required
                                           id="inviteEmail" v-model="inviteEmail" />
                                </div>

                                <div v-if="$v.inviteEmail.$invalid" class="has-padding-top-5">
                                    <p class="help is-danger" v-if="!$v.inviteEmail.required">
                                        {{$t('global.errors.email.required')}}
                                    </p>
                                    <p class="help is-danger" v-else-if="!$v.inviteEmail.email">
                                        {{$t('global.errors.email.invalid')}}
                                    </p>
                                </div>
                            </div>
                        </template>
                    </ok-tile>

                    <transition name="fade">
                        <div v-if="requestInProgress" class="has-padding-30">
                            <ok-loading-indicator style="position: relative;"></ok-loading-indicator>
                        </div>
                    </transition>
                </div>
            </section>
            <section v-if="showInviteNewUser">
                <div class="flex flex-col">
                    <div class="flex flex-row justify-between items-center has-padding-bottom-20">
                        <button
                            @click="onBackClicked"
                            class="is-rounded has-text-weight-bold is-small ok-has-text-accent">
                            <ok-chevron-left-icon />
                            <span class="is-size-5 ok-has-text-primary-invert has-text-weight-bold">
                                {{ $t('manage_invites.create_invite') }}
                            </span>
                        </button>
                        <button
                            @click="onCreateNewInvite"
                            class="button is-rounded ok-has-background-primary-highlight has-text-weight-bold is-small ok-has-text-primary-invert">
                            {{ $t('manage_invites.create') }}
                        </button>
                    </div>
                    <ok-tile alignmentClass="align-items-start">
                        <template v-slot:content>
                            <div class="field">

                                <label for="userEmail" class="label is-medium ok-has-text-primary-invert">
                                    {{$t('manage_invites.nickname')}}
                                </label>

                                <div class="control">
                                    <input type="text"
                                           :placeholder="$t('manage_invites.placeholder_nickname')"
                                           class="input ok-input is-rounded"
                                           required
                                           id="inviteNickName" v-model="inviteNickName" />
                                </div>

                                <div v-if="$v.inviteNickName.$invalid" class="has-padding-top-5">
                                    <p class="help is-danger" v-if="!$v.inviteNickName.required">
                                        {{$t('manage_invites.nickname_required')}}
                                    </p>
                                </div>
                            </div>
                        </template>
                    </ok-tile>
                    <transition name="fade">
                        <div v-if="requestInProgress" class="has-padding-30">
                            <ok-loading-indicator style="position: relative;"></ok-loading-indicator>
                        </div>
                    </transition>
                </div>
            </section>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.ok-user-invites-list {
    height: calc(100vh - 240px);
    width: 100%;
    overflow-y: auto;
}
</style>

<script lang="ts">
import {Component, Vue} from 'nuxt-property-decorator';
import {BehaviorSubject} from 'rxjs';
import {IUser} from '~/models/auth/user/IUser';
import {okunaContainer} from '~/services/inversify';
import {TYPES} from '~/services/inversify-types';
import {IUserService} from '~/services/user/IUserService';

import OkHttpList from '~/components/http-list/OkHttpList.vue';
import OkUserListItem from '~/components/user-list/common/user-list-item/OkUserListItem.vue';
import OkBlockedUserListItem from "~/components/user-list/common/user-list-item/OkBlockedUserListItem.vue";
import OkBlockButton from "~/components/buttons/OkBlockButton.vue";
import {CancelableOperation} from "~/lib/CancelableOperation";
import OkListTile from "~/components/user-list/lists/components/OkListTile.vue";
import OkListAvatar from "~/components/user-list/lists/components/OkListAvatar.vue";
import OkLoadingIndicator from "~/components/utils/OkLoadingIndicator.vue";
import OkCreateList from "~/components/user-list/lists/components/OkCreateList.vue";
import OkSelectedList from "~/components/user-list/lists/components/OkSelectedList.vue";
import OkCommunityTileSkeleton from "~/components/skeletons/tiles/OkCommunityTileSkeleton.vue";
import OkPostSkeleton from "~/components/skeletons/post/OkPostSkeleton.vue";
import OkCommunityCardSkeleton from "~/components/skeletons/cards/community-card/OkCommunityCardSkeleton.vue";
import OkNotificationSkeleton from "~/components/skeletons/notification/OkNotificationSkeleton.vue";
import {IModalService} from "~/services/modal/IModalService";
import {IUserInvite} from "~/models/invites/IUserInvite";
import OkUserInviteListItem from "~/components/invites/OkUserInviteListItem.vue";
import OkTile from "~/components/tiles/OkTile.vue";
import {Validate} from "vuelidate-property-decorators";
import {emailValidators} from "~/validators/email";
import {IToastService} from "~/services/toast/IToastService";
import {ToastType} from "~/services/toast/lib/ToastType";
import {inviteNickNameValidators} from "~/validators/invite-nickname";

@Component({
    name: 'OkUserInvitesList',
    components: {
        OkTile,
        OkUserInviteListItem,
        OkNotificationSkeleton, OkCommunityCardSkeleton, OkPostSkeleton, OkCommunityTileSkeleton,
        OkSelectedList,
        OkCreateList,
        OkLoadingIndicator,
        OkListAvatar, OkListTile, OkBlockButton, OkBlockedUserListItem, OkHttpList, OkUserListItem
    },
    subscriptions: function () {
        return {
            loggedInUser: this['userService'].loggedInUser
        };
    }
})
export default class OkUserInvitesList extends Vue {
    static infiniteScrollChunkUsersCount = 10;

    $observables!: {
        loggedInUser?: BehaviorSubject<IUser | undefined>
    };

    @Validate(emailValidators)
    inviteEmail: string = '';

    @Validate(inviteNickNameValidators)
    inviteNickName: string = '';

    inviteCount = 0;

    created() {
        this.$observables.loggedInUser.subscribe(this.onLoggedInUserChanged);
        this.inviteCount = this.$observables.loggedInUser.value?.inviteCount || 0;
    }

    onLoggedInUserChanged(loggedInUser: IUser | undefined) {
        console.log("---", this.$observables.loggedInUser.value?.inviteCount);
        this.inviteCount = this.$observables.loggedInUser.value?.inviteCount || 0;
    }

    acceptedInvites: IUserInvite[] = [];
    pendingInvites: IUserInvite[] = [];

    showInviteUserByEmail = false;
    showInviteNewUser = false;

    requestInProgress = false;
    requestInProgressPendingInvites = false;
    requestInProgressAcceptedInvites = false;
    requestOperation?: CancelableOperation<any>;

    private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
    private modalService: IModalService = okunaContainer.get<IModalService>(TYPES.ModalService);
    private toastService: IToastService = okunaContainer.get<IToastService>(TYPES.ToastService);


    selectedInvite: IUserInvite | null = null;

    async fetchAcceptedInvites(): Promise<void> {
        this.requestInProgressAcceptedInvites = true;
        try {
            this.acceptedInvites = await this.userService.getUserInvites({
                isStatusPending: false
            });
        } finally {
            this.requestInProgressAcceptedInvites = false;
        }
    }

    async fetchPendingInvites(): Promise<void> {
        this.requestInProgressPendingInvites = true;
        try {
            this.pendingInvites = await this.userService.getUserInvites({
                isStatusPending: true
            });
        } finally {
            this.requestInProgressPendingInvites = false;
        }
    }

    onAddedNewInvite() {
        this.fetchPendingInvites();
    }

    onOpenInviteUserByEmail(invite: IUserInvite) {
        this.selectedInvite = invite;
        this.showInviteUserByEmail = true;
    }

    async onSendEmailInvite() {
        if (this.$v.inviteEmail.$invalid) {
            return;
        }

        this.requestInProgress = true;
        this.requestOperation = CancelableOperation.fromPromise(this.userService.sendUserInviteEmail({
            email: this.inviteEmail,
            userInviteId: this.selectedInvite!.id
        }));
        try {
            await this.requestOperation.value;
            this.showInviteUserByEmail = false;
            this.selectedInvite = null;
            this.inviteEmail = '';
        } catch (error) {
            this.toastService.show({
                message: error,
                type: ToastType.error
            });
        } finally {
            this.requestInProgress = false;
        }
    }

    onBackClicked() {
        this.showInviteUserByEmail = false;
        this.showInviteNewUser = false;
        this.inviteEmail = "";
        this.selectedInvite = null;
    }

    async onCreateNewInvite() {
        if (this.$v.inviteNickName.$invalid) {
            return;
        }

        this.requestInProgress = true;
        this.requestOperation = CancelableOperation.fromPromise(this.userService.createUserInvite({
            nickname: this.inviteNickName
        }));
        try {
            await this.requestOperation.value;
            this.fetchPendingInvites();
            this.inviteCount -= 1;
            this.showInviteNewUser = false;
            this.selectedInvite = null;
            this.inviteNickName = '';
            this.updateUser();
        } catch (error) {
            this.toastService.show({
                message: error,
                type: ToastType.error
            });
        } finally {
            this.requestInProgress = false;
        }
    }

    async updateUser() {
        const newUser: IUser = await this.userService.refreshLoggedInUser();
        this.inviteCount = newUser.inviteCount;
    }

    async onDeleteUserInvite(userInvite: IUserInvite) {
        // confirm delete
        let res = confirm(this.$t('manage_invites.delete_confirm').toString());
        if (!res) {
            return;
        }
        this.requestInProgress = true;
        this.requestOperation = CancelableOperation.fromPromise(this.userService.deleteUserInvite({
            userInviteId: userInvite.id
        }));
        try {
            await this.requestOperation.value;
            this.fetchPendingInvites();
            this.inviteCount += 1;
            this.updateUser();
        } catch (error) {
            this.toastService.show({
                message: error,
                type: ToastType.error
            });
        } finally {
            this.requestInProgress = false;
        }
    }

    mounted() {
        this.fetchAcceptedInvites();
        this.fetchPendingInvites();
    }

}
</script>
