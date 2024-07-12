<template>
    <div class="ok-has-background-primary ok-mobile-user-profile-card">
        <div class="ok-mobile-user-profile-card__content">
            <div class="has-padding-left-20 has-padding-right-20 container">
                <div class="columns is-gapless is-marginless is-mobile has-padding-bottom-10">
                    <div class="column ok-mobile-user-profile-card__avatar is-narrow">
                        <ok-user-avatar :user="user" :avatar-size="avatarSize.large"></ok-user-avatar>
                    </div>
                    <div class="column is-flex flex-direction-column align-items-flex-end">
                        <div class="has-padding-top-20 has-padding-left-20">
                            <ok-user-profile-action-buttons :user="user"></ok-user-profile-action-buttons>
                        </div>
                    </div>
                </div>
                <div class="columns is-gapless is-marginless has-padding-top-10 flex-direction-column">
                    <div class="column ok-mobile-user-profile-card__post-avatar">
                        <ok-user-profile-name :user="user"></ok-user-profile-name>
                    </div>
                    <div class="column">
                        <ok-user-profile-username :user="user"></ok-user-profile-username>
                    </div>
                    <div class="column" v-if="user.profile.bio">
                        <ok-user-profile-bio :user="user"></ok-user-profile-bio>
                    </div>
                </div>
                <div class="columns is-mobile is-multiline is-variable is-2 is-marginless">
                    <div class="column is-narrow" v-if="user.profile.location">
                        <ok-user-profile-location :user="user"></ok-user-profile-location>
                    </div>
                    <div class="column is-narrow" v-if="user.profile.url">
                        <ok-user-profile-url :user="user"></ok-user-profile-url>
                    </div>
                    <div class="column is-narrow">
                        <ok-user-profile-age :user="user"></ok-user-profile-age>
                    </div>
                </div>
                <div class="columns is-mobile is-multiline is-variable is-2 is-marginless">
                    <div class="column is-narrow" v-if="user.profile.followersCountVisible" @click="openUserFollowersModal">
                        <ok-mobile-user-profile-followers-count :user="user"></ok-mobile-user-profile-followers-count>
                    </div>
                    <div class="column is-narrow">
                        <ok-mobile-user-profile-posts-count :user="user"></ok-mobile-user-profile-posts-count>
                    </div>
                    <div class="column is-narrow" @click="openUserFollowingsModal">
                        <ok-mobile-user-profile-following-count :user="user"></ok-mobile-user-profile-following-count>
                    </div>
                </div>
                <!-- Joined Communities Section -->
                <div class="card-content">
                  <span class="ok-has-text-primary-invert">
                    <p class="p-1 mb-4">
                        {{$t('global.snippets.content_contributor')}}
                    </p>
                    <div class="joined-communities">
                      <div class="community" v-for="community in displayedCommunities" :key="community.id">
                        <a :href="`/c/${community.community_name}`">
                          <figure class="image is-square">
                            <img :src="getAvatarUrl(community.community_avatar)" alt="Community Avatar" class="thumbnail" @error="onImageError">
                          </figure>
                          <p>c/{{ community.community_name }}</p>
                        </a>
                      </div>
                    </div>
                    <button v-if="hasMoreCommunities" @click="showMore" class="more-button">
                      Show More
                    </button>
                    <button v-if="displayCount > 9" @click="showLess" class="more-button">
                      Show Less
                    </button>
                  </span>
                </div>
                <!-- End of Joined Communities Section -->
            </div>
        </div>
    </div>
</template>

<style lang="scss">
.ok-mobile-user-profile-card {
    position: relative;
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    margin-top: -20px;

    &__avatar {
        position: relative;
        top: -40px;
    }

    &__post-avatar {
        margin-top: -40px !important;
    }

    .joined-communities {
        display: flex;
        flex-wrap: wrap;
        gap: 20px; /* Adjust spacing between communities */
        margin-left: 5%;
    }

    .community {
        --columns: 3;
        flex: 1 0 calc((100% / var(--columns)) - 20px - 1px); /* Each community takes up 1/3rd of the container width */
        width: calc((100% / var(--columns))); /* Set width to 1/3rd of container width */
        max-width: calc((100% / var(--columns)) - 20px); /* Limit maximum width of each community */
        text-align: center; /* Center the text */
        word-break: break-all; /* Text wrapping */
    }

    .image.is-square {
        justify-content: center;
        width: 100%;
        margin-bottom: 8px; /* Space between image and text */
    }

    .image.is-square img.thumbnail {
        object-fit: cover;
        width: 100%; /* Ensure the image fills its container */
        height: 100%; /* Ensure the image fills its container */
        border-radius: 8px; /* Optional: Add rounded corners */
    }

    .more-buttons-container {
        display: flex;
        justify-content: space-around;
        margin: 20px auto;
    }

    .more-button {
        padding: 20px 20px;
        cursor: pointer;
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { IUser } from "~/models/auth/user/IUser";
import OkUserAvatar from '~/components/avatars/user-avatar/OkUserAvatar.vue';
import { OkAvatarSize } from '~/components/avatars/lib/OkAvatarSize';
import OkUserProfileName from '~/pages/home/pages/user/components/shared/OkUserProfileName.vue';
import OkUserProfileUsername from '~/pages/home/pages/user/components/shared/OkUserProfileUsername.vue';
import OkUserProfileBio from '~/pages/home/pages/user/components/shared/OkUserProfileBio.vue';
import OkUserProfileLocation from '~/pages/home/pages/user/components/shared/OkUserProfileLocation.vue';
import OkUserProfileUrl from '~/pages/home/pages/user/components/shared/OkUserProfileUrl.vue';
import OkUserProfileAge from '~/pages/home/pages/user/components/shared/OkUserProfileAge.vue';
import OkMobileUserProfileFollowersCount
        from '~/pages/home/pages/user/components/mobile-user-profile/components/mobile-user-profile-card/components/OkMobileUserProfileFollowersCount.vue';
    import OkMobileUserProfilePostsCount
        from '~/pages/home/pages/user/components/mobile-user-profile/components/mobile-user-profile-card/components/OkMobileUserProfilePostsCount.vue';
    import OkMobileUserProfileFollowingCount
        from '~/pages/home/pages/user/components/mobile-user-profile/components/mobile-user-profile-card/components/OkMobileUserProfileFollowingCount.vue';

import OkUserProfileActionButtons from '~/pages/home/pages/user/components/shared/OkUserProfileActionButtons.vue';
import { ICommunityMemberJoined } from '~/models/communities/community/ICommunityMemberJoined';
import { IEnvironmentService } from '~/services/environment/IEnvironmentService';
import { IUserService } from "~/services/user/IUserService";
import { TYPES } from "~/services/inversify-types";
import { okunaContainer } from "~/services/inversify";

@Component({
    name: "OkMobileUserProfileCard",
    components: {
        OkUserAvatar,
        OkUserProfileName,
        OkUserProfileUsername,
        OkUserProfileBio,
        OkUserProfileLocation,
        OkUserProfileUrl,
        OkUserProfileAge,
        OkMobileUserProfileFollowersCount,
        OkMobileUserProfilePostsCount,
        OkMobileUserProfileFollowingCount,
        OkUserProfileActionButtons,
    },
})
export default class OkMobileUserProfileCard extends Vue {
    private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
    private environmentService: IEnvironmentService = okunaContainer.get<IEnvironmentService>(TYPES.EnvironmentService);
    public joinedCommunities: ICommunityMemberJoined[] = [];
    public displayCount: number = 9;

    @Prop({
        type: Object,
        required: true
    }) readonly user!: IUser;

    async mounted() {
        if (this.user.username) {
            const communities = await this.userService.getMemberJoinedCommunities({ username: this.user.username });
            this.joinedCommunities = communities; // Assign fetched data to reactive property

            const communitiesJson = JSON.stringify(communities); // Convert to JSON string
            //console.log('Joined Communities:', communities);
        }
    }

    get displayedCommunities() {
        return this.joinedCommunities.slice(0, this.displayCount);
    }

    get hasMoreCommunities() {
        return this.displayCount < this.joinedCommunities.length;
    }

    showMore() {
        this.displayCount += 9;
    }

    showLess() {
        this.displayCount = 9;
    }

    get avatarSize() {
        return OkAvatarSize || { large: 100 }; // Provide a fallback size if OkAvatarSize is undefined
    }

    getAvatarUrl(avatar: string): string {
        if (!avatar) {
            return require('~/components/avatars/image-avatar/assets/avatar-fallback.jpg');
        }
        const url = `${this.environmentService.apiAppBucketUrl}/media/${avatar}`;
//        console.log('Generated Avatar URL:', url);
        return url;
    }

    onImageError(event: Event) {
        (event.target as HTMLImageElement).src = require('~/components/avatars/image-avatar/assets/avatar-fallback.jpg');
    }

    openUserFollowersModal() {
        this.$emit('open-user-followers-modal', this.user);
    }

    openUserFollowingsModal() {
        this.$emit('open-user-followings-modal', this.user);
    }
}
</script>
