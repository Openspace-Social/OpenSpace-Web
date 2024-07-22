<template>
    <div class="card ok-has-background-primary ok-desktop-community-profile-sidebar">
        <div class="card-header ok-has-border-bottom-primary-highlight" v-if="headerVisible">
            <div class="columns has-padding-left-20 has-padding-right-20 has-padding-top-10 has-padding-bottom-10 has-width-100-percent is-marginless">
                <div class="column is-narrow is-flex align-items-center">
                    <ok-community-avatar :community="community"></ok-community-avatar>
                </div>
                <div class="column">
                    <div class="columns is-gapless is-marginless flex-direction-column">
                        <div class="column">
                            <ok-mobile-community-profile-title :community="community"></ok-mobile-community-profile-title>
                        </div>
                        <div class="column">
                            <ok-mobile-community-profile-name :community="community"></ok-mobile-community-profile-name>
                        </div>
                    </div>
                </div>
                <div class="column is-narrow">
                    <ok-community-profile-action-buttons :community="community"></ok-community-profile-action-buttons>
                </div>
            </div>
        </div>
        <div class="ok-has-border-bottom-primary-highlight">
            <p class="menu-label ok-has-text-primary-invert-80 has-padding-left-20 has-padding-right-20 has-padding-top-20 is-marginless">
                {{$t('global.keywords.owner')}}
            </p>
            <div class="content ok-has-text-primary-invert has-padding-top-10 has-padding-right-20 has-padding-left-20 has-padding-bottom-20">
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
        <div :class="{'ok-has-border-bottom-primary-highlight': community.description}">
            <p class="menu-label ok-has-text-primary-invert-80 has-padding-left-20 has-padding-right-20 has-padding-top-20 is-marginless">
                {{$t('global.keywords.about')}}
            </p>
            <div v-if="community.description" class="content ok-has-text-primary-invert has-padding-top-10 has-padding-right-20 has-padding-left-20 has-padding-bottom-20">
                <ok-smart-text :text="community.description"></ok-smart-text>
            </div>
        </div>
        <div class="card-content ok-has-border-bottom-primary-highlight">
            <div class="columns is-mobile flex-direction-column is-variable is-3 is-marginless">
                <div class="column">
                    <ok-community-profile-visibility :community="community"></ok-community-profile-visibility>
                </div>
                <div class="column">
                    <ok-community-profile-categories :community="community"></ok-community-profile-categories>
                </div>
            </div>
        </div>
        <div class="card-footer">
            <div class="has-padding-left-10">
                <ok-community-profile-info-buttons :community="community"></ok-community-profile-info-buttons>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

.avatar-thumbnail {
    height: 30%;
    width: 30%;
    max-width: 150px;
    max-height: 150px;
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
}

</style>


<script lang="ts">
    import { Component, Prop, Vue } from "nuxt-property-decorator"
    import { ICommunity } from "~/models/communities/community/ICommunity";
    import { IEnvironmentService } from '~/services/environment/IEnvironmentService';
    import { ICommunityCreatorNameGetter } from 'models/communities/community/community-creator/ICommunityCreatorNameGetter';
    import OkSmartText from '~/components/smart-text/OkSmartText.vue';
    import OkCommunityProfileVisibility
        from '~/pages/home/pages/community/components/shared/OkCommunityProfileVisibility.vue';
    import OkCommunityProfileCategories
        from '~/pages/home/pages/community/components/shared/OkCommunityProfileCategories.vue';
    import OkCommunityAvatar from '~/components/avatars/community-avatar/OkCommunityAvatar.vue';
    import OkJoinCommunityButton from '~/components/buttons/OkJoinCommunityButton.vue';
    import OkCommunityProfileActionButtons
        from '~/pages/home/pages/community/components/shared/OkCommunityProfileActionButtons.vue';
    import OkMobileCommunityProfileTitle
        from '~/pages/home/pages/community/components/mobile-community-profile/components/mobile-community-profile-card/components/OkMobileCommunityProfileTitle.vue';
    import OkMobileCommunityProfileName
        from '~/pages/home/pages/community/components/mobile-community-profile/components/mobile-community-profile-card/components/OkMobileCommunityProfileName.vue';
    import OkCommunityProfileInfoButtons
        from '~/pages/home/pages/community/components/shared/OkCommunityProfileInfoButtons.vue';
    import { okunaContainer } from "~/services/inversify";
    import { TYPES } from "~/services/inversify-types";
    import { IUserService } from "~/services/user/IUserService";


    @Component({
        name: "OkDesktopCommunityProfileSidebar",
        components: {
            OkCommunityProfileInfoButtons,
            OkMobileCommunityProfileName,
            OkMobileCommunityProfileTitle,
            OkCommunityProfileActionButtons,
            OkJoinCommunityButton,
            OkCommunityAvatar,
            OkCommunityProfileCategories,
            OkCommunityProfileVisibility,
            OkSmartText,
        },
    })
    export default class OkDesktopCommunityProfileSidebar extends Vue {
        @Prop({
            type: Object,
            required: true
        }) readonly community: ICommunity;

        @Prop({
            type: Boolean,
            required: true
        }) readonly headerVisible: boolean;

        private environmentService: IEnvironmentService = okunaContainer.get<IEnvironmentService>(TYPES.EnvironmentService);
        private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
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
            //console.error('Image failed to load:', target.src);
        }

    }
</script>



