<template>
    <div
        class="columns is-centered is-vcentered has-height-100-percent is-paddingless ok-has-background-primary-highlight has-background-emojis is-marginless">
        <div class="column is-narrow">
            <div
                class="card is-relative has-overflow-hidden ok-has-background-primary ok-register-page-card is-flex flex-direction-column">
                <div class="card-header ok-has-border-bottom-primary-highlight">
                    <div class="card-header-title is-flex align-items-center justify-center has-padding-20">
                        <h2 class="is-size-5 is-flex align-items-center justify-center">
                            <span v-twemoji class="icon">✨</span>
                            <span class="has-padding-left-10 ok-has-text-primary-invert">Request Invite</span>
                        </h2>
                    </div>
                </div>
                <div class="card-content has-text-centered is-flex-1"
                     :style="{padding: registerFormClass ? '0 !important' : null}">
                    <form v-if="!inviteSend" class="has-text-left" @submit.prevent="onSubmit">
                        <div class="field">
                            <label for="userEmail" class="label is-medium ok-has-text-primary-invert">
                                {{$t('global.snippets.whats_your_email')}}
                            </label>
                            <div class="control">
                                <input type="email"
                                       ref="email"
                                       placeholder="e.g. vincent@vega.com"
                                       class="input is-rounded is-medium ok-input"
                                       required
                                       id="userEmail" v-model="userEmail">
                            </div>
                            <div v-if="($v.userEmail.$invalid || !emailIsAvailable)" class="has-padding-top-5">
                                <p class="help is-danger" v-if="!$v.userEmail.required">
                                    {{$t('global.errors.email.required')}}
                                </p>
                                <p class="help is-danger" v-else-if="!$v.userEmail.email">
                                    {{$t('global.errors.email.invalid')}}
                                </p>
                                <p class="help is-danger" v-else-if="!emailIsAvailable">
                                    {{$t('global.errors.email.taken')}}
                                </p>
                            </div>
                        </div>
                        <ok-buttons-navigation
                            next-text="Request Invite"
                            previous-text="Cancel"
                            :onNext="onSubmit" :onPrevious="onPrevious" class="has-padding-top-20"/>
                    </form>
                    <div v-else>
                        <div class="has-padding-bottom-20">
                            <span v-twemoji class="icon is-large">🐣</span>
                        </div>
                        <div class="content">
                            <h4>
                                Invite Sent
                            </h4>
                            <p>
                                Hooray! your invite is on the way please check your email.
                            </p>
                        </div>
                        <ok-buttons-navigation
                            :onNext="onSignUp"
                            :next-text="$t('global.snippets.sign_up')"
                            class="has-padding-top-20"/>
                    </div>
                </div>
                <div class="card-footer ok-has-border-top-primary-highlight">
                    <div class="card-footer-item ok-has-text-primary-invert-60">
                  <span>
                      {{ $t('global.snippets.already_have_an_account') }}
                  </span>
                        <nuxt-link :to="localePath({path: '/a/login'})"
                                   class="has-text-underline has-padding-left-5">
                            {{ $t('global.snippets.login') }}
                        </nuxt-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

.ok-register-page-card {
    @include for-size(desktop-up) {
        max-width: 370px;
        min-width: 300px;
    }
}


.has-background-confetti {
    background: url("./assets/confetti-background.gif");
}

</style>

<script lang="ts">
import {Component, Vue} from "nuxt-property-decorator"
import OkLogo from "~/components/okuna-logo/OkLogo.vue";
import {ILoggingService} from "~/services/logging/ILoggingService";
import {okunaContainer} from "~/services/inversify";
import {TYPES} from "~/services/inversify-types";
import {IOkLogger} from "~/services/logging/types";
import {INavigationService} from "~/services/navigation/INavigationService";
import OkRegisterTokenForm from "~/components/forms/OkInviteTokenForm.vue";
import OkRegisterForm from "~/components/forms/register-form/OkRegisterForm.vue";
import {ILocalizationService} from "~/services/localization/ILocalizationService";
import {IToastService} from "~/services/toast/IToastService";
import {ToastType} from "~/services/toast/lib/ToastType";
import {RegistrationResponse} from "~/services/Apis/auth/AuthApiServiceTypes";
import OkRegisterUserEmailForm from "~/components/forms/register-form/components/OkRegisterUserEmailForm.vue";
import OkButtonsNavigation from "~/components/navigation/OkButtonsNavigation.vue";
import {Validate} from "vuelidate-property-decorators";
import {emailValidators} from "~/validators/email";
import {CancelableOperation} from "~/lib/CancelableOperation";
import {IUserService} from "~/services/user/IUserService";
import {IUtilsService} from "~/services/utils/IUtilsService";

@Component({
    name: "OkRequestInvite",
    components: {OkButtonsNavigation, OkRegisterUserEmailForm, OkRegisterForm, OkRegisterTokenForm, OkLogo},
})
export default class OkRegisterPage extends Vue {

    private navigationService: INavigationService = okunaContainer.get<INavigationService>(TYPES.NavigationService);
    private loggingService: ILoggingService = okunaContainer.get<ILoggingService>(TYPES.LoggingService);
    private toastService: IToastService = okunaContainer.get<IToastService>(TYPES.ToastService);
    private localizationService: ILocalizationService = okunaContainer.get<ILocalizationService>(TYPES.LocalizationService);
    private logger: IOkLogger;


    private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
    private utilsService: IUtilsService = okunaContainer.get<IUtilsService>(TYPES.UtilsService);

    requestOperation?: CancelableOperation<boolean>;

    formWasSubmitted = false;
    submitInProgress = false;
    inviteSend = false;

    @Validate(emailValidators)
    userEmail = "";

    emailIsAvailable = true;

    registerFormClass = "";

    $refs!: {
        email: HTMLInputElement
    };

    mounted() {
        this.logger = this.loggingService!.getLogger({
            name: "OkAuthRegisterPage"
        });
    }

    onUserEmailIsValid(userEmail: string) {
        this.userEmail = userEmail;
    }

    onSignUp() {
        this.navigationService.navigateToRegister();
    }
    async onSubmit() {
        try {
            this.requestOperation = CancelableOperation.fromPromise<boolean>(this.userService.requestInviteToken({
                email: this.userEmail
            }));
            const value = await this.requestOperation.value;
            if (typeof value === "boolean" && !value) {
                this.toastService.show({
                    message: `Email address already signed up, please email admin@openspacelive.com if you’re having trouble with the sign up process`,
                    type: ToastType.error,
                    duration: 10000
                });
                this.inviteSend = false;
                return;
            } else {
                this.inviteSend = true;
            }
        } catch (error) {
            const handledError = this.utilsService.handleErrorWithToast(error);
            if (handledError.isUnhandled) throw handledError.error;
        } finally {
            this.requestOperation = undefined;
        }
    }

    onPrevious() {
        this.navigationService.navigateToLogin();
    }

}
</script>
