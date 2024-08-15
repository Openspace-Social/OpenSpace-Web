<template>
    <section class="ok-follow-lists-stream">
        <div class="flex flex-row justify-between items-center">
            <button
                @click="onBackClicked"
                class="is-rounded has-text-weight-bold is-small ok-has-text-accent">
                <ok-chevron-left-icon />
                <span class="is-size-5 ok-has-text-primary-invert has-text-weight-bold">
                    {{ isEditMode ? $t('global.keywords.edit_list') : $t('global.keywords.create_list') }}
                </span>
            </button>

            <button
                @click="onSubmit"
                class="button is-rounded ok-has-background-primary-highlight has-text-weight-bold is-small ok-has-text-primary-invert">
                {{ isEditMode ? $t('global.keywords.update') : $t('global.keywords.save') }}
            </button>
        </div>
        <div class="flex flex-col">
            <form class="has-text-left has-padding-top-20" @submit.prevent="onSubmit">
                <div class="">
                    <div class="field">
                        <label for="listname" class="label has-text-left ok-has-text-primary-invert-80">
                            <ok-community-title-icon class="ok-svg-icon-primary-invert has-margin-right-10"></ok-community-title-icon>
                            {{ $t('manage_list.name') }}
                        </label>

                        <div class="control">
                            <input type="text"
                                   :placeholder="$t('manage_list.placeholder')"
                                   class="input ok-input is-rounded"
                                   required
                                   id="listName" v-model="listName">
                        </div>

                        <div v-if="($v.listName.$invalid || !nameIsAvailable) && !formWasSubmitted" class="has-padding-top-5 has-text-left">
                            <p class="help is-danger" v-if="!$v.listName.required">
                                {{$t('global.errors.list_name.required')}}
                            </p>
                            <p class="help is-danger" v-else-if="!$v.listName.maxLength">
                                {{listNameMaxLengthError}}
                            </p>
                            <p class="help is-danger" v-else-if="!$v.listName.minLength">
                                {{listNameMinLengthError}}
                            </p>
                            <p class="help is-danger" v-else-if="!nameIsAvailable">
                                {{$t('global.errors.list_name.taken')}}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="has-padding-top-20">
                    <div
                        class="has-width-100-percent">
                        <div >
                            <div>
                                <span class="has-text-weight-bold ok-has-text-primary-invert">{{ $t('manage_list.emoji') }}</span>
                            </div>
                            <div class="is-flex wrap">
                                <div role="button"
                                     v-for="listEmoji in emojis"
                                     :key="listEmoji.id"
                                     class="is-flex has-cursor-pointer has-padding-right-20 has-padding-bottom-10 has-padding-top-10"
                                     @click="onSelectedEmojiChanged(listEmoji)"
                                >
                                    <figure
                                        :class="{ 'ok-has-background-primary-highlight rounded-full p-1.5': selectedEmoji.id === listEmoji.id }" class="p-1.5 image is-32x32">
                                        <img :src="listEmoji.image" :alt="listEmoji.keyword">
                                    </figure>
                                </div>
                            </div>
                            <div v-if="selectedEmoji === null" class="has-padding-top-5 has-text-left">
                                <p class="help is-danger">
                                    {{$t('global.errors.list_name.emoji_required')}}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </section>
</template>

<style lang="scss" scoped>
.ok-follow-lists-stream {
    height: calc(100vh - 240px);
    width: 100%;
    overflow-y: auto;
}
</style>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'nuxt-property-decorator';
import {BehaviorSubject} from 'rxjs';
import {IUser} from '~/models/auth/user/IUser';
import {okunaContainer} from '~/services/inversify';
import {TYPES} from '~/services/inversify-types';
import {IUserService} from '~/services/user/IUserService';

import OkHttpList from '~/components/http-list/OkHttpList.vue';
import OkUserListItem from '~/components/user-list/common/user-list-item/OkUserListItem.vue';
import OkBlockedUserListItem from "~/components/user-list/common/user-list-item/OkBlockedUserListItem.vue";
import OkBlockButton from "~/components/buttons/OkBlockButton.vue";
import {CancelableOperation} from "~/lib/CancelableOperation";
import {IUtilsService} from "~/services/utils/IUtilsService";
import {IList} from "~/models/lists/list/IList";
import OkListTile from "~/components/user-list/lists/components/OkListTile.vue";
import OkListAvatar from "~/components/user-list/lists/components/OkListAvatar.vue";
import OkLoadingIndicator from "~/components/utils/OkLoadingIndicator.vue";
import OkTile from "~/components/tiles/OkTile.vue";
import {createListNameValidator, listNameMaxLength, listNameMinLength, listNameValidator} from '~/validators/list-name';
import {Validate} from "vuelidate-property-decorators";
import {communityNameMaxLength, communityNameMinLength, communityNameValidators} from "~/validators/community-name";
import {IEmojiGroup} from "~/models/common/emoji-group/IEmojiGroup";
import {IEmoji} from "~/models/common/emoji/IEmoji";

@Component({
    name: 'OkCreateList',
    components: {
        OkTile,
        OkLoadingIndicator,
        OkListAvatar, OkListTile, OkBlockButton, OkBlockedUserListItem, OkHttpList, OkUserListItem
    },
    subscriptions: function () {
        return {
            loggedInUser: this['userService'].loggedInUser
        };
    }
})
export default class OkCreateList extends Vue {
    static infiniteScrollChunkUsersCount = 10;

    @Prop({ type: Object, default: null }) readonly existingList!: IList | null;

    $observables!: {
        loggedInUser?: BehaviorSubject<IUser | undefined>
    };

    private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
    private utilsService: IUtilsService = okunaContainer.get<IUtilsService>(TYPES.UtilsService);

    @Validate(listNameValidator)
    listName: string = '';

    nameIsAvailable = false;

    emojis: IEmoji[] = [];
    selectedEmoji: IEmoji | null = null;

    requestOperation?: CancelableOperation<boolean>;
    formWasSubmitted = false;
    submitInProgress = false;

    get isEditMode() {
        return this.existingList !== null;
    }

    async debouncedNameCheck(value: string) {
        try {
            this.requestOperation = CancelableOperation.fromPromise<boolean>(this.userService.isListNameAvailable(value));
            this.nameIsAvailable = await this.requestOperation.value;
        } catch (error) {
            this.nameIsAvailable = false;
            const handledError = this.utilsService.handleErrorWithToast(error);
            if (handledError.isUnhandled) throw handledError.error;
        } finally {
            this.requestOperation = undefined;
        }
    }

    @Watch("listName")
    onListNameChange(val: string, oldVal: string) {
        if (val === this.existingList.name) {
            this.nameIsAvailable = true;
            return;
        }
        if (this.requestOperation) {
            this.requestOperation.cancel();
            this.requestOperation = undefined;
        }
        this.debouncedNameCheck(val);
    }

    get listNameMaxLengthError() {
        return this.$t('global.errors.list_name.max_length', {
            max: communityNameMaxLength
        });
    }

    get listNameMinLengthError() {
        return this.$t('global.errors.list_name.min_length', {
            max: communityNameMinLength
        });
    }

    async onSubmit() {
        if (this.submitInProgress) return;
        this.submitInProgress = true;

        const formIsValid = await this._validateAll();

        this.formWasSubmitted = true;
        if (formIsValid) {
            await this._onSubmitWithValidForm();
        }

        this.submitInProgress = false;
    }

    async _onSubmitWithValidForm() {
        if (this.requestOperation) return;

        if (this.listName !== this.existingList?.name) {
            try {
                this.requestOperation = CancelableOperation.fromPromise<boolean>(this.userService.isListNameAvailable(this.listName));
                this.nameIsAvailable = await this.requestOperation.value;
            } catch (error) {
                const handledError = this.utilsService.handleErrorWithToast(error);
                if (handledError.isUnhandled) throw handledError.error;
            } finally {
                this.requestOperation = undefined;
            }

            if (!this.nameIsAvailable) return;
        }

        if (this.isEditMode) {
            try {
                await this.userService.updateList(this.existingList!.id,{
                    name: this.listName,
                    emojiId: this.selectedEmoji!.id,
                    usernames: this.existingList!.users.map(user => user.username)
                });
                this.$emit('list-updated');
            } catch (error) {
                const handledError = this.utilsService.handleErrorWithToast(error);
                if (handledError.isUnhandled) throw handledError.error;
            }
        } else {
        try {
            await this.userService.createList({
                name: this.listName,
                emojiId: this.selectedEmoji!.id
            });
            this.$emit('list-created');
        } catch (error) {
            const handledError = this.utilsService.handleErrorWithToast(error);
            if (handledError.isUnhandled) throw handledError.error;
        }
        }
    }

    _validateAll() {
        this.$v.$touch();
        return !this.$v.$invalid;
    }


    async fetchEmojis() {
        let emojiGroups = await this.userService.getListEmojiGroups();
        this.emojis = emojiGroups[0].emojis;
    }

    onSelectedEmojiChanged(emoji: IEmoji) {
        this.selectedEmoji = emoji;
    }

    onBackClicked() {
        this.$emit('back-clicked');
    }

    mounted() {
        this.fetchEmojis();
        this.listName = this.existingList ? this.existingList.name : '';
        this.selectedEmoji = this.existingList ? this.existingList.emoji : null;
        console.log(this.selectedEmoji);
    }

}
</script>
