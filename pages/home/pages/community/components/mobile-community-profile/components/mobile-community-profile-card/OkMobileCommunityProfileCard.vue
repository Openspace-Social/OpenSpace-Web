<template>
    <div class="ok-has-background-primary ok-mobile-community-profile-card">
        <div class="ok-mobile-community-profile-card__content">
            <div class="has-padding-left-20 has-padding-right-20 container has-padding-top-20">
                <div class="columns is-gapless is-marginless is-mobile has-padding-bottom-10">
                    <div class="column is-narrow">
                        <ok-community-avatar :community="community" :avatar-size="OkAvatarSize.extraMedium"></ok-community-avatar>
                    </div>
                    <div class="column is-flex flex-direction-column align-items-flex-end justify-center">
                        <div>
                            <ok-community-profile-action-buttons :community="community"></ok-community-profile-action-buttons>
                        </div>
                    </div>
                </div>
                <div class="columns is-gapless is-marginless has-padding-top-10 flex-direction-column">
                    <div class="column ok-mobile-community-profile-card__post-avatar">
                        <ok-mobile-community-profile-title :community="community"></ok-mobile-community-profile-title>
                    </div>
                    <div class="column">
                        <ok-mobile-community-profile-name :community="community"></ok-mobile-community-profile-name>
                    </div>
                    <div class="column" v-if="community.description">
                        <ok-community-profile-description :community="community"></ok-community-profile-description>
                    </div>
                </div>

                <div class="ok-has-border-bottom-primary-highlight">
                    <p class="menu-label ok-has-text-primary-invert-80 has-padding-left-20 has-padding-right-20 has-padding-top-20 is-marginless">
                        {{$t('global.keywords.owner')}}
                    </p>
                    <div class="mb-10 content ok-has-text-primary-invert has-padding-top-10 has-padding-right-20 has-padding-left-20 has-padding-bottom-20">
                        <a :href="`/${CreatorInfo.username}`">
                            <div class="avatar-thumbnail">
                                <img :src="getAvatarUrl(CreatorInfo.user_avatar)" alt="Community Avatar" class="thumbnail" @error="onImageError">
                                <div class="mb-6 creator-info">
                                    <p class="username">{{ CreatorInfo.user_name }}<br>@{{ CreatorInfo.username }}<br></p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>

                <div class="columns is-mobile is-multiline is-variable is-2 is-marginless">
                    <div class="column is-narrow">
                        <ok-community-profile-visibility :community="community"></ok-community-profile-visibility>
                    </div>
                    <div class="column is-narrow">
                        <ok-mobile-community-profile-members-count :community="community"></ok-mobile-community-profile-members-count>
                    </div>
                    <div class="column is-narrow">
                        <ok-mobile-community-profile-posts-count :community="community"></ok-mobile-community-profile-posts-count>
                    </div>
                </div>
                <div class="columns is-mobile is-multiline is-variable is-2 is-marginless">
                    <div class="column is-narrow">
                        <ok-community-profile-categories :community="community"></ok-community-profile-categories>
                    </div>
                    <div class="column is-narrow">
                        <ok-community-profile-info-buttons :community="community"></ok-community-profile-info-buttons>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.avatar-thumbnail {
    height: 20%;
    width: 20%;
    max-width: 100px;
    max-height: 100px;
    text-align: center;
    word-break: break-all;
}
.thumbnail {
    object-fit: cover;
    border-radius: 8px;
}

.creator-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.username, .user-name {
    margin: 0;
    padding: 4px 0;
    font-weight: bold;
    font-size: small;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator"
import { ICommunity } from "~/models/communities/community/ICommunity";
import OkCommunityAvatar from '~/components/avatars/community-avatar/OkCommunityAvatar.vue';
import { OkAvatarSize } from '~/components/avatars/lib/OkAvatarSize';
import OkCommunityProfileDescription from '~/pages/home/pages/community/components/shared/OkCommunityProfileDescription.vue';
import OkCommunityProfileVisibility from '~/pages/home/pages/community/components/shared/OkCommunityProfileVisibility.vue';
import OkCommunityProfileActionButtons from '~/pages/home/pages/community/components/shared/OkCommunityProfileActionButtons.vue';
import OkMobileCommunityProfilePostsCount from '~/pages/home/pages/community/components/mobile-community-profile/components/mobile-community-profile-card/components/OkMobileCommunityProfilePostsCount.vue';
import OkMobileCommunityProfileMembersCount from '~/pages/home/pages/community/components/mobile-community-profile/components/mobile-community-profile-card/components/OkMobileCommunityProfileMembersCount.vue';
import OkMobileCommunityProfileTitle from '~/pages/home/pages/community/components/mobile-community-profile/components/mobile-community-profile-card/components/OkMobileCommunityProfileTitle.vue';
import OkMobileCommunityProfileName from '~/pages/home/pages/community/components/mobile-community-profile/components/mobile-community-profile-card/components/OkMobileCommunityProfileName.vue';
import OkCommunityProfileCategories from '~/pages/home/pages/community/components/shared/OkCommunityProfileCategories.vue';
import OkCommunityProfileInfoButtons from '~/pages/home/pages/community/components/shared/OkCommunityProfileInfoButtons.vue';
import { okunaContainer } from "~/services/inversify";
import { TYPES } from "~/services/inversify-types";
import { IUserService } from "~/services/user/IUserService";
import { IEnvironmentService } from '~/services/environment/IEnvironmentService';
import { ICommunityCreatorNameGetter } from 'models/communities/community/community-creator/ICommunityCreatorNameGetter';

@Component({
    name: "OkMobileCommunityProfileCard",
    components: {
        OkCommunityProfileInfoButtons,
        OkCommunityProfileCategories,
        OkMobileCommunityProfileName,
        OkMobileCommunityProfileTitle,
        OkMobileCommunityProfileMembersCount,
        OkMobileCommunityProfilePostsCount,
        OkCommunityProfileActionButtons,
        OkCommunityProfileVisibility,
        OkCommunityProfileDescription,
        OkCommunityAvatar
    },
})
export default class OkMobileCommunityProfileCard extends Vue {
    @Prop({
        type: Object,
        required: true
    }) readonly community: ICommunity;

    OkAvatarSize = OkAvatarSize;

    private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
    private environmentService: IEnvironmentService = okunaContainer.get<IEnvironmentService>(TYPES.EnvironmentService);
    public CreatorInfo: ICommunityCreatorNameGetter[] = [];
    public creatorUserName: string | null = null;

    async mounted() {
        if (this.community.name) {
            const communityCreatorInfo = await this.userService.getCommunityCreatorName({ communityName: this.community.name });
            this.CreatorInfo = communityCreatorInfo;
            const communityInfoJson = JSON.stringify(communityCreatorInfo);
            console.log(communityCreatorInfo);
        }
    }

    getAvatarUrl(avatar: string): string {
        if (!avatar) {
            return require('~/components/avatars/image-avatar/assets/avatar-fallback.jpg');
        }
        const url = `${this.environmentService.apiAppBucketUrl}/media/${avatar}`;
        return url;
    }

    onImageError(event: Event) {
        const target = event.target as HTMLImageElement;
        target.src = require('~/components/avatars/image-avatar/assets/avatar-fallback.jpg');
    }
}
</script>
