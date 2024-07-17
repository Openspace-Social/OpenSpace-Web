<template>
    <div class="card ok-has-background-primary ok-desktop-user-profile-sidebar">
        <div class="card-header ok-has-border-bottom-primary-highlight" v-if="headerVisible">
            <div class="columns has-padding-left-20 has-padding-right-20 has-padding-top-10 has-padding-bottom-10 has-width-100-percent is-marginless">
                <div class="column is-narrow is-flex align-items-center">
                    <ok-user-avatar :user="user"></ok-user-avatar>
                </div>
                <div class="column">
                    <div class="columns is-gapless is-marginless flex-direction-column">
                        <div class="column">
                            <ok-user-profile-name :user="user"></ok-user-profile-name>
                        </div>
                        <div class="column">
                            <ok-user-profile-username :user="user"></ok-user-profile-username>
                        </div>
                    </div>
                </div>
                <div class="column is-narrow">
                    <ok-user-profile-action-buttons :user="user"></ok-user-profile-action-buttons>
                </div>
            </div>
        </div>
        <div :class="{'ok-has-border-bottom-primary-highlight': user.profile.bio}">
            <p class="menu-label ok-has-text-primary-invert-80 has-padding-left-20 has-padding-right-20 has-padding-top-20 is-marginless">
                {{$t('global.keywords.about')}}
            </p>
            <div v-if="user.profile.bio" class="content ok-has-text-primary-invert has-padding-top-10 has-padding-right-20 has-padding-left-20 has-padding-bottom-20">
                <ok-smart-text :text="user.profile.bio"></ok-smart-text>
            </div>
        </div>
        <div :class="{'ok-has-border-bottom-primary-highlight': user.profile.bio}">
            <div class="card-content has-padding-5">
                <div class="columns is-mobile is-multiline is-variable is-3 is-marginless">
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
            </div>
        </div>
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
    </div>
</template>

<style lang="scss">
.ok-desktop-user-profile-sidebar {
    max-height: 85vh; /* Ensure the sidebar does not extend beyond the viewport height */
    overflow-y: auto; /* Make the sidebar scrollable */
    padding-bottom: 5%; /* Ensure the content stays within 5% margin from the bottom */
}

.content-contributor-text {
    padding: 5px;
}

.card-content.has-padding-5 {
    padding-bottom: 5%; /* Add 5% padding at the bottom */
}

.joined-communities {
    display: flex;
    flex-wrap: wrap;
    gap: 20px; /* Adjust spacing between communities */
    margin-left: 5%;
}

.community {
    --columns: 3;
    flex: 1 0 calc((100% / var(--columns)) - 20px - 1px); /* Each community takes up to 1/3rd of the container width */
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
</style>


<script lang="ts">
    import { Component, Prop, Vue } from "nuxt-property-decorator";
    import { IUser } from "~/models/auth/user/IUser";
    import { IEnvironmentService } from '~/services/environment/IEnvironmentService';
    import { ICommunityMemberJoined } from '~/models/communities/community/ICommunityMemberJoined';
    import { TYPES } from "~/services/inversify-types";
    import { IUserService } from "~/services/user/IUserService";
    import { okunaContainer } from "~/services/inversify";
    import OkDesktopUserProfileSidebarDetails
        from "~/pages/home/pages/user/components/desktop-user-profile/components/desktop-user-profile-sidebar/components/OkDesktopUserProfileSidebarDetails.vue";
    import OkDesktopUserProfileSidebarActions
        from '~/pages/home/pages/user/components/desktop-user-profile/components/desktop-user-profile-sidebar/components/OkDesktopUserProfileSidebarActions.vue';
    import OkSmartText from '~/components/smart-text/OkSmartText.vue';
    import OkUserProfileLocation from '~/pages/home/pages/user/components/shared/OkUserProfileLocation.vue';
    import OkUserProfileUrl from '~/pages/home/pages/user/components/shared/OkUserProfileUrl.vue';
    import OkUserProfileAge from '~/pages/home/pages/user/components/shared/OkUserProfileAge.vue';
    import OkUserAvatar from '~/components/avatars/user-avatar/OkUserAvatar.vue';
    import OkUserProfileName from '~/pages/home/pages/user/components/shared/OkUserProfileName.vue';
    import OkUserProfileUsername from '~/pages/home/pages/user/components/shared/OkUserProfileUsername.vue';
    import OkUserProfileActionButtons from '~/pages/home/pages/user/components/shared/OkUserProfileActionButtons.vue';

    @Component({
        name: "OkDesktopUserProfileSidebar",
        components: {
            OkUserProfileActionButtons,
            OkUserProfileUsername,
            OkUserProfileName,
            OkUserAvatar,
            OkUserProfileAge,
            OkUserProfileUrl,
            OkUserProfileLocation,
            OkSmartText,
        },
    })

    export default class OkDesktopUserProfileSidebar extends Vue {
        private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
        private environmentService: IEnvironmentService = okunaContainer.get<IEnvironmentService>(TYPES.EnvironmentService);
        public joinedCommunities: ICommunityMemberJoined[] = [];
        public displayCount: number = 9;

        @Prop({
            type: Object,
            required: true
        }) readonly user!: IUser;

        @Prop({
            type: Boolean,
            required: true
        }) readonly headerVisible!: boolean;

        async mounted() {
            if (this.user.username) {
                const communities = await this.userService.getMemberJoinedCommunities({ username: this.user.username });
                this.joinedCommunities = communities;
                const communitiesJson = JSON.stringify(communities);
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
