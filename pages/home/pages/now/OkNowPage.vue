<template>
    <div class="is-flex flex-column align-items-center ok-now-page" v-if="loggedInUser && environmentResolution">
        <ok-mobile-header
                v-if="environmentResolution === EnvironmentResolution.mobile">
            <div class="columns is-paddingless is-mobile is-marginless has-width-100-percent">
                <div class="column is-narrow is-flex justify-center align-items-center has-padding-left-20">
                    <ok-search-icon class="ok-svg-icon-primary-invert is-icon-2x"></ok-search-icon>
                </div>
                <div class="column">
                    <div class="field">
                        <label for="search" class="label has-text-left ok-has-text-primary-invert-80 is-hidden">
                            {{$t('')}}
                        </label>
                        <div class="control has-icons-left ok-header-search-bar">
                            <input type="text" placeholder="Search"
                                   class="input is-rounded is-normal ok-input"
                                   required
                                   id="search"
                                   v-model="searchQuery"
                            >
                        </div>
                    </div>
                </div>
            </div>
        </ok-mobile-header>
        <div class="ok-now-page-content">

<div :class="['ok-left-section', { minimized: isMinimized, 'ok-has-background-primary': true }]">
    <button class="toggle-btn ok-has-background-primary" @click="toggleSidebar">
      <template v-if="isMinimized">
        <ok-plus-icon class="ok-svg-icon-primary-invert is-icon-1x"></ok-plus-icon>
      </template>
      <template v-else>
        <ok-close-icon class="ok-svg-icon-primary-invert is-icon-1x"></ok-close-icon>
      </template>
    </button>
    <p class="p-6 mb-4 ok-has-text-primary-invert-80" v-if="!isMinimized">
      {{$t('global.snippets.my_joined_communities')}}
    </p>
    <div v-if="!isMinimized">
        <ul class="community-list">
            <li v-for="community in joinedCommunities" :key="community.id" class="community-item">
                <a :href="`/c/${community.name}`">
                    <img :src="getAvatarUrl(community.avatar)" @error="onImageError" class="community-avatar">
                    <span class="community-name">{{ community.name }}</span>
                </a>
            </li>
        </ul>
    </div>
  </div>

            <div class="ok-now-page-content-scroll-container" id="ok-now-page-scroll-container">
                <keep-alive>
                    <ok-search class="ok-now-page-content-search ok-has-background-primary"
                               :initial-search-query="searchQuery"
                               v-if="searchQuery"
                               ref="okSearch">
                    </ok-search>
                    <b-tabs v-else position="is-centered" @change="onTabChange" class="ok-now-page-content-tabs"
                            v-model="activeTab"
                            type="is-toggle-rounded"
                            ref="tabs">
                        <b-tab-item>
                            <template slot="header">
                                <div class="is-flex align-items-center ok-now-page-tab-header">
                                    <ok-home-icon class="ok-svg-icon-primary-invert is-icon-2x"></ok-home-icon>
                                    <span class="not-on-phone has-padding-left-10"> {{$t('global.keywords.home')}} </span>
                                </div>
                            </template>
                            <ok-timeline-page
                                class=""
                                ref=timelinePostsStream
                                post-container-class="has-padding-bottom-30-tablet has-padding-left-30-tablet"
                            ></ok-timeline-page>
                        </b-tab-item>
                        <b-tab-item>
                            <template slot="header">
                                <div class="is-flex align-items-center ok-now-page-tab-header">
                                    <ok-trending-icon class="ok-svg-icon-primary-invert is-icon-2x"></ok-trending-icon>
                                    <span class="not-on-phone has-padding-left-10"> {{$t('global.keywords.trending')}} </span>
                                </div>
                            </template>
                            <ok-trending-posts-stream
                                    class="has-padding-top-30-tablet"
                                    ref=trendingPostsStream
                                    post-container-class="has-padding-bottom-30-tablet has-padding-right-30-tablet has-padding-left-30-tablet"
                                    v-if="shouldTrendingTabRender"
                            ></ok-trending-posts-stream>
                        </b-tab-item>
                        <b-tab-item>
                            <template slot="header">
                                <div class="is-flex align-items-center ok-now-page-tab-header">
                                    <ok-public-visibility-icon class="ok-svg-icon-primary-invert is-icon-2x"></ok-public-visibility-icon>
                                    <span class="not-on-phone has-padding-left-10"> {{$t('global.keywords.public')}} </span>
                                </div>
                            </template>
                            <ok-public-posts-stream
                                class="has-padding-top-30-tablet"
                                ref=publicPostsStream
                                post-container-class="has-padding-bottom-30-tablet has-padding-right-30-tablet has-padding-left-30-tablet"
                                v-if="shouldPublicTabRender"
                            ></ok-public-posts-stream>
                        </b-tab-item>
                        <b-tab-item>
                            <template slot="header">
                                <div class="is-flex align-items-center ok-now-page-tab-header">
                                    <ok-explore-icon class="ok-svg-icon-primary-invert is-icon-2x"></ok-explore-icon>
                                    <span class="not-on-phone has-padding-left-10"> {{$t('global.keywords.explore')}}</span>
                                </div>
                            </template>
                            <ok-top-posts-stream
                                    class="has-padding-top-30-tablet"
                                    ref="topPostsStream"
                                    post-container-class="has-padding-bottom-30-tablet has-padding-right-30-tablet has-padding-left-30-tablet"
                                    v-if="shouldTopTabRender"
                            ></ok-top-posts-stream>
                        </b-tab-item>
                    </b-tabs>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<style lang="scss">

    .ok-now-page {
        .b-tabs {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    }
    .not-on-phone {
        @include for-size(phone-only) {
            display: none;
        }
    }

    .ok-now-page-content {
        position: relative;
        flex: 1;
        width: 100%;
        height: 100%;
        overflow-y: auto;
    }

    .ok-now-page-content-scroll-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow-x: hidden;
    }

    .ok-left-section {
      position: absolute;
      top: 0;
      left: 0;
      width: 20%;
      height: 100%;
      background-color: #ffffff;
      transition: width 0.3s ease;
      z-index: 2;
    }

    .ok-left-section.minimized {
      width: 2%;
    }

    .toggle-btn {
      position: absolute;
      padding: 15px;
      top: 10px;
      right: -30px;
      background: #ffffff;
      border: none;
      border-radius: 25%;
      cursor: pointer;
      outline: none;
      z-index: 2;
    }

    .community-list {
        list-style-type: none;
        padding: 15px;
        margin: 0;
    }

    .community-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .community-avatar {
        width: 40px;
        height: 40px;
        border-radius: 25%;
        margin-right: 10px;
    }

    .community-name {
        font-size: 16px;
        font-weight: bold;
    }

    .ok-now-page-content-search {
        min-height: 100%;

        .tabs {
            width: 100%;
        }

        .tab-content {
            width: 100%;
        }
    }

    .ok-now-page-content-tabs {
        .tab-content {
            padding: 0 !important;
        }

        .tabs {
            padding-top: 30px;
            padding-left: 30px;
            padding-right: 30px;


            ul {
                li {
                    width: 50%;
                }
            }

            @include for-size(phone-only) {
                padding-bottom: 30px;
            }
        }
    }

    .ok-now-page-tab-header {
        height: 40px;
        padding-left: 15px;
        padding-right: 15px;

    }
</style>

<script lang="ts">
    import { Component, Vue, Watch } from "nuxt-property-decorator";
    import { TYPES } from "~/services/inversify-types";
    import { okunaContainer } from "~/services/inversify";
    import { BehaviorSubject } from "rxjs";
    import { IUserService } from "~/services/user/IUserService";
    import { IUser } from "~/models/auth/user/IUser";
    import { ICommunity } from "~/models/communities/community/ICommunity";
    import OkTrendingPostsStream from "~/components/posts-stream/OkTrendingPostsStream.vue";
    import OkTopPostsStream from "~/components/posts-stream/OkTopPostsStream.vue";
    import OkMobileHeader from "~/components/mobile-only/OkMobileHeader.vue";
    import { EnvironmentResolution } from "~/services/environment/lib/EnvironmentResolution";
    import { IEnvironmentService } from "~/services/environment/IEnvironmentService";
    import OkSearch from "~/components/search/OkSearch.vue";
    import OkPostsStream from "~/components/posts-stream/OkPostsStream.vue";
    import OkPublicPostsStream from "~/components/posts-stream/OkPublicPostsStream.vue";
    import OkTimelinePage from "~/pages/home/pages/timeline/OkTimelinePage.vue";

    @Component({
      name: "OkNowNowPage",
      components: {
        OkTimelinePage,
        OkPublicPostsStream,
        OkSearch,
        OkMobileHeader,
        OkTrendingPostsStream,
        OkTopPostsStream
      },
      subscriptions: function () {
        return {
          loggedInUser: this["userService"].loggedInUser,
          environmentResolution: this["environmentService"].environmentResolution,
        }
      }
    })

    export default class OkExplorePage extends Vue {
      EnvironmentResolution = EnvironmentResolution;
      private environmentService: IEnvironmentService = okunaContainer.get<IEnvironmentService>(TYPES.EnvironmentService);
      private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
      public joinedCommunities: ICommunity[] = [];

      shouldTopTabRender = false;
      shouldPublicTabRender = false;
      shouldTrendingTabRender = false;

      searchQuery = "";
      searchIsOpen = false;

      scrollPosition = 0;
      activeTab = 0;

      private scrollContainer: HTMLElement = null;
      private nowButton: HTMLElement = null;
      private scrollToTopEventRemover;


      async mounted() {
            try {
                const communities = await this.userService.getJoinedCommunities();
                this.joinedCommunities = communities; // Assign fetched data to reactive property

                console.log('Communities fetched successfully:', communities); // Log the actual array
            } catch (error) {
                console.error('Failed to fetch joined communities:', error);
            }
      }

      getAvatarUrl(avatar: string): string {
        if (!avatar) {
          return require('~/components/avatars/image-avatar/assets/avatar-fallback.jpg');
        }
        return avatar;
      }

      onImageError(event: Event) {
        const target = event.target as HTMLImageElement;
        target.src = require('~/components/avatars/image-avatar/assets/avatar-fallback.jpg');
      }

      $route!: any;

      isMinimized: boolean = false;

      toggleSidebar() {
        this.isMinimized = !this.isMinimized;
      }

      $observables!: {
        environmentResolution: BehaviorSubject<EnvironmentResolution | undefined>,
        loggedInUser: BehaviorSubject<IUser | undefined>
      };

      $refs!: {
        okSearch: OkSearch,
        timelinePostsStream: OkPostsStream,
        topPostsStream: OkPostsStream,
        trendingPostsStream: OkPostsStream,
        publicPostsStream: OkPostsStream,
        tabs: any,
      };




      destroyed() {
        if (this.scrollToTopEventRemover) this.scrollToTopEventRemover();
      }

      onWantsToScrollToTop() {
        if (this.$route.name === "now") {
          const currentScrollTop = this.getScrollContainer().scrollTop;

          if (currentScrollTop === 0) {
            this.getActivePostsStream().refresh();
          } else {
            this.$scrollTo(this.$refs.tabs.$el, 300, {
              container: this.getScrollContainer()
            });
          }
        }
      }

      @Watch("$route")
      onRouteChanged(to: any, from: any) {
        if (from.name === "now") {
          this.scrollPosition = this.getScrollContainer().scrollTop;
        } else if (to.name === "now") {
          setTimeout(() => {
            if (this.scrollPosition) {
              this.getScrollContainer().scrollTop = this.scrollPosition;
            }
          }, 100);
        }
      }

      onTabChange(idx: number) {
        if (idx === 1) {
          this.shouldTrendingTabRender = true;
        }
        if (idx === 2) {
          this.shouldPublicTabRender = true;
        }
        if (idx === 3) {
          this.shouldTopTabRender = true;
        }
      }

      @Watch("searchQuery")
      onSearchQueryChanged(val: string, oldVal: string) {
        if (!this.$refs.okSearch) {
          this.$nextTick(() => this.onSearchQueryChanged(val, oldVal));
        } else {
          if (val) {
            this.searchIsOpen = true;
            this.$refs.okSearch.searchWithQuery(val);
          } else {
            this.$refs.okSearch.clearSearch();
          }
        }
      }

      getScrollContainer() {
        if (this.scrollContainer) return this.scrollContainer;

        return this.scrollContainer = document.querySelector("#ok-now-page-scroll-container");
      }

      getNowButton() {
        if (this.nowButton) return this.nowButton;

        return this.nowButton = document.querySelector("#now-button");
      }

      getActivePostsStream() {
        if (this.activeTab === 0) return this.$refs.timelinePostsStream;
        if (this.activeTab === 1) return this.$refs.trendingPostsStream;
        if (this.activeTab === 2) return this.$refs.publicPostsStream;
        return this.$refs.topPostsStream;
      }
    }
</script>



