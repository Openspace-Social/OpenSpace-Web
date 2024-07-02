<template>
    <div class="ok-has-background-primary is-semi-rounded">
        <div
                class="box ok-has-background-primary-highlight is-paddingless">
            <ok-tile :onClick="openChangeEmailSettings">
                <template v-slot:leading>
                    <ok-email-icon
                            class="ok-svg-icon-primary-invert"></ok-email-icon>
                </template>

                <template v-slot:content>
                    <span class="ok-has-text-primary-invert">
                                {{$t('global.snippets.change_email')}}
                            </span>
                </template>
            </ok-tile>
            <ok-tile :onClick="openChangePasswordSettings">
                <template v-slot:leading>
                    <ok-lock-open
                            class="ok-svg-icon-primary-invert"></ok-lock-open>
                </template>

                <template v-slot:content>
                    <span class="ok-has-text-primary-invert">
                                {{$t('global.snippets.change_password')}}
                            </span>
                </template>
            </ok-tile>
            <ok-tile :onClick="openBlockedUsersModal">
                <template v-slot:leading>
                    <ok-blocked-icon
                            class="ok-svg-icon-primary-invert"></ok-blocked-icon>
                </template>

                <template v-slot:content>
                    <span class="ok-has-text-primary-invert">
                                {{$t('global.snippets.blocked_users')}}
                            </span>
                </template>
            </ok-tile>
            <ok-tile :onClick="openDeleteAccountSettings">
                <template v-slot:leading>
                    <ok-delete-icon
                        class="ok-svg-icon-primary-invert"></ok-delete-icon>
                </template>

                <template v-slot:content>
                    <span class="ok-has-text-primary-invert">
                                {{$t('global.snippets.delete_account')}}
                            </span>
                </template>
            </ok-tile>
        </div>
    </div>
</template>


<script lang="ts">
    import { Component, Vue } from "nuxt-property-decorator"
    import OkTile from "~/components/tiles/OkTile.vue";
    import { BehaviorSubject } from "~/node_modules/rxjs";
    import { IUser } from "~/models/auth/user/IUser";
    import { TYPES } from "~/services/inversify-types";
    import { IUserService } from "~/services/user/IUserService";
    import { okunaContainer } from "~/services/inversify";
    import { IModalService } from "~/services/modal/IModalService";

    @Component({
        name: "OkAccountSettings",
        components: {
            OkTile
        },
        subscriptions: function () {
            return {
                loggedInUser: this["userService"].loggedInUser
            }
        }
    })
    export default class OkAccountSettings extends Vue {

        $observables!: {
            loggedInUser: BehaviorSubject<IUser | undefined>
        };

        private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
        private modalService: IModalService = okunaContainer.get<IModalService>(TYPES.ModalService);

        openChangePasswordSettings() {
            this.modalService.openChangePasswordModal();
        }
        openChangeEmailSettings() {
            this.modalService.openChangeEmailModal();
        }

        openBlockedUsersModal() {
            this.modalService.openBlockedUsersModal();
        }

        openDeleteAccountSettings() {
            this.modalService.openDeleteAccountModal();
        }

    }
</script>
