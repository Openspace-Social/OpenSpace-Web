<template>
    <article class="ok-user-invite-list-item media has-overflow-hidden is-flex align-items-center has-padding-5">
        <figure class="media-left">
            <ok-user-avatar v-if="isInviteAccepted" :user="user" class="has-padding-left-10"></ok-user-avatar>
            <ok-invites-icon v-else class="has-padding-left-10 is-icon-3x ok-has-text-primary-invert"></ok-invites-icon>
        </figure>
        <div class="media-content cursor-pointer has-z-index-1" @click="onTileClick">
            <div class="has-text-overflow-ellipsis">
                <div class="is-flex align-center">
                    <span class="ok-has-text-primary-invert has-text-weight-bold">
                        {{ name }}
                    </span>
                </div>
            </div>
            <div v-if="isInviteAccepted" class="has-text-overflow-ellipsis">
                <span class="ok-has-text-primary-invert-80">
                    {{ $t('manage_invites.joined_with_username', {username: username}) }}
                </span>
            </div>
        </div>
        <div class="media-right has-z-index-1">
            <!-- Trailing -->
            <div v-if="!isInviteAccepted" class="flex flex-row space-x-6">
                <button
                    @click="shareInviteCopy"
                    v-tooltip="{classes: 'my-tooltip', content: $t('manage_invites.share_invite_helper')}"
                    class="cursor-pointer ok-has-text-primary-invert">
                    <ok-share-chat-icon class="is-icon-2x"></ok-share-chat-icon>
                </button>
                <button
                    @click="$emit('on-invite-by-email', userInvite)"
                    v-tooltip="{classes: 'my-tooltip', content: $t('manage_invites.share_invite_email_helper')}"
                    class="cursor-pointer ok-has-text-primary-invert">
                    <ok-email-icon class="is-icon-2x"></ok-email-icon>
                </button>
                <button
                    @click="$emit('delete-invite', userInvite)"
                    class="cursor-pointer ok-has-text-error">
                    <ok-delete-icon class="is-icon-2x"></ok-delete-icon>
                </button>
            </div>
        </div>
    </article>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'nuxt-property-decorator';
import OkUserTile from '~/components/tiles/OkUserTile.vue';
import OkFollowButton from '~/components/buttons/OkFollowButton.vue';
import OkUserBadge from "~/components/user-badges/OkUserBadge.vue";
import OkUserAvatar from "~/components/avatars/user-avatar/OkUserAvatar.vue";
import {IUserInvite} from "~/models/invites/IUserInvite";
import {INavigationService} from "~/services/navigation/INavigationService";
import {okunaContainer} from "~/services/inversify";
import {TYPES} from "~/services/inversify-types";
import {IToastService} from "~/services/toast/IToastService";
import {ToastType} from "~/services/toast/lib/ToastType";

@Component({
    name: 'OkUserInviteListItem',
    computed: {
    },
    components: {OkUserAvatar, OkUserBadge, OkUserTile, OkFollowButton}
})
export default class OkUserInviteListItem extends Vue {
    @Prop({
        type: Object,
        required: true
    }) readonly userInvite: IUserInvite;

    private navigationService: INavigationService = okunaContainer.get<INavigationService>(TYPES.NavigationService);
    private toastService: IToastService = okunaContainer.get<IToastService>(TYPES.ToastService);

    get name() {
        if (this.userInvite.createdUser) {
            return this.userInvite.createdUser.profile.name;
        }
        return this.userInvite.nickname;
    }

    get isInviteAccepted() {
        return this.userInvite.createdUser !== null && this.userInvite.createdUser !== undefined;
    }

    get user() {
        return this.userInvite.createdUser;
    }

    get username() {
        return this.userInvite.createdUser && this.userInvite.createdUser.username;
    }

    get showUserPhoto() {
        return this.userInvite.createdUser && this.userInvite.createdUser.profile.photo;
    }

    onTileClick() {
        this.$emit('click', this.userInvite);

        if (this.userInvite.createdUser) {
            this.navigationService.navigateToProfile({ user: this.user });
        }
    }

    shareInviteCopy() {
        const inviteTest = this.$t('manage_invites.invite_share_message', {tokenCode: this.userInvite.code});
        navigator.clipboard.writeText(inviteTest.toString());
        this.toastService.show({
            message: "Invite copied to clipboard",
            type: ToastType.info
        });
    }
}
</script>

<style lang="scss">
.my-tooltip {
    display: block !important;
    z-index: 10000;

    .tooltip-inner {
        background: black;
        color: white;
        border-radius: 16px;
        padding: 5px 10px 4px;
    }

    .tooltip-arrow {
        width: 0;
        height: 0;
        border-style: solid;
        position: absolute;
        margin: 5px;
        border-color: black;
        z-index: 1;
    }

    &[x-placement^="top"] {
        margin-bottom: 5px;

        .tooltip-arrow {
            border-width: 5px 5px 0 5px;
            border-left-color: transparent !important;
            border-right-color: transparent !important;
            border-bottom-color: transparent !important;
            bottom: -5px;
            left: calc(50% - 5px);
            margin-top: 0;
            margin-bottom: 0;
        }
    }

    &[x-placement^="bottom"] {
        margin-top: 5px;

        .tooltip-arrow {
            border-width: 0 5px 5px 5px;
            border-left-color: transparent !important;
            border-right-color: transparent !important;
            border-top-color: transparent !important;
            top: -5px;
            left: calc(50% - 5px);
            margin-top: 0;
            margin-bottom: 0;
        }
    }

    &[x-placement^="right"] {
        margin-left: 5px;

        .tooltip-arrow {
            border-width: 5px 5px 5px 0;
            border-left-color: transparent !important;
            border-top-color: transparent !important;
            border-bottom-color: transparent !important;
            left: -5px;
            top: calc(50% - 5px);
            margin-left: 0;
            margin-right: 0;
        }
    }

    &[x-placement^="left"] {
        margin-right: 5px;

        .tooltip-arrow {
            border-width: 5px 0 5px 5px;
            border-top-color: transparent !important;
            border-right-color: transparent !important;
            border-bottom-color: transparent !important;
            right: -5px;
            top: calc(50% - 5px);
            margin-left: 0;
            margin-right: 0;
        }
    }

    &.popover {
        $color: #f9f9f9;

        .popover-inner {
            background: $color;
            color: black;
            padding: 24px;
            border-radius: 5px;
            box-shadow: 0 5px 30px rgba(black, .1);
        }

        .popover-arrow {
            border-color: $color;
        }
    }

    &[aria-hidden='true'] {
        visibility: hidden;
        opacity: 0;
        transition: opacity .15s, visibility .15s;
    }

    &[aria-hidden='false'] {
        visibility: visible;
        opacity: 1;
        transition: opacity .15s;
    }
}
</style>
