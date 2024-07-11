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
                <figure class="image is-square">
                  <img :src="getAvatarUrl(community.community_avatar)" alt="Community Avatar" class="thumbnail" @error="onImageError" @load="onImageLoad">
                </figure>
                <p>c/{{ community.community_name }}</p>
              </div>
            </div>
            <button v-if="hasMoreCommunities" @click="toggleShowAll" class="more-button">
              {{ showAll ? 'Show Less' : 'Show More' }}
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
    gap: 64px; /* Adjust spacing as needed */
    margin-left: 5%;
}

.community {
    display: flex;
    flex-direction: column;
    align-items: center; /* Center items horizontally */
    width: 64px; /* Ensure consistent width */
    text-align: center; /* Center the text */
}

.image.is-square {
    justify-content: center;
    width: 100%;
    margin-bottom: 8px; /* Space between image and text */
}

.image.is-square img.thumbnail {
    object-fit: cover;
    width: 64px;
    height: 64px;
    border-radius: 8px; /* Optional: Add rounded corners */
}

.more-button {
      display: block;
      margin: 20px auto;
      padding: 10px 20px;
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
        public showAll: boolean = false;

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
              this.joinedCommunities = communities; // Assign fetched data to reactive property

              const communitiesJson = JSON.stringify(communities); // Convert to JSON string
              console.log('Joined Communities:', communities);
          }
        }

        get displayedCommunities() {
          return this.showAll ? this.joinedCommunities : this.joinedCommunities.slice(0, 9);
        }

        get hasMoreCommunities() {
          return this.joinedCommunities.length > 9;
        }

        toggleShowAll() {
          this.showAll = !this.showAll;
        }

        getAvatarUrl(avatar: string): string {
          if (avatar === "") {
              return require('~/components/avatars/image-avatar/assets/avatar-fallback.jpg');
          }
          return `${this.environmentService.contentProxyUrl}/media/${avatar}/`;
        }

        onImageError(event: Event) {
          const target = event.target as HTMLImageElement;
          target.src = '/path/to/fallback/image.png'; // Provide a path to a fallback image
          console.error('Image failed to load:', target.src);
        }

        onImageLoad(event: Event) {
          console.log('Image loaded successfully:', (event.target as HTMLImageElement).src);
        }
    }
</script>





