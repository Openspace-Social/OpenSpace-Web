<template>
    <button
            :disabled="requestInProgress"
            @click="onClicked"
            class="button is-rounded ok-has-background-accent has-text-white has-text-weight-bold"
            :class="extraClasses">
        {{ buttonText }}
    </button>
</template>

<style lang="scss">

</style>

<script lang="ts">
    import { Component, Prop, Vue } from "nuxt-property-decorator"
    import { IUser } from "~/models/auth/user/IUser";
    import { CancelableOperation } from "~/lib/CancelableOperation";
    import { IUserService } from "~/services/user/IUserService";
    import { okunaContainer } from "~/services/inversify";
    import { TYPES } from "~/services/inversify-types";
    import { IUtilsService } from "~/services/utils/IUtilsService";
    import { UserVisibility } from "~/models/auth/user/lib/UserVisibility";
    import { ILocalizationService } from "~/services/localization/ILocalizationService";
    import { OkFollowButtonSize } from '~/components/buttons/lib/OkFollowButtonSize';

    enum OkBlockButtonType {
        block,
        unblock
    }

    @Component({
        name: "OkBlockButton",
        components: {},
    })
    export default class OkBlockButton extends Vue {

        @Prop({
            type: Object,
            required: true
        }) readonly user: IUser;

        @Prop({
            type: Number,
            required: false,
            default: OkFollowButtonSize.normal
        }) readonly buttonSize: OkFollowButtonSize;

        requestInProgress = false;

        private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
        private utilsService: IUtilsService = okunaContainer.get<IUtilsService>(TYPES.UtilsService);
        private localizationService: ILocalizationService = okunaContainer.get<ILocalizationService>(TYPES.LocalizationService);
        private requestOperation?: CancelableOperation<any>;


        get buttonType(): OkBlockButtonType {
            return OkBlockButtonType.unblock;
            // if (this.user.isBlocked) {
            //     return OkBlockButtonType.unblock;
            // } else {
            //     return OkBlockButtonType.block;
            // }
        }

        get buttonText() {
            switch (this.buttonType) {
                case OkBlockButtonType.unblock:
                    return this.localizationService.localize("global.keywords.unblock");
                case OkBlockButtonType.block:
                    return this.localizationService.localize("global.keywords.block");
            }
        }

        get extraClasses() {
            switch (this.buttonSize) {
                case OkFollowButtonSize.normal:
                    return '';
                case OkFollowButtonSize.small:
                    return 'has-padding-10 is-size-7';
            }
        }

        onClicked() {
            switch (this.buttonType) {
                case OkBlockButtonType.block:
                    this.blockUser();
                    return;
                case OkBlockButtonType.unblock:
                    this.unblockUser();
                    return;
            }
        }

        private async blockUser() {
            if (this.requestInProgress) return;
            this.requestInProgress = true;


            try {
                this.requestOperation = CancelableOperation.fromPromise(this.userService.blockUser({
                    user: this.user
                }));

                await this.requestOperation.value;

                this.$emit('refresh')
            } catch (error) {
                this.utilsService.handleErrorWithToast(error);
            } finally {
                this.requestOperation = null;
                this.requestInProgress = false;
            }
        }

        private async unblockUser() {
            if (this.requestInProgress) return;
            this.requestInProgress = true;

            try {
                this.requestOperation = CancelableOperation.fromPromise(this.userService.unblockUser({
                    user: this.user
                }));

                await this.requestOperation.value;

                this.$emit('refresh')
            } catch (error) {
                this.utilsService.handleErrorWithToast(error);
            } finally {
                this.requestOperation = null;
                this.requestInProgress = false;
            }
        }


    }
</script>
