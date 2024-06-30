<template>
    <div class="ok-has-background-primary is-semi-rounded">
        <div class="box ok-has-background-primary-highlight is-paddingless">
            <form @submit="handleFormSubmit">
                <h2 class="is-size-5 has-padding-left-20 has-padding-top-10 ok-has-text-primary-invert has-text-weight-bold">
                    {{ $t('global.snippets.delete_account') }}
                </h2>
                <ok-tile alignmentClass="align-items-start">
                    <template v-slot:content>
                        <div class="field">
                            <label for="username" class="label has-text-left ok-has-text-primary-invert-80">
                                <ok-lock-open class="ok-svg-icon-primary-invert has-margin-right-10"></ok-lock-open>
                                {{ $t('global.keywords.password') }}
                            </label>

                            <div class="control">
                                <input type="password" ref="password" :placeholder="$t('global.snippets.current_password')"
                                    class="input ok-input is-rounded"
                                    required
                                    id="password" v-model="currentPassword">
                            </div>

                            <div v-if="$v.currentPassword.$invalid & formWasSubmitted" class="has-padding-top-5 has-text-left">
                                <p class="help is-danger"
                                   v-if="!$v.currentPassword.required">
                                    {{passwordRequirementText}}
                                </p>
                                <p class="help is-danger"
                                   v-if="!$v.currentPassword.maxLength">
                                    {{passwordMaxLengthError}}
                                </p>
                                <p class="help is-danger"
                                   v-if="!$v.currentPassword.minLength">
                                    {{passwordMinLengthError}}
                                </p>
                            </div>
                        </div>
                    </template>
                </ok-tile>
                <ok-tile>
                    <template v-slot:content>
                        <div class="columns">
                            <div class="column">
                                <button
                                    class="button is-rounded is-borderless has-width-100-percent ok-has-background-primary-highlight ok-has-text-primary-invert"
                                    @click.prevent="handleCancelClick"
                                >
                                    {{ $t('global.keywords.cancel') }}
                                </button>
                            </div>

                            <div class="column">
                                <button
                                    class="button is-rounded is-borderless has-width-100-percent ok-has-background-accent has-text-white has-text-weight-bold"
                                    :disabled="requestInProgress"
                                >{{ $t('global.keywords.delete') }}</button>
                            </div>
                        </div>
                    </template>
                </ok-tile>
            </form>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .ok-bio-textarea {
        resize: none;
        height: 150px;
        border-radius: 1em !important;
    }

    .ok-user-cover-container {
        height: 190px;
        overflow: hidden;
        position: relative;

        .ok-user-cover {
            position: absolute;
            left: 0;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
        }
    }

    .ok-user-avatar-container {
        display: inline-block;
        margin-left: 20px;
        margin-top: -48px;
        position: relative;
    }

    .ok-user-avatar-container, .ok-user-cover-container {
        .actions {
            position: absolute;
            bottom: 10px;
            right: 10px;

            .button {
                padding: 8px;
                height: auto;
            }
        }
    }
</style>

<script lang="ts">
    import { Component, Prop, Vue } from 'nuxt-property-decorator';
    import { Validate } from 'vuelidate-property-decorators';

    import OkTile from '~/components/tiles/OkTile.vue';

    import { BehaviorSubject } from 'rxjs';
    import { IUser } from '~/models/auth/user/IUser';
    import { IUserService } from '~/services/user/IUserService';
    import { IModalService, UserProfileImages } from '~/services/modal/IModalService';
    import { IUtilsService } from '~/services/utils/IUtilsService';
    import { okunaContainer } from '~/services/inversify';
    import { TYPES } from '~/services/inversify-types';

    import {passwordMaxLength, passwordMinLength, passwordValidators} from '~/validators/password';
    import {DeleteUserApiParams, UpdateUserSettingsApiParams} from "~/services/Apis/auth/AuthApiServiceTypes";
    import {IToastService} from "~/services/toast/IToastService";
    import {ToastType} from "~/services/toast/lib/ToastType";
    import {ILocalizationService} from "~/services/localization/ILocalizationService";
    import {INavigationService} from "~/services/navigation/INavigationService";
    import {ICircle} from "~/models/connections/circle/ICircle";

    @Component({
        name: 'OkDeleteAccountSettings',
        components: {
            OkTile,
        },
        subscriptions: function () {
            return {
                loggedInUser: this['userService'].loggedInUser
            };
        }
    })
    export default class OkDeleteAccountSettings extends Vue {
        $observables!: {
            loggedInUser: BehaviorSubject<IUser | undefined>
        };

        formWasSubmitted: boolean = false;
        requestInProgress: boolean = false;

        @Validate(passwordValidators)
        currentPassword: string = '';

        private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
        private modalService: IModalService = okunaContainer.get<IModalService>(TYPES.ModalService);
        private utilsService: IUtilsService = okunaContainer.get<IUtilsService>(TYPES.UtilsService);
        private toastService: IToastService = okunaContainer.get<IToastService>(TYPES.ToastService);
        private localizationService: ILocalizationService = okunaContainer.get<ILocalizationService>(TYPES.LocalizationService);
        private navigationService: INavigationService = okunaContainer.get<INavigationService>(TYPES.NavigationService);

        mounted() {
            this.$refs.password.focus();
        }

        confirmAccountDeletion() {
            this.modalService.openConfirmationModal({
                title: 'Confirm account deletion',
                contents: 'Are you sure you want to delete your account? This is a permanent action and can\'t be undone.',
                confirmationButtonText: this.$t('global.keywords.yes').toString(),
                cancelButtonText: this.$t('global.keywords.no').toString(),
                confirmationCallback: this.onWantsToDeleteCircle as any,
                cancelCallback: this.handleCancelClick
            });
        }

        async onWantsToDeleteCircle() {
            this.requestInProgress = true;

            try {
                const deleteUserApiParams: DeleteUserApiParams = {
                    password: this.currentPassword
                };

                await this.userService.deleteUser(deleteUserApiParams);

                this.requestInProgress = false;
                this.formWasSubmitted = false;
                this.toastService.show({
                    message: this.localizationService.localize("global.keywords.goodbye"),
                    type: ToastType.success,
                    duration: 5000
                });
                this.$emit('onSaveComplete');
                await this.userService.logout();
                await this.navigationService.navigateToLogin();
                this.toastService.show({
                    message: "You have been logged out",
                    type: ToastType.success,
                });
            } catch (err) {
                const handledError = this.utilsService.handleErrorWithToast(err);

                if (handledError.isUnhandled) {
                    throw handledError.error;
                }

                this.requestInProgress = false;
                this.formWasSubmitted = false;
            }
        }

        async handleFormSubmit(e: Event) {
            e.preventDefault();

            if (this.requestInProgress) {
                return;
            }

            this.formWasSubmitted = true;
            const isValid = this._validateAll();

            if (!isValid) {
                return;
            }

            this.confirmAccountDeletion();
        }

        get passwordMaxLengthError() {
            return this.$t("global.errors.password.max_length", {
                max: passwordMaxLength
            });
        }

        get passwordMinLengthError() {
            return this.$t("global.errors.password.min_length", {
                min: passwordMinLength
            });
        }

        get passwordRequirementText() {
            return this.$t("global.snippets.password_requirement", {
                min: passwordMinLength,
                max: passwordMaxLength
            });
        }

        _validateAll() {
            this.$v.$touch();
            return !this.$v.$invalid;
        }

        handleCancelClick() {
            this.modalService.openAccountSettingsModal();
        }
    }
</script>
