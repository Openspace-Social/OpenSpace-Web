<template>
    <div class="is-flex justify-center align-items-center" >
        <div class="ok-has-background-primary is-semi-rounded">
            <div class="box ok-has-background-primary-highlight">
                <h2 class="is-size-5 has-padding-bottom-10 ok-has-text-primary-invert has-text-weight-bold">
                    {{ $t('components.useful_link.useful_link')}}
                </h2>
            </div>
            <ok-tile v-if="loggedInUser" :onClick="howToPost">
                <template v-slot:leading>
                    <ok-plus-icon
                            class="ok-svg-icon-primary-invert"></ok-plus-icon>
                </template>

                <template v-slot:content>
                    <span class="ok-has-text-primary-invert">
                                {{$t('global.snippets.how_to_post')}}
                            </span>
                </template>
            </ok-tile>
            <ok-tile :onClick="howToCommunities">
                <template v-slot:leading>
                    <ok-communities-icon
                            class="ok-svg-icon-primary-invert"></ok-communities-icon>
                </template>

                <template v-slot:content>
                    <span class="ok-has-text-primary-invert">
                                {{$t('global.snippets.how_to_communities')}}
                            </span>
                </template>
            </ok-tile>
            <ok-tile :onClick="howToFollowersConnections">
                <template v-slot:leading>
                    <ok-followers-icon
                            class="ok-svg-icon-primary-invert"></ok-followers-icon>
                </template>

                <template v-slot:content>
                    <span class="ok-has-text-primary-invert">
                                {{$t('global.snippets.how_to_followers_vs_connections')}}
                            </span>
                </template>
            </ok-tile>
            <ok-tile :onClick="howToListsCircles">
                <template v-slot:leading>
                    <ok-circles-icon
                            class="ok-svg-icon-primary-invert"></ok-circles-icon>
                </template>

                <template v-slot:content>
                    <span class="ok-has-text-primary-invert">
                                {{$t('global.snippets.how_to_lists_and_circles')}}
                            </span>
                </template>
            </ok-tile>
            <ok-tile :onClick="howToProfileOptions">
                <template v-slot:leading>
                    <ok-profile-icon
                            class="ok-svg-icon-primary-invert"></ok-profile-icon>
                </template>

                <template v-slot:content>
                    <span class="ok-has-text-primary-invert">
                                {{$t('global.snippets.how_to_profile_options')}}
                            </span>
                </template>
            </ok-tile>
            <ok-tile :onClick="howToLearnMore">
                <template v-slot:leading>
                    <ok-more-vertical
                            class="ok-svg-icon-primary-invert"></ok-more-vertical>
                </template>

                <template v-slot:content>
                    <span class="ok-has-text-primary-invert">
                                {{$t('global.snippets.how_to_learn_more')}}
                            </span>
                </template>
            </ok-tile>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "nuxt-property-decorator";
    import OkTile from "~/components/tiles/OkTile.vue";
    import { BehaviorSubject } from "rxjs";
    import { okunaContainer } from "~/services/inversify";
    import { TYPES } from "~/services/inversify-types";
    import { IUserService } from "~/services/user/IUserService";
    import { IUser } from "~/models/auth/user/IUser";
    import { UsefulLinksModalParams } from "~/services/modal/IModalService";

    @Component({
        name: "OkUsefulLinks",
        components: {
            OkTile
        },
        subscriptions: function () {
            return {
                loggedInUser: this["userService"].loggedInUser
            }
        }
    })


    export default class OkUsefulLinksModal extends Vue {

        $observables!: {
            loggedInUser: BehaviorSubject<IUser | undefined>
        };

        private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);

        @Prop({
            type: Object,
            required: true
        }) readonly params: UsefulLinksModalParams;

        onClosePressed() {
            this.$parent["close"]();
        }

        howToPost() {
            window.open("https://docs.openspace.social/docs-page#item-1-1");
        }

        howToCommunities() {
            window.open("https://docs.openspace.social/docs-page#item-1-2");
        }

        howToFollowersConnections() {
            window.open("https://docs.openspace.social/docs-page#item-1-10");
        }

        howToListsCircles() {
            window.open("https://docs.openspace.social/docs-page#item-1-11");
        }

        howToProfileOptions() {
            window.open("https://docs.openspace.social/docs-page#item-1-12");
        }

        howToLearnMore() {
            window.open("https://docs.openspace.social/docs-page#section-1");
        }
    }
</script>

<style lang="scss">
    .ok-themes-wrapper {
        cursor: pointer;
        width: 100px;
    }

    .ok-theme-circle {
        width: 40px;
        height: 40px;
        font-size: 0;
        border-radius: 100%;
        overflow: hidden;
        transform: rotate(-45deg);
        border: 3px solid transparent;
        margin: 0 auto;

        .primary, .accent-gradient {
            width: 50%;
            height: 40px;
            display: inline-block;
        }

        &.ok-has-border-accent {
            border-width: 3px !important;
        }
    }
</style>
