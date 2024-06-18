<template>
    <div class="is-flex justify-center align-items-center" >
        <div class="ok-has-background-primary is-semi-rounded">
            <div class="box ok-has-background-primary-highlight">
                <h2 class="is-size-5 has-padding-bottom-10 ok-has-text-primary-invert has-text-weight-bold">
                    {{ $t('components.support_and_feedback.support_and_feedback')}}
                </h2>
            </div>
            <ok-tile v-if="loggedInUser" :onClick="coffeeLink">
                <template v-slot:leading>
                    <ok-invites-icon
                            class="ok-svg-icon-primary-invert"></ok-invites-icon>
                </template>

                <template v-slot:content>
                    <span class="ok-has-text-primary-invert">
                                {{$t('global.snippets.buy_us_coffee')}}
                            </span>
                </template>
            </ok-tile>
            <ok-tile :onClick="cannyLink">
                <template v-slot:leading>
                    <ok-developer-icon
                            class="ok-svg-icon-primary-invert"></ok-developer-icon>
                </template>

                <template v-slot:content>
                    <span class="ok-has-text-primary-invert">
                                {{$t('global.snippets.feature_and_bugs')}}
                            </span>
                </template>
            </ok-tile>
            <ok-tile :onClick="docsLink">
                <template v-slot:leading>
                    <ok-lists-icon
                            class="ok-svg-icon-primary-invert"></ok-lists-icon>
                </template>

                <template v-slot:content>
                    <span class="ok-has-text-primary-invert">
                                {{$t('global.snippets.openspace_docs')}}
                            </span>
                </template>
            </ok-tile>
            <ok-tile :onClick="contactLink">
                <template v-slot:leading>
                    <ok-email-icon
                            class="ok-svg-icon-primary-invert"></ok-email-icon>
                </template>

                <template v-slot:content>
                    <span class="ok-has-text-primary-invert">
                                {{$t('global.snippets.contact_us')}}
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
    import { SupportFeedbackModalParams } from "~/services/modal/IModalService";

    @Component({
        name: "OkSupportFeedback",
        components: {
            OkTile
        },
        subscriptions: function () {
            return {
                loggedInUser: this["userService"].loggedInUser
            }
        }
    })


    export default class OkSupportFeedbackModal extends Vue {

        $observables!: {
            loggedInUser: BehaviorSubject<IUser | undefined>
        };

        private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);

        @Prop({
            type: Object,
            required: true
        }) readonly params: SupportFeedbackModalParams;

        onClosePressed() {
            this.$parent["close"]();
        }

        coffeeLink() {
            window.open("https://buymeacoffee.com/openspace.social");
        }

        cannyLink() {
            window.open("https://openspacesocial.canny.io/feature-requests");
        }

        docsLink() {
            window.open("https://docs.openspace.social");
        }

        contactLink() {
            window.open("https://openspace.social/general/contact-us");
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
